var rules = require("../index.js")

//const rules_ = "operand,exists,result/\n/\type,string,string/\n/\field,xyz,res/\n/\label,XYZ,RES/\n/\value,true,yes/\n/\value,FALSE,not"
const rules_ = "operand,exists,result,result\n\type,string,string,string\n\field,xyz,ggggg,h\n\label,,,\n\value,TRUE,maybe,l\n\value,FALSE,not,k"
let obj = {
    xyz:"VIC"    
}


rules.process(rules_,obj,(results,labels,objects)=>{
    console.log(obj,results,labels,objects)
})