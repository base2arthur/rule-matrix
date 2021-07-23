var maths = require("mathjs");
var dayjs = require('dayjs')

const flatten = (obj, roots = [], sep = '.') => Object
// find props of given object
.keys(obj)
// return an object by iterating props
.reduce((memo, prop) => Object.assign(
// create a new object
{},
// include previously returned object
memo,
Object.prototype.toString.call(obj[prop]) === '[object Object]'
  // keep working if value is an object
  ? flatten(obj[prop], roots.concat([prop]))
  // include current prop and value and prefix prop with the roots
  : {[roots.concat([prop]).join(sep)]: obj[prop]}
), {})

module.exports.flat = (obj)=>{
    return flatten(obj)
}

module.exports.run = (rules,data,cb)=>{
  module.exports.process(rules,data,cb)
}
/*Process*/
module.exports.process = (rules, data, cb) => {
  const start = dayjs()
  const a = rules.split("\n");

  //first line is the operand
  //second line is the field


  const operands = a[0].split(",");
  const fields = a[2].split(",");
  //console.log(fields)
  const type = a[1].split(",");
  var results = {};
  const v = a;
  const reserved = ["required","optional"]
  var boolean = (value) => {
    if(reserved.includes(value)){
      return value
    }else{
      switch (value) {
        case true:
        case "true":
        case "True":
        case "TRUE":
        case "on":
        case "On":
        case "ON":
        case "yes":
        case "Yes":
          return true;
          break;
        default:
          return false;
      }
    }
  };

function isString (value) {
    return typeof value === 'string' || value instanceof String;
}

function Number_(m){
  return reserved.includes(m)?m:Number(m)
}
function parseFloat_(m){
  return reserved.includes(m)?m:parseFloat(m)
}
function date_(m){
  return reserved.includes(m)?m:dayjs(m).unix()
}
var type_ = (t_, _t) => {
    switch(t_){
        case "required":
        case "mandatory":
        case "enter":
            return t_
            break;
        default:
    
            switch (_t) {
              
              case "double":
              case "calc":
                return parseFloat_(t_);
                break;
              case "bool":
                  t_=t_||false
              //    console.log("Test Bool",t_,_t)
                return boolean(t_);
                break;
              case "number":
                return Number_(t_);
                break;
              case "date":
                  switch (t_){
                        case "NOW":
                            return  dayjs().unix();
                            break;
                        default:
                            return date_(t_)
                    }
                 
              case "json":
                  //console.log("Note",t_,_t)
                  if(t_&&isString(t_))
                    return  JSON.parse("{"+t_.split(";").join(",")+"}")
                  else
                    return (t_||"")
                  break;
              case 'string':
              case 'signature':
                      
              default:
                // code
                //return null;
                return String(t_);
                break;
            }
    }
};

    
  const isCalc = (type,field,value)=>{
   //   console.log("CALC",type,field)
      var f=field
    switch (type){
        case "calc":
            f = maths.evaluate(field,data)
        break;
        case "date":
            switch (value){
                case "NOW":
                    f = dayjs().unix();
                    break;
                default:
                    f= dayjs(value).unix()
            }
            
        default:
            f=value
    }
    return f
  }

  var match = (n, i, cb) => {
    var t_ = true;
   // console.log(data[fields[i]], type[i])
    const f = type_(isCalc(type[i],fields[i],data[fields[i]]), type[i]);//const f = type_(data[fields[i]], type[i]);
    const v = n[i] && n[i].length > 0 ? type_(n[i], type[i]) : null;
 
    const field = fields[i]
    const o = operands[i];
    
    const match_ = v||(type[i]==="bool")
    i++;
    if (match_) {
       
      switch (o) {
        case 'result':
        case 'return':
          results.matches = n
          data[field] = v;
          //console.log("Return", v,field)
          break;
        case "equals":
        case "=":
        case "===":
        //  console.log(field,f,v)
          t_ = f === v;
          break;
        case "not":
        case "!=":
        case "!==":
          t_ = f !== v;
          break;
        case "<":
          t_ = f < v;
          break;
        case "<=":
          t_ = f <= v;
          break;
        case ">":
          t_ = f > v;
          break;
        case ">=":
          t_ = f >= v;
          break;
        case "startsWith":
            t_ = f.indexOf(v)>=0
            break;
        case "contains":
            t_ = f.includes(v)
            break;
        case "endsWith":
            t_ = f.endsWith(v)
            break;
        case "exists":
          
          t_ = (String(f).length >0)===boolean(v)
           
          break;
        default:
          t_ = false;
      }
    } else {
      t_ = true;
    }

     
    if (t_ && i < n.length) {
      match(n, i, function() {
        return cb();
      });
    } else {
      return cb();
    }

  };

  var determine = (m, i, cb) => {
    const y = m[i].split(",") 
 //   console.log(y);
    var t = 1;
    match(y, t, () => {
      i++;
      if (i < m.length) {
        determine(m, i, () => {
          return cb();
        });
      } else {
        return cb();
      }
    });
  };

  var step = 3
 // console.log("LBAEL",v[step])
  let labels=[]
  const cc = v[step].split(",")
  if(cc[0]==="label"){
      labels = [...cc]
      labels.shift()
      step++
  }else{
      labels = []
  }
  determine(v, step, () => {
     
    const c = dayjs().diff(start, "millisecond")
    console.log("Length of exec", c)
    results.execution = c
    let rete_results = results;
    let objects = type.reduce(function (result, field, index) {
                result[fields[index]] = field;
                return result;
    }, {})
    labels = labels.reduce(function (result, field, index) {
                result[fields[index+1]] = field.length>0?field:fields[index+1];
                return result;
    }, {})
    return cb(rete_results,labels,objects,fields)
  });
}