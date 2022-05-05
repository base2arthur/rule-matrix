var rules = require("../index.js")

const rules_ = "operand,<,>,result,result\n\
type,calc,calc,string,double\n\
field,price/{{previous}}-1,price/{{previous}}-1,type,change\n\
label,Change Down,Change Up,Type,Change\n\
value,,,Hold,{{#calc}}{{price}}/{{previous}}-1{{/calc}}\n\
value,-0.01,,Buy,{{#calc}}{{price}}/{{previous}}-1{{/calc}}\n\
value,,0.01,Sell,{{#calc}}{{price}}/{{previous}}-1{{/calc}}"

let obj = {
	"price": 46800.5,
	"previous": 46900
	
}

let y = obj//rules.flat(obj)
console.log("Object",y)
rules.run(rules_,y,(results,labels,objects,order)=>{
    console.log(results)
})

