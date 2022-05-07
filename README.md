# rule-matrix
A simple matrix based rules engine that is top down and returns the last match
It removes the need for complex if statements and allows business users to define the rules easier using a csv file.
## How to use it

## MustACHE ability
The engine now has the ability to replace text in the rules with data passed in. Useful to limit the number of situations required to be recorded


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

## Allowed operands
Operand must be row number 1
| Operand       | Use                | Description                   |
|---------------|--------------------|-------------------------------|
| result        | Field Manipulation | A data field that is returned |
| return        | Field Manipulation | Same as above                 |
| equals or "=" | Condition          | A matching value              |
| not           | Condition          | Not equal to                  |
| <             | Condition          | Less than                     |
| <=            | Condition          | Less than or equal to         |
| >             | Condition          | Greater than                  |
| >=            | Condition          | Greater than or equal to      |
| startsWith    | Condition          | For strings only.             |
| contains      | Condition          | For strings only.             |
| endsWith      | Condition          | For strings only              |
| exists        | Condition          | Exists                        |

## Allowed Types
Type must be row number 2
| Type      | Description                                                                   |
|-----------|-------------------------------------------------------------------------------|
| string    |                                                                               |
| signature | A base64 signature. Treated like a string                                     |
| double    |                                                                               |
| calc      | Uses mathjs. See mathjs for examples. ie:(p-v)/(p+v)                          |
| bool      |                                                                               |
| number    |                                                                               |
| date      | Uses dayjs. Values can be a Date or NOW for the date now                      |
| json      | Complex output, Used for result fields only. Syntax to be updated for clarity |
|           |                                                                               |
|           |                                                                               |
|           |                                                                               |

## The field line
Must be row number 3
The field from the object you are passing in.

## label
Must be row number 4 is it exists
A label is returned in position 2 of the callback. Useful for dynamic front ends

## Value
This is either the value you are comparing against or the value to be returned

## Calc is incorporated into a Mustache function
We now have a special field value called calc. When the field type is Number or Double, you can execute a formula using mathjs to return the value. 
ie: {{#calc}}(p-v){{/calc}}
