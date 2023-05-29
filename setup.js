const C = require('./core/vars/config')
const G = require('./core/vars/global')

const Client  = require('./core/helpers/client')
const Message = require('./core/helpers/message')

const Models = require("./core/models/all");
const {Model} = require("mongoose");


async function main() {
    // await G.db.connect(C.db.url)
    await G.db.connect("mongodb://127.0.0.1/ProjectHunter")
    console.log('DB Connected');

    await G.init()

    const login = C.argv.login
    if (login) {
        await Client.loginAll(G.clients)

        return process.exit()
    } else
        for (const client of G.clients) {
            await client.connect()
            await client.getMe()
        }

    await Models.Group .checkAll(G.master)
    await Models.Client.checkAll(G.clients)

    const groups = await Models.Group.find()
    for (let group of groups) {
        const channels = group.channels.map(x => x.id)

        const event = new G.ext.telegram.events.NewMessage({
            chats: channels
        })

        Client.on(event, G.master,
            async (event) => {
                const message = event.message
                const result  = await Message.sendMessage(message, group)

                if (result === Message.errors.ClientsBanned) {
                    await G.master.sendMessage(C.mananger.username, {
                        message: 'تمام شماره های زیر مشکل دارند‌:\n' + group.clients.join('\n')
                    })

                    return
                }
                else if (result.save == null)
                    return

                await result.save()

                console.log('Message sent:')
                console.log(` + To    : ${result.target}`)
                console.log(` + Lesson: ${result.lesson}`)
                console.log(` + Client: ${result.client.data.phone}`)
            }
        )

        console.log('Group registered:')
        console.log(` + Channels: ${group.channels.map(x => x.name)}`)
        console.log(` + Clients : ${group.clients}`)
    }
}

main().then()
