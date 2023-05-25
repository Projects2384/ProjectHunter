const M = exports
const G = require('../vars/global')


M.schema = new G.db.Schema({
    name: {
        type             : String,
        unique           : true
    }
})

M.model = G.db.model('lesson', M.schema)
