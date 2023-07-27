const M = exports
const G = require('../vars/global')


M.channel = new G.db.Schema({
    name                 : String,
    id                   : Number
})

M.schema = new G.db.Schema({
    patterns: {
        message          : String,
        target           : String,
    },
    lesson               : Boolean,
    channels             : [M.channel],
    clients              : [String],
    messages             : [String],
    banned               : [String]
}, {
    statics: {
        checkAll: async function (client) {
            const records = await M.model.find()

            for (const record of records) {
                for (const channel of record.channels) {
                    try {
                        const entity = await client.getEntity(channel.name)

                        channel.id = entity.id
                        //
                        await record.save()
                    } catch (error) {
                        console.log(error)
                    }
                }
            }
        }
    }
})

M.model = G.db.model('group', M.schema)
