const C = require('../core/vars/config')
const G = require('../core/vars/global')

const Client  = require('../core/helpers/client')
const Message = require('../core/helpers/message')

const Models = require("../core/models/all");


async function main() {
    await G.db.connect(C.db.url)
    // await G.db.connect("mongodb://127.0.0.1/ProjectHunter")

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
                if (error.errorMessage.startsWith('USER_DEACTIVATED')) {
                    client.data.active = false
                    //
                    remove.push(index)
                    // destroy client
                    await client.destroy()
                }
            }
            await client.data.save()
        }

        for (const index of remove.reverse())
            G.clients.splice(index, 1);
      }

    for (const client of G.clients) {
        console.log(client.data.phone)

        const event = new G.ext.telegram.events.NewMessage({
            fromUsers: [777000n]
        })

        Client.on(event, client,
            async (event) => {
                const result = G.ext.regex.exec(event.message.message, G.ext.regex("(?:Login code|کد احراز هویت شما): (\\d+)"))

                if (result) {
                    console.log(`Login code: ${result[1]}, Password: ${client.data.password}`)
                } else {
                    console.log(event.message.message)
                }
            }
        )
    }
}

main().then()
