var if_action = new Action_if_eval();
if_action.load({name: "Action_if_eval", actions: [{name: "Action_message", actions: null, text_lines: ["Enough is enough, you craven fool!"]},{name: "Action_start_timer", actions: null, milliseconds: 0, variable: "global_timer"},{name: "Action_set_var", actions: null, variable: "$global_timer", value: "500"}], val1: "$visits", val2: "3", operator: ">"});
var message = new Action_message();
var timer = new Action_start_timer();
var sceneview = document.getElementById('scenedata');
sceneview.replaceChildren(if_action.display(),message.display(),timer.display());