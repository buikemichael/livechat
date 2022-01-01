var express = require('express');
var path = require('path');
const db = require("./models")
const { v4: uuidv4 } = require('uuid');
require('dotenv').config()
var app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: process.env.URL,
        methods: ["GET", "POST"],
        credentials: true,
    },
});

/* 
this will probably be moved in the future
*/
const models = require('./models')
const { Op } = require("sequelize");



io.use((socket, next) => {
    next();
});

io.on('connection', (socket) => {
    console.log('a user connected')

    socket.on('register', (data, callback) => {
        (async function (data) {
            try {
                const user = await models.User.findOne({ where: { username: data.username } })
                if (user) {
                    return console.log('user exists')
                }
                const newUser = await models.User.create({
                    id: uuidv4(),
                    username: data.username,
                    connected: true,
                })
                socket.join(newUser.id)
                return callback({
                    status: "ok",
                    userID: newUser.id
                })
            } catch (e) {
                console.log(e)
            }
        })(data)
    })

    socket.on('login', (data, callback) => {
        (async function (data) {
            try {
                const user = await models.User.findOne({ where: { username: data.username } })
                if (!user) {
                    return console.log('User does not exist')
                }
                socket.join(user.id)
                return callback({
                    status: "ok",
                    userID: user.id
                })
            } catch (e) {
                console.log(e)
            }
        })(data)
    })

});

const homeNamespace = io.of("/home");
homeNamespace.use((socket, next) => {
    console.log('hhhh')
    const userID = socket.handshake.auth.authId;
    socket.userId = userID
    socket.join(userID)

    /* will later do proper auth. for now lets just check if the ID is valid and let the user through */
    if (userID) {
        (async function () {
            try {
                const user = await models.User.findByPk(userID)
                if (user) {
                    return next()
                }
            } catch (e) {
                console.log(e)
            }

        })()
    } else {
        return next(new Error("user not found"));
    }
});
homeNamespace.on('connection', (socket) => {
    console.log('a user is logged in');

    /* this part of the code may be removed when we have proper authentication */
    (async function () {
        try {
            const user = await models.User.findByPk(socket.userId)
            if (user) {
                socket.emit('userDetail', user)
            }
        } catch (e) {
            console.log(e)
        }

    })();

    (async function () {
        try {
            const friendRequest = await models.Friend.findAll({ where: { friendId: socket.userId, status: 2 }, include: 'userData' })
            if (friendRequest) {
                socket.emit('friendRequest', friendRequest)
            }
        } catch (e) {
            console.log(e)
        }

    })();


    socket.on('onlineUser', (data) => {
        (async function () {
            try {
                const users = await models.Friend.findAll({
                    where: {
                        userId: socket.userId,
                        status: 1
                    },
                    include: [
                        { model: models.User, as: 'friendData' },
                        { model: models.Message, as: 'lastMessage', order: [['createdAt', 'DESC']], limit: 1 },
                        { model: models.Message, as: 'unReadMessage', where: { 'status': 0 }, order: [['createdAt', 'DESC']], limit: 1 }
                    ]
                })
                socket.emit('onlineUsersRes', users)
            } catch (e) {
                console.log(e)
            }
        })()
    })
    socket.on('getChat', (data, callback) => {
        (async function () {
            try {
                await models.Message.update({ 'status': 1, }, { where: { to: socket.userId, from: data.userId } })
                const messages = await models.Message.findAll({
                    where: {
                        [Op.or]: [
                            { to: data.userId, from: socket.userId },
                            { to: socket.userId, from: data.userId }
                        ]
                    },
                    order: [['createdAt', 'ASC']]
                })
                callback({
                    messages
                })
            } catch (e) {
                console.log(e)
            }

        })()
    })
    socket.on('newMessage', (data) => {
        (async function () {
            try {
                const message = await models.Message.create({
                    id: data.id,
                    to: data.to,
                    from: data.from,
                    content: data.content,
                    messageId: data.messageId,
                    status: 0
                })
                return socket.to(data.to).emit('newMessage', {
                    message
                })
            } catch (e) {
                console.log(e)
            }

        })()
    })
    socket.on('friendRequest', (data, callback) => {
        (async function () {
            try {
                const user = await models.User.findOne({ where: { username: data.content } })
                if (!user) {
                    return callback({ status: 0, message: 'User does not exists' })
                }
                if (user.id === socket.userId) {
                    return callback({ status: 0, message: `You can not send a friend request to yourself` })
                }
                const friend = await models.Friend.findOne({
                    where: {
                        userId: socket.userId,
                        friendId: user.id,
                    }
                })
                if (friend) {
                    return callback({ status: 0, message: `You are already friends with ${data.content}` })
                }
                await models.Friend.create({
                    userId: socket.userId,
                    friendId: user.id,
                    messageId: uuidv4(),
                    status: 2
                })
                const friendRequest = await models.Friend.findAll({ where: { friendId: user.id, status: 2 }, include: 'userData' })
                if (friendRequest) {
                    socket.to(user.id).emit('friendRequest', friendRequest)
                }
                return callback({ status: 1, message: `Friend Request sent to ${data.content}` })
            } catch (e) {
                console.log(e)
            }
        })()

    })
    socket.on('acceptFriend', (data, callback) => {
        (async function () {
            try {
                /* confirm friend request status */
                const confirmFriend = await models.Friend.findOne({
                    where: {
                        userId: data.id,
                        friendId: socket.userId
                    }
                });
                confirmFriend.status = 1
                confirmFriend.save()
                /* 
                *create a reciprocate friend request that is automaticalled confirmed 
                *first check if the reciprocate friend already exists
                *if it does, confirm it,
                *if it doesn't exist, create it and confirm it immediately
                */
                const friend = await models.Friend.findOne({
                    where: {
                        userId: socket.userId,
                        friendId: data.id
                    }
                })
                if (friend) {
                    friend.status = 1
                    friend.messageId = confirmFriend.messageId
                    await friend.save()
                    socket.to(data.id).emit('friendRequestAccepted')
                    return callback({ status: 1, message: 'Friend Request has been confirmed' })
                }
                await models.Friend.create({
                    friendId: data.id,
                    userId: socket.userId,
                    messageId: confirmFriend.messageId,
                    status: 1
                })
                socket.to(data.id).emit('friendRequestAccepted')
                return callback({ status: 1, message: 'Friend Request has been accepted' })
            } catch (e) {
                console.log(e)
            }

        })()
    })
})







// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});



async function testDatabase() {
    try {
        await db.sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
testDatabase()
// "start": "node ./bin/www",

server.listen(process.env.PORT, () => {
    console.log(`listening on *:${process.env.PORT}`);
});
module.exports = app;
