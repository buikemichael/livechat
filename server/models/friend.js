'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Friend extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Friend.hasOne(models.User, {
                foreignKey: 'id',
                sourceKey: 'userId',
                as: 'userData'
            })
            Friend.hasOne(models.User, {
                foreignKey: 'id',
                sourceKey: 'friendId',
                as: 'friendData'
            })
            Friend.hasMany(models.Message,{
                foreignKey:'messageId',
                sourceKey:'messageId',
                as:'lastMessage'
            })
            Friend.hasMany(models.Message,{
                foreignKey:'messageId',
                sourceKey:'messageId',
                as:'unReadMessage'
            })
        }
    };
    Friend.init({
        userId: DataTypes.STRING,
        friendId: DataTypes.STRING,
        messageId: DataTypes.STRING,
        status: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Friend',
    });
    return Friend;
};