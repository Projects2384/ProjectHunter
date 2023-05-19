const C = require('./core/vars/config')
const G = require('./core/vars/global')

const utilClient  = require('./core/helpers/client')
const utilMessage = require('./core/helpers/message')
const utilCsv     = require("./core/utils/csv");

async function main() {
    await C.init()
    await G.init()

    await utilClient.checkAll(G.clients)
    await utilCsv   .write(C.paths.clients, C.clients)
    //
    for (const client of G.clients) {
        // await client.connect()
        await client.getMe()
    }

    const channels = C.channels.map(x => x.id)
    const lessons  = C.lessons .map(x => x.name)

    const eventMaster = new G.ext.telegram.events.NewMessage({
        chats: channels
    })

    utilClient.on(eventMaster, G.master,
        async (event) => {
            const result = utilMessage.checkMessage(event.message.message, lessons)

            if (result) {
                if (await utilMessage.sendMessage(result.lesson.name, result.target)) {
                } else {
                    await G.master.sendMessage('armonkhan', {
                        message: 'تمام شماره ها مشکل دارند'
                    })
                }
                await utilCsv.write(C.paths.clients, C.clients)
            }
        })
}

main().then()


const express = require('express')
const app = express()

app.on("*", (req, res) => {
    console.log(req, res)
    res.send('hello world')
})

app.listen(3000, () => {
    console.log(`Server is listening on port ${443}`);
});