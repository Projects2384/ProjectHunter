const C = require('./core/vars/config')
const G = require('./core/vars/global')

const Client  = require('./core/helpers/client')
const Message = require('./core/helpers/message')

const Models = require("./core/models/all");


async function main() {
    await G.db.connect(C.db.url)
    // await G.db.connect("mongodb://127.0.0.1/ProjectHunter")
    console.log('DB Connected');

    await G.init()

    const login = C.argv.login
    if (login) {
        await Client.loginAll(G.clients)

        return process.exit()
    } else {
        const remove = []

        for (const [index, client] of G.clients.entries()) {
            try {
                await client.connect()
                await client.getMe()

                client.data.active = true
            } catch (error) {
                if (error.errorMessage === 'USER_DEACTIVATED_BAN') {
                    client.data.active = false
                    //
                    remove.push(index)
                }
            }
            await client.data.save()
        }

        for (const index of remove.reverse())
            G.clients.splice(index, 1);
      }

    await Models.Group .checkAll(G.master)
    await Models.Client.checkAll(G.clients)

    console.log(`Master: ${G.master.data.phone}`)

    const groups = await Models.Group.find()
    //
    for (let group of groups) {
        const channels = group.channels.map(x => x.id).filter(x => x > 0)

        await Client.joinChannels(G.master, channels)

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

                    console.log('Error: banned')
                    return
                }
                else if (result.save == null) {
                    console.log(`Error: code ${result}`)
                    return
                }

                await result.save()

                console.log('Message sent:')
                console.log(` + To    : ${result.user.username}`)
                console.log(` + Lesson: ${result.lesson}`)
                console.log(` + Client: ${result.bot.phone}`)
            }
        )

        console.log('Group registered:')
        console.log(' + Channels:')
        group.channels
                .map(x => {
                    if (x.id > 0)
                        console.log(`   - ${x.name}`)
                })
        console.log(` + Clients:`)
        group.clients
                .map(x => {
                    console.log(`   - ${x}`)
                })
    }
}

main().then()
