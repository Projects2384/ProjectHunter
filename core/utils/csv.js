const M = exports
const G = require('../vars/global')


M.read = function (path) {
    return new Promise((resolve, reject) => {
        const result = []

        G.ext.fs.createReadStream(path)
            .pipe(G.ext.csv.reader())
            .on('data',
                (data) => result.push(data))
            .on('finish',
                () => resolve(result))
    })
}

M.write = function (path, data, headers=true) {
    return new Promise((resolve, reject) => {
        const file = G.ext.fs.createWriteStream(path)

        for (const record of data) {
            if (headers) {
                file.write(Object.keys(record).join(',') + '\n')
                headers = false
            }
            file.write(Object.values(record).join(',') + '\n')
        }

        file
            .end()
            .on('finish',
            () => resolve())
    })
}
