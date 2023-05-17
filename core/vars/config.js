const M = exports
const G = require("./global")
const utilCsv = require("../utils/csv");


M.paths = {
    channels: 'data/channels.csv',
    clients : 'data/clients.csv',
    lessons : 'data/lessons.csv',
    patterns: 'data/patterns.csv',

}

M.channels = []
M.clients  = []
M.lessons  = []
M.patterns = []



M.init = async function () {
    const utilCsv = require("../utils/csv");

    M.channels = await utilCsv.read(M.paths.channels)
    M.clients  = await utilCsv.read(M.paths.clients)
    M.lessons  = await utilCsv.read(M.paths.lessons)
    M.patterns = await utilCsv.read(M.paths.patterns)

    M.clients.map(x => {
        x.apiId = parseInt(x.apiId)
        x.until = parseInt(x.until)
    })
}
