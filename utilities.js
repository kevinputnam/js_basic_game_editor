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

function toggleHighlight(nodeSpan){
  var highlighted_divs = document.getElementsByClassName('select-highlight');
  for (const d of highlighted_divs){
    d.classList.remove('select-highlight');
  }
  nodeSpan.classList.add('select-highlight');
}

