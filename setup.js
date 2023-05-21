const C = require('./core/vars/config')
const G = require('./core/vars/global')

const Client  = require('./core/helpers/client')
const Message = require('./core/helpers/message')
const Channel = require('./core/helpers/channel')
//
const utilCsv     = require("./core/utils/csv");

const panel = require('./panel/main')


async function main() {
    await C.init()
    await G.init()

    // panel.init().then()
    // return

    await Client .checkAll(G.clients, async () => await utilCsv.write(C.paths.clients , C.clients))
    await Channel.checkAll(C.channels, G.master)
    for (const client of G.clients)
        await client.getMe()

    await utilCsv.write(C.paths.channels, C.channels)


    const channels = C.channels.map(x => x.id)
    const lessons  = C.lessons .map(x => x.name)

    const eventMaster = new G.ext.telegram.events.NewMessage({
        chats: channels
    })

    Client.on(eventMaster, G.master,
        async (event) => {
            console.log(event.message)
            const result = Message.checkMessage(event.message.message, lessons)

            if (result) {
                if (await Message.sendMessage(result.lesson.name, result.target)) {
                } else {
                    await G.master.sendMessage(C.mananger.username, {
                        message: 'تمام شماره ها مشکل دارند'
                    })
                }
                await utilCsv.write(C.paths.clients, C.clients)
            }
        })
}

main().then()
