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
            //{proxy:{ip:'127.0.0.1',port:2080,socksType:5}}
        )
        client.data = record

        return client
    })
}

M.loginAll = async function (clients) {
    for (const client of clients) {
        const params = {
            phoneNumber: () => client.data.phone,
            phoneCode  : () => G.ext.input.text(`${client.data.phone} code:`),
            password   : () => client.data.password,
            //
            onError: (error) => {
                if (error.errorMessage.startsWith('PHONE_CODE'))
                    console.log('Problem with given code, Try again...')
                else
                    return true
            }
        }

        if (!client.data.password)
            delete params.password

        console.log(`${client.data.phone} logging in...`)
        try {
            await client.start(params)
        } catch (error) {
            console.log('Invalid client')
        }

        client.data.session = client.session.save()
        //
        await client.data.save()
    }
}

M.on = function (event, client, callback) {
    client.addEventHandler(callback, event)
}

M.joinChannels = async function (client, channels) {
    for (const channel of channels)
        await client.invoke(new G.ext.telegram.api.channels
                .JoinChannel({
                    channel: channel
                }))
}