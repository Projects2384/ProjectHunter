const M = exports
const G = require('../vars/global')


M.schema = new G.db.Schema({
    user: {
        username         : String,
        name             : String
    },
    bot: {
        phone            : String,
    },
    lesson               : String,
    time: {
        date             : String,
        timestamp        : Number
    }
})

M.model = G.db.model('history', M.schema)
