
import {showRules} from './helper.js'

const a = document.getElementById('output')
const rules = await showRules()
const ret = []
for(const r of rules) {
    const x = document.createElement('div')
    x.innerHTML = r
    ret.push(r)
    a.appendChild(x)
}

// console.log(a)