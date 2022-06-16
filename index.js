var maths = require("mathjs");
var dayjs = require('dayjs')
let handlebars = require("mustache")//Handlebars sucks eggs with svelte

async function flatten(data, sep = ".") {

  data = await new Promise((resolve) => {
    var result = {};
    function recurse(cur, prop) {
      if (Object(cur) !== cur) {
        result[prop] = cur;
      } else if (Array.isArray(cur)) {
        for (var i = 0, l = cur.length; i < l; i++)
          recurse(cur[i], prop ? prop + sep + i : "" + i);
        if (l == 0)
          result[prop] = [];
      } else {
        var isEmpty = true;
        for (var p in cur) {
          isEmpty = false;
          recurse(cur[p], prop ? prop + sep + p : p);
        }
        if (isEmpty)
          result[prop] = {};
      }
    }
    recurse(data, "");
    return resolve(result);
  })
  return data
}

module.exports.flat = async (obj) => {
  const data = await new Promise((resolve)=>{
    const flatten = (obj, roots=[], sep='.') => Object.keys(obj).reduce((memo, prop) => Object.assign({}, memo, Object.prototype.toString.call(obj[prop]) === '[object Object]' ? flatten(obj[prop], roots.concat([prop]), sep) : {[roots.concat([prop]).join(sep)]: obj[prop]}), {})
    const d = flatten(obj)
    return resolve(d)
  })
  return data
  //return await flatten(obj)
}


async function unflatten(obj) {
  let data = await new Promise((resolve) => {
    Object.unflatten_ = function (data) {
      "use strict";
      if (Object(data) !== data || Array.isArray(data))
        return data;
      var regex = /\.?([^.\[\]]+)|\[(\d+)\]/g,
        resultholder = {};
      for (var p in data) {
        var cur = resultholder,
          prop = "",
          m;
        while (m = regex.exec(p)) {
          cur = cur[prop] || (cur[prop] = (m[2] ? [] : {}));
          prop = m[2] || m[1];
        }
        cur[prop] = data[p];
      }
      return resultholder[""] || resultholder;
    };

    return resolve(Object.unflatten_(obj))
  })

  return data
}

module.exports.run2 = async (rules, data) => {
  var t1 = new Date();
  let r = await render(rules, data)
  data = await flatten(data)
  const result = await new Promise((resolve) => {
    module.exports.process(r, data, (r, label, type, order) => {
      return resolve(r, label, type, order)
    })
  })
  var t2 = new Date();
  var dif = t2.getTime() - t1.getTime();
  console.log(dif, "milliseconds")
  data = await unflatten(data)
  return { ...result, data }
}

module.exports.run = (rules, data, cb) => {
  //console.log(rules)
  handlebar(rules, data, (r) => {
    module.exports.process(r, data, cb)
  })

}

const handlebar = (rules, data, cb) => {
  // const template = handlebars.compile(rules)
  // const result = template(data)
  data.calc = function () {
    return function (text, render) {
      const y = render(text)
      return maths.evaluate(y)

    }
  }
  const result = handlebars.render(rules, data)
  delete data.calc
  return cb(result)
}

const render = async (rules, data) => {
  data = await new Promise((resolve) => {
    handlebar(rules, data, (r) => {
      return resolve(r)
    })
  })
  return data
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
  const reserved = ["required", "optional"]
  var boolean = (value) => {
    if (reserved.includes(value)) {
      return value
    } else {
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

  function String_(value) {
    let s = String(value)
    if (s === 'undefined')
      s = null
    if (s === 'null')
      s = null
    return s
  }

  function isString(value) {
    return typeof value === 'string' || value instanceof String;
  }

  function Number_(m) {
    return reserved.includes(m) ? m : Number(m)
  }
  function parseFloat_(m) {
    return reserved.includes(m) ? m : parseFloat(m)
  }
  function date_(m) {
    return reserved.includes(m) ? m : dayjs(m).unix()
  }
  var type_ = (t_, _t) => {
    switch (t_) {
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
            t_ = t_ || false
            //    console.log("Test Bool",t_,_t)
            return boolean(t_);
            break;
          case "number":
            return Number_(t_);
            break;
          case "date":
            switch (t_) {
              case "NOW":
                return dayjs().unix();
                break;
              default:
                return date_(t_)
            }

          case "json":
            //console.log("Note",t_,_t)
            if (t_ && isString(t_))
              return JSON.parse("{" + t_.split(";").join(",") + "}")
            else
              return (t_ || "")
            break;
          case 'string':
          case 'signature':

          default:
            // code
            //return null;
            return String_(t_);
            break;
        }
    }
  };


  const isCalc = (type, field, value) => {

    var f = field
    switch (type) {
      case "calc":
        f = maths.evaluate(field, data)
        // console.log("CALC",f)
        break;
      case "date":
        switch (value) {
          case "NOW":
            f = dayjs().unix();
            break;
          default:
            f = dayjs(value).unix()
        }

      default:
        f = value
    }
    return f
  }

  var match = (n, i, cb) => {
    var t_ = true;

    const f = type_(isCalc(type[i], fields[i], data[fields[i]]), type[i]);//const f = type_(data[fields[i]], type[i]);
    const v = n[i] && n[i].length > 0 ? type_(n[i], type[i]) : null;

    const field = fields[i]
    const o = operands[i];

    const match_ = v//||(type[i]==="bool")
    //console.log("match",n[i],type_(n[i], type[i]))
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
          ///console.log(field,f,v)
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
          t_ = f.indexOf(v) >= 0
          break;
        case "contains":
          t_ = f.includes(v)
          break;
        case "endsWith":
          t_ = f.endsWith(v)
          break;
        case "exists":

          t_ = (String_(f)?.length > 0) === boolean(v)

          break;
        default:
          t_ = false;
      }
    } else {
      t_ = true;
    }


    if (t_ && i < n.length) {
      match(n, i, function () {
        return cb();
      });
    } else {
      return cb();
    }

  };

  var determine = (m, i, cb) => {
    const y = m[i].split(",")
    // console.log("determine",i)
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
  let labels = []
  const cc = v[step].split(",")
  if (cc[0] === "label") {
    labels = [...cc]
    labels.shift()
    step++
  } else {
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
      result[fields[index + 1]] = field.length > 0 ? field : fields[index + 1];
      return result;
    }, {})
    return cb(rete_results, labels, objects, fields)
  });
}