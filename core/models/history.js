const M = exports
const G = require('../vars/global')


M.channel = new G.db.Schema({
    name                 : String,
    id                   : Number,
})

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
    },
    channel              : M.channel
})

M.model = G.db.model('history', M.schema)
