const C = require('./core/vars/config')
const G = require('./core/vars/global')

const Client = require('./core/helpers/client')
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
        if (error.errorMessage.startsWith('USER_DEACTIVATED')) {
          client.data.active = false
        }

        remove.push(index)
        // destroy client
        await client.destroy()
      }
      await client.data.save()
    }

    for (const index of remove.reverse())
      G.clients.splice(index, 1);
  }

  await Models.Group.checkAll(G.master)
  await Models.Client.checkAll(G.clients)

  console.log(`Master: ${G.master.data.phone}`)

  const groups = await Models.Group.find()

  //
  async function checkMessages() {
    while (true) {
      for (let group of groups) {
        for (let channel of group.channels) {
          let messages
          if (channel.lastChecked === undefined) {
            messages = await G.master.getMessages(channel.name, {
              limit: 10
            })
          } else {
            messages = await G.master.getMessages(channel.name, {
              minId: channel.lastChecked
            })
          }

          if (messages.length > 0) {
            channel.lastChecked = messages[0].id

            for (const message of messages) {
              console.log('Message received:')
              console.log(message.message)

              const result = await Message.sendMessage(message, group)

              if (result === Message.errors.ClientsBanned) {
                await G.master.sendMessage(C.mananger.username, {
                  message: 'All of these phone numbers are banned:\n' + group.clients.join('\n')
                })

                console.log('Error: banned')
              } else if (result.save == null) {
                console.log(`Error: code ${result}`)
              } else {
                result.channel = {
                  id: channel.id,
                  name: channel.name
                }

                await result.save()

                console.log('Message sent:')
                console.log(` + To    : ${result.user.username}`)
                console.log(` + Lesson: ${result.lesson}`)
                console.log(` + Client: ${result.bot.phone}`)
              }

              console.log('')
            }
          }

          await new Promise(r => setTimeout(r, 30 * 10000));
        }

        await group.save()
      }
    }
      // const channels = group.channels.map(x => x.id).filter(x => x > 0)
      //
      // await Client.joinChannels(G.master, channels)
      //
      // const event = new G.ext.telegram.events.NewMessage({
      //   chats: channels
      // })
      //
      // Client.on(event, G.master,
      //   async (event) => {
      //     const message = event.message
      //     console.log(message, event)
      //     const result = await Message.sendMessage(message, group)
      //
      //     if (result === Message.errors.ClientsBanned) {
      //       await G.master.sendMessage(C.mananger.username, {
      //         message: 'تمام شماره های زیر مشکل دارند‌:\n' + group.clients.join('\n')
      //       })
      //
      //       console.log('Error: banned')
      //       return
      //     } else if (result.save == null) {
      //       console.log(`Error: code ${result}`)
      //       return
      //     }
      //
      //     await result.save()
      //
      //     console.log('Message sent:')
      //     console.log(` + To    : ${result.user.username}`)
      //     console.log(` + Lesson: ${result.lesson}`)
      //     console.log(` + Client: ${result.bot.phone}`)
      //   }
      // )
      //
      // console.log('Group registered:')
      // console.log(' + Channels:')
      // group.channels
      //   .map(x => {
      //     if (x.id > 0)
      //       console.log(`   - ${x.name}`)
      //   })
      // console.log(` + Clients:`)
      // group.clients
      //   .map(x => {
      //     console.log(`   - ${x}`)
      //   })
    // }
  }

  await checkMessages()
}

main().then()
