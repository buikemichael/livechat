
const map = new Map();

function findSession(id) {
    return map.get(id)
}
function saveSession(id, session) {
    return map.set(id, session)
}
function findAllSession() {
    return [...map.values()]
}
module.exports = { findSession, saveSession, findAllSession }