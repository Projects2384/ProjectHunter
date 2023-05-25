const M = exports
const G = require('../vars/global')

const Models = require('../models/all')


M.createAll = async function () {
    const records = await Models.Client.find()

    return records.map(record => {
        const client = new G.telegram.TelegramClient(
            new G.ext.telegram.sessions.StringSession(record.session),
            //
            record.api.id,
            record.api.hash,
            //
            {}
        )
        client.data = record

        return client
    })
}

M.checkAll = async function () {
    for (const client of G.clients) {
        const params = {}
        params.phoneNumber = () => client.data.phone
        params.phoneCode   = () => G.ext.input.text(`${client.data.phone} code:`)
        if (client.data.password)
        params.password    = () => client.data.password
        //
        params.onError = (err) => console.log(err)

        await client.start(params)

        client.data.session = client.session.save()
        await client.data.save()
    }
}

M.getName = function (user) {
    return user.firstName + (user.lastName && ` ${user.lastName}` || '')
}

M.on = function (event, client, callback) {
    client.addEventHandler(callback, event)
}