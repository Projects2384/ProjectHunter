const M = exports


M.delay = async function (time) {
    await new Promise(resolve => setTimeout(resolve, time))
}

M.current = function () {
    return new Date()
}

M.toString = function (time) {
    return  `${time.getFullYear()}/${time.getMonth()}/${time.getDay()}-` +
            `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
}