const M = exports
const G = require('../vars/global')


M.schema = new G.db.Schema({
    id: {
        type             : Number,
        default          : 0
    },
    active               : Boolean,
    phone                : String,
    username             : String,
    password             : String,
    until                : Number,
    api: {
        id               : Number,
        hash             : String
    },
    session              : String,
}, {
    statics: {
        checkAll: async function (clients) {
            for (const client of clients) {
                const entity = await client.getMe()

                client.data.id = entity.id
                //
                await client.data.save()
            }
        }
    }
})

M.model = G.db.model('client', M.schema)
