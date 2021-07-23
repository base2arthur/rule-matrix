var rules = require("../index.js")

//const rules_ = "operand,exists,result/\n\\type,string,string/\n\\field,xyz,res/\n\\label,XYZ,RES/\n\\value,true,yes/\n\\value,FALSE,not"
const rules_ = "operand,equals,equals,result,result,result,result,result,result,result,result,result,result,result,result,result,result,result,result,result,result,result,result,result\n\
type,string,string,hidden,date,bool,dose,active_ingredient,spectrum,form,quantity,hidden,strength,hidden,strength,hidden,string,frequency,number,string,strength,hidden,string,string\n\
field,formulation,active_ingredient2,patient,prescribed,sas,dose,active_ingredient,spectrum,form,quantity,quantity_value,cbd_strength,cbd_strength_value,thc_strength,thc_strength_value,route,frequency,repeat,interval,pea_strength,pea_strength_value,sas_product_name,sas_form_strength\n\
label,,,,Date of Prescription,,Dose,Active Ingredient,Spectrum,Form,Quantity,,CBD Strength,,,,Route,Frequency,Number of Repeats,Number of Intervals (Days),PEA Strength,,Product Name,Product Form and Strength\n\
value,cbd-isolate-oil-s4,,required,required,false,required,cbd,isolate,oil,35ml,35,50mg/ml,50,0,0,oral,required,optional,optional,,,,\n\
value,cbd-full-spectrum-oil-s4,,required,required,false,required,cbd,full spectrum,oil,35ml,35,50mg/ml,50,0,0,oral,required,optional,optional,,,,\n\
value,thc-cbd-capsule-s8-1,,required,required,false,N/A,cbd-thc,N/A,capsule,30,30,12.5mg,12.5,12.5mg,12.5,oral,required,optional,optional,,,,\n\
value,thc-cbd-capsule-s8-2,,required,required,false,N/A,cbd-thc,N/A,capsule,30,30,25mg,25,25mg,25,oral,required,optional,optional,,,,\n\
value,custom-compound,,required,required,false,required,required,required,required,required,required,,,,,oral,required,optional,optional,,,,\n\
value,custom-compound,cbd,required,required,false,required,required,required,required,required,required,required,required,,,oral,required,optional,optional,,,,\n\
value,custom-compound,thc,required,required,false,required,required,required,required,required,required,,,required,required,oral,required,optional,optional,,,,\n\
value,custom-compound,cbd-thc,required,required,false,required,required,required,required,required,required,required,required,required,required,required,required,optional,optional,,,,\n\
value,custom-compound,pea,required,required,false,required,required,required,required,required,required,,,,,required,required,optional,optional,required,required,,\n\
value,sas-compound,,required,required,true,required,required,required,required,,,,,,,required,required,optional,optional,,,required,required"
let obj = {
    formulation:"custom-compound",
    active_ingredient2:"cbd"
}


rules.process(rules_,obj,(results,labels,objects,order)=>{
    console.log(obj,results,labels,objects,order)
})