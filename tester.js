var if_action = new Action_if_eval();
if_action.add('Action_message');
if_action.add('Action_start_timer');
var message = new Action_message();
var timer = new Action_start_timer();
var sceneview = document.getElementById('scenedata');
sceneview.replaceChildren(if_action.display(),message.display(),timer.display());