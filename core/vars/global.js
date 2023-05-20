const M = exports


M.express   = require('express')
M.mustache = require('mustache-express')
M.telegram = require('telegram')

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
    regex: require('xregexp')
}

M.env = process.env

M.clients = []
M.slaves  = []
M.master  = null


M.init = async function () {
    const C = require('./config')
    //
    const utilClient = require('../helpers/client')

    for (const data of C.clients) {
        const client = utilClient.create(data)
        client.data = data

        M.clients.push(client)
    }

    M.master = M.clients[0]
    M.slaves = M.clients.slice(1)
}
