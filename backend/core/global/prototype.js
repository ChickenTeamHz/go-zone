
String.prototype.format = function() {
  if(arguments.length == 0) return this;
  const param = arguments[0];
  let s = this;
  if(typeof(param) == 'object') {
   for(const key in param)
    s = s.replace(new RegExp("\\{" + key + "\\}", "g"), param[key]);
   return s;
  } else {
   for(var i = 0; i < arguments.length; i++)
    s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
   return s;
  }
}

