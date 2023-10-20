function createElementWithAttributes(type,att_dict){
  var el = document.createElement(type);
  for (const [key,value] of Object.entries(att_dict)){
    el.setAttribute(key,value);
  }
  return el;
}

function flipCaret(tag){
      tag.parentElement.querySelector(".nested").classList.toggle("active");
      tag.classList.toggle("caret-down");
}