
const f = async()=>{
    var rules = require("../index.js")
    let y = await rules.flat({
        d:1,
        f:2,
        g:{
            y:1
        }
    })
    console.log(y)
}

f()


