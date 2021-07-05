# rule-matrix
A simple matrix based rules engine that is top down and returns the last match
It removes the need for complex if statements and allows business users to define the rules easier
## How to use it


```
var rules = require("rule-matrix")

const rules_ = "operand,equals,result,result,result,result,result,result,result,result,result,result\ntype,string,date,bool,bool,bool,bool,bool,bool,bool,bool,bool\nfield,state,patient.dob,patient.drug_dependent,patient.diagnosed_with_substance_abuse,prescriber.i_am_an_authorised_prescriber,prescription.product_condition_which_does_not_meet_the_general_conditions_for_notification,patient.patient_ever_injected_opioids_or_psychostimulant,patient.patient_currently_using_illicit_substances,patient.ever_treated_for_drug_dependance,patient.evidence_of_intravenous_drug_use,patient.patient_had_a_specialist_assistant\nlabel,State,DOB,Drug Dependent?,Diagnosed with substance abuse?,I am an authorised prescriber,Product condition which does not meet the general conditions for notification,Patient ever injected opioids or psychostimulant,Patient currently using illicit substances,Ever treated for drug dependance,Evidence of intravenous drug use,Patient had a specialist assistant\nvalue,VIC,,required,,,,,,,,\nvalue,NSW,required,required,,,,,,,,\nvalue,QLD,,required,,,,required,required,required,required,\nvalue,SA,required,required,,,,,,,,\nvalue,NT,,,,,,,,,,required\nvalue,WA,required,required,required,required,required,,,,,\nvalue,TAS,,,,,,,,,,"

let obj = {
    state:"VIC"    
}


rules.process(rules_,obj,(results,labels,objects)=>{
    console.log(obj,results,labels,objects)
})

```

More complex examples to come.