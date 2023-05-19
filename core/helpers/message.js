const M = exports
const G = require('../vars/global')
const C = require('../vars/config')


M.checkMessage = function (message) {
    const pattern = M.extractPattern(message)
    if (!pattern)
        return

    const result = {
        lesson: M.extractLesson(message),
        target: M.extractTarget(message, pattern)
    }

    if (result.lesson && result.target)
        return result
}

M.sendMessage = async function (lesson, username) {
    const timestamp = new Date().getTime()

    for (const client of G.slaves) {
        if (timestamp <= client.data.until)
            continue

        try {
            await client.sendMessage(username, {
                message: `سلام برام نوتیف کانال اگهیتونو اتفاقی دیدم منم ${lesson} داشتم ترم قبل
حواستون باشه تو این کانال همه کلاه بردارن جواب الکی میفرستن ترم قبل اینقد پولمو خوردن اخرشم افتادم🤦‍♀😬😬`
            })
            await client.sendMessage(username, {
                message: `@mth_1994x
@Rzaei_1401
این دوتا به سختی پیدا کردم خوب بودن
مخصوصا اولی بازم خاستین تست بگیرن مطمعن باشین
تبلیغ نیست نمیخاستم یکی دیگم مثل من صفر بشه
بدون منت کمک کردم لطفا شمام به کس دیگه کمک کنید🙏`
            })
            return true
        } catch (error) {
            if (error.errorMessage === 'PEER_FLOOD') {
                //
                client.data.until = timestamp
                        + (2 * 86400) * 1000
            }
        }
    }
}

M.extractPattern = function (message) {
    for (const pattern of C.patterns)
        if (G.ext.regex.exec(message, G.ext.regex(pattern.message)))
            return pattern
}

M.extractLesson = function (message) {
    let result

    for (const lesson of C.lessons)
        if (M.sentenceContains(message, lesson.name))
            if (!result
                || lesson.name.length > result.name.length)
                result = lesson

    return result
}

M.extractTarget = function (message, pattern) {
    return G.ext.regex.exec(message, G.ext.regex(pattern.target))
            ?.groups?.id
}

M.sentenceContains = function (sentence, other) {
    return sentence.includes(other)
}
