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
	"previous": 43900,
	"test":{
		"X":3
	
	}
	
}
const d = async()=>{
	var t1 = new Date();
	let y = await rules.run2(rules_,obj)
	var t2 = new Date();
	var dif = t2.getTime() - t1.getTime();
	console.log(dif,"milliseconds")
	console.log("Object",obj,y)
	
		 
}

const obj1 = JSON.parse(JSON.stringify(obj))


d()
 
/*
rules.run(rules_,obj1,(r,label,type,order)=>{
	console.log(r,label,type,order,obj1)
})
*/