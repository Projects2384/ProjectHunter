const M = exports
const G = require('../vars/global')

const Models = require('../models/all')

const utilTime   = require('../utils/time')
const utilString = require('../utils/string')


M.errors = {
    InvalidMessage: 1,
    ClientsBanned : 2,
    DuplicateUser : 3
}


M.sendMessage = async function (message, group) {
    if (!M.checkMessage(message.message, group.patterns.message))
        return M.errors.InvalidMessage

    const clients = G.clients.filter(x => group.clients.includes(x.data.phone))
    //
    const target = M.extractTarget(message.message, group.patterns.target)
    if (group.banned.includes(target))
        return M.errors.InvalidMessage

    const history = await Models.History.findOne({ user: { username: target }})
    if (history)
        return M.errors.DuplicateUser

    let lesson = ''
    if (group.lesson) {
        lesson = await M.extractLesson(message.message)
        if (!lesson)
            return M.errors.InvalidMessage
    }

    const time      = utilTime.current()
    const timestamp = time.getTime()
    for (const client of clients) {
        if (timestamp <= client.data.until)
            continue

        try {
            for (const text of group.messages) {
                await client.sendMessage(target, {
                    message: text.replaceAll('{lesson}', lesson)
                })

                await utilTime.delay(5000)
            }

            return new Models.History({
                user: {
                    username: target
                },
                bot: {
                    phone: client.data.phone
                },
                time: {
                    date     : utilTime.toString(time),
                    timestamp: time.getTime()
                },
                lesson: lesson,
            })
        } catch (error) {
            console.log(error.errorMessage)

            if (error.errorMessage === 'PEER_FLOOD') {
                client.data.until = timestamp + (2 * 86400) * 1000
                //
                await client.data.save()
            }
        }
    }

    return M.errors.ClientsBanned;
}

M.checkRegex = function (pattern, text) {
    return G.ext.regex.exec(text, G.ext.regex(pattern))
}

M.checkMessage = function (message, pattern) {
    return M.checkRegex(pattern, message)
}

M.extractLesson = async function (message) {
    const records = await Models.Lesson.find()
    const lessons = records.map(x => x.name)

    return utilString.containsSentencesWithTypo(message, lessons).result
}

M.extractTarget = function (message, pattern) {
    const result = M.checkRegex(pattern, message)

    return result && result[0]
}
