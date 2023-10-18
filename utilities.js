function createElementWithAttributes(type,att_dict){
  var el = document.createElement(type);
  for (const [key,value] of Object.entries(att_dict)){
    el.setAttribute(key,value);
  }
  return el;
}