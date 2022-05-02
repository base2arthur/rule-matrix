var rules = require("../index.js")

const rules_ = "operand,result,result\n\
type,string,string\n\
field,redirect,params.pharmacy\n\
value,patients,{{params_.pharmacy}}"

let obj = {
	"params_": {
		"pharmacy": "DDDDD"
	}
}

let y = obj//rules.flat(obj)
console.log("Flattened",y)
rules.run(rules_,y,(results,labels,objects,order)=>{
    console.log(results)
})

