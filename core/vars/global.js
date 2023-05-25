const M = exports


M.telegram = require('telegram')
M.db       = require('mongoose')

M.ext = {
    express: {
        session   : require('client-sessions'),
        bodyParser: require('body-parser')
    },
    telegram: {
        events    : require('telegram/events'),
        sessions  : require('telegram/sessions'),
        api       : require('telegram').Api
    },
    //
    fs : require('fs'),
    csv: {
        reader: require('csv-parser'),
        writer: require('csv-writer')
    },
    //
    input: require('input'),
    regex: require('xregexp'),
    diff : require('difflib')
}


M.init = async function () {
    const utilClient = require('../helpers/client')

    M.clients = await utilClient.createAll()

    M.master = M.clients[0]
    M.slaves = M.clients.slice(1)
}
