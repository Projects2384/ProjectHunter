const M = exports


M.env  = process.env
M.argv = require('minimist')(process.argv.slice(2));

M.mananger = {
    username: 'ssh_full'
}

M.db = {
    url: 'mongodb+srv://lawbr3aker:GxWjB4Rc7vmhRVXo@main.cjtljzv.mongodb.net/ProjectHunter?retryWrites=true&w=majority'
}