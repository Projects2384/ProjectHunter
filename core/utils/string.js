const M = exports
const G = require('../vars/global')

const Differ = new (require('./diff'))


M.containsSentenceWithTypo = function (base, target, threshold=2) {
    const diffResult = Differ.main(target, base)

    const result = diffResult.slice(diffResult.findIndex(v => v[0] === 0)).map(v => v[1]).join('')
    const words  = result.split(' ')

    let maxRatio = 0;
    for (let t = 0; t < threshold; ++t) {
        const current      = words.slice(0, target.split(' ').length + t).join(' ')
        const currentRatio = M.ratio(current, target)

        maxRatio = Math.max(maxRatio, currentRatio)
    }

    return maxRatio;
}

M.containsSentencesWithTypo = function (base, targets, minRatio=0.87, threshold=2) {
    const best = {
        ratio : 0,
        result: null
    }

    for (const target of targets) {
        const currentRatio = M.containsSentenceWithTypo(base, target, threshold)

        if (currentRatio > minRatio) {
            if (best.ratio === 0 || target.length > best.result.length) {
                best.ratio  = currentRatio
                best.result = target
            }
        }
    }

    return best
}

M.ratio = function (a, b) {
    return new G.ext.diff.SequenceMatcher(null, a, b).ratio()
}