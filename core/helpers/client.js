const M = exports
const G = require('../vars/global')


M.create = function (data) {
    return new G.telegram.TelegramClient(
        new G.ext.telegram.sessions.StringSession(data.session),
        //
        parseInt(
        data.apiId),
        data.apiHash,
        //
        {}
    )
}


M.checkAll = async function (clients, objects) {
    for (const client of clients) {
        const params = {}
        params.phoneNumber = () => client.data.phone
        params.phoneCode   = () => G.ext.input.text(`${client.data.phone} code:`)
        if (client.data.password)
        params.password    = () => client.data.password
        //
        params.onError = (err) => console.log(err)

        await client.start(params)

        client.data.session = client.session.save()
    }
}

M.on = function (event, client, callback) {
    client.addEventHandler(callback, event)
}

M.onAll = function (event, clients, callback) {
    for (const client of clients)
        client.addEventHandler(callback, event)
}
