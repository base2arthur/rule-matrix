var rules = require("../index.js")

const rules_ = "operand,exists,result/\n\\type,string,string/\n\\field,xyz,res/\n\\label,XYZ,RES/\n\\value,true,{{formulation}}/\n\\value,FALSE,{{a.active_ingredient2}}"

let obj = {
    formulation:"custom-compound",
    a:{
        active_ingredient2:"cbd"
    },
    xyz:"cbd"
}


rules.run(rules_,obj,(results,labels,objects,order)=>{
    console.log(obj,results,labels,objects,order)
})