const M = exports
const C = require('../core/vars/config')
const G = require('../core/vars/global')


M.app = G.express()
// set view engine
M.app.engine('mustache', G.mustache())
M.app.set('view engine', 'mustache')
M.app.set('views', `${__dirname}/views`)
//
M.app.use(G.express.urlencoded({ extended: false }))

M.app.use(G.ext.express.session({
    secret           : 'XwPp9xazJ0ku5CZnlmgAx2Dld8SHkAeT',
    cookieName       : 'auth',
    requestKey       : 'auth',
    duration         : 24 * 60 * 60 * 1000
}))

M.app.use('/static', G.express.static(`${__dirname}/public`))
M.app.use('/'      , require('./routes/auth').router)
M.app.use('/'      , require('./routes/edit/file').router)


M.init = async function () {
    M.app.listen(C.port, () => {
        console.log(`Port: ${C.port}, Panel started`)
    })
}