var rules = require("../index.js")

//const rules_ = "operand,exists,result/\n/\type,string,string/\n/\field,xyz,res/\n/\label,XYZ,RES/\n/\value,true,yes/\n/\value,FALSE,not"
const rules_ = "operand,exists,result\n\type,string,bool\n\field,xyz,res\n\label,XYZ,RES\n\value,TRUE,true\n\value,FALSE,false"
let obj = {
    xyz:""    
}


rules.process(rules_,obj,(results,labels,objects)=>{
    console.log(obj,results,labels,objects)
})