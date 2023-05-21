const M = exports
const C = require('../../../core/vars/config')
const G = require('../../../core/vars/global')


M.router = G.express.Router()

M.router.get('/edit/file', async (req, res) => {
    const file = {
        path: req.query.path
    }

    if (G.ext.fs.existsSync(file.path))
        file.content = G.ext.fs.readFileSync(file.path)
    console.log(file)
    res.render('edit-file', {
        file: file
    })
})
M.router.post('/edit/file', async (req, res) => {
    const file = {
        path   : req.query.path,
        content: req.body.content
    }

    console.log(file)
})
