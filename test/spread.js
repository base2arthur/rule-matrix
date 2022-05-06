let data = {
    x:1,y:{ z:2}
}


const flatten = (obj, roots=[], sep='.') => Object.keys(obj).reduce((memo, prop) => Object.assign({}, memo, Object.prototype.toString.call(obj[prop]) === '[object Object]' ? flatten(obj[prop], roots.concat([prop]), sep) : {[roots.concat([prop]).join(sep)]: obj[prop]}), {})

console.log(flatten(data))

/*
const flatten_ = (obj, roots = [], sep = '.') => Object.keys(obj).reduce((memo, prop) => Object.assign({}, memo, Object.prototype.toString.call(obj[prop]) === '[object Object]' ? flatten(obj[prop], roots.concat([prop]), sep) : { [roots.concat([prop]).join(sep)]: obj[prop] }), {})
  return flatten_(data, [], sep)

  data.calc = function () {
      return function (text, render) {
        const y = render(text)
        return maths.evaluate(y)

      }
    }
*/