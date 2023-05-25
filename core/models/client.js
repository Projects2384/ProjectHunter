const M = exports
const G = require('../vars/global')


M.schema = new G.db.Schema({
    id: {
        type             : Number,
        default          : 0
    },
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
                const record = await M.model.findOne({ phone: client.data.phone, id: 0 })

                if (!record)
                    continue

                record.id = entity.id

                await record.save()
            }
        }
    }
})

M.model = G.db.model('client', M.schema)
