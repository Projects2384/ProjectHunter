const M = exports
const C = require('../../core/vars/config')
const G = require('../../core/vars/global')


M.router = G.express.Router()

M.router.get('/auth', async (req, res) => {
    res.render('auth')
})
M.router.post('/auth', async (req, res) => {
    const password = req.body.password

    if (password !== C.panel.password)
        res.send("رمز نادرست است")
    else
        req.auth.logged = true


})
