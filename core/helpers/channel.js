const M = exports
const G = require('../vars/global')


M.checkAll = async function (channels, user) {
    for (const data of channels) {
        if (!data.id) {
            const r = await user.invoke(
                new G.ext.telegram.api.channels.GetFullChannel({
                    channel: data.name
                }))
            //
            data.id = r.fullChat.id
        }
    }
}

M.getEntity = function (client, id) {
    return client.invoke(new G.ext.telegram.api.channels.GetFullChannel({
        channel: id
    }))
}