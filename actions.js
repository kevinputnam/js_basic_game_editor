function actionFactory(action_list){
  if (!action_list){
    return [];
  }
  var actions = []
  for (a_data of action_list){
    var action = new Action(a_data);
    action.actions = actionFactory(a_data.actions);
    actions.push(action);
  }
  return actions;
}

//register actions here, for add method.
const action_types = ['Action_else','Action_if_eval','Action_message','Action_start_timer','Action_set_var'];


//prototype for all actions
class Action extends BuildingBlock{

  constructor(data) {
    super(data);

    this.type = "Action";
    this.description = "Action";
    this.actions = null;
  }

  load(data) {
    if (this.actions){
      for (const action of data['actions']){
        var new_action = eval("new " + action['name'] + "({'parent':this})");
        new_action.load(action);
        this.actions.push(new_action);
      }
    }
  }

  save() {
    var data = {'name':this.name};
    var actions = null;
    if (this.actions){
      actions = [];
      for (const action of this.actions){
        actions.push(action.save());
      }
    }
    data['actions'] = actions;
    return data;
  }

  getChildContainer(parent,name){
    for (const node of parent.childNodes){
      console.log(node);
      if (node.classList.contains(name)){
        return node;
      }
    }
  }

  display() {
    var node = super.display();

    var actionNodes = document.createElement('div');
    actionNodes.setAttribute('class','actions');
    node.append(actionNodes);

    if (this.actions){
      for (var action of this.actions){
        actionNodes.append(action.display());
      }
    }
    return node;
  }

  run(args) {
    console.log("Run " + this.type + ": " + this.name);
  }

  add(action_type){
    var data = {'parent':this};
    var new_action = eval("new " + action_type + "(data)");
    this.actions.push(new_action);
    var actionNodes = this.getChildContainer(this.currentNode,'actions');
    actionNodes.append(new_action.display());
  }

  edit(node){
    super.edit(node);
    var editView = document.getElementById("editview");
    editView.replaceChildren();

    var title = document.createElement("span");
    var bold = document.createElement("b");
    bold.innerHTML = this.name + "<br>";
    title.append(bold);
    var description = document.createElement("p");
    description.innerHTML = this.description;
    editView.append(title,description,document.createElement('br'));

    var moveButtons = this.createUpAndDownButtons();
    editView.append(moveButtons[0],moveButtons[1],this.createRemoveButton(),document.createElement('br'),document.createElement('br'));

    var me = this;
    if (this.actions){

      this.newActionSelector = document.createElement('select');
      for (const aType of action_types){
        var opt = new Option;
        opt.value = aType;
        opt.innerHTML = aType.replace('Action_','');
        this.newActionSelector.appendChild(opt);
      }
      var addActionButton = document.createElement('button');
      addActionButton.innerHTML = "Add Action";
      addActionButton.addEventListener(
        "click",
        function () {
          me.add(me.newActionSelector.value);
        },
        false,
      );
      editView.append(this.newActionSelector,addActionButton,document.createElement('br'),document.createElement('br'));
    }
  }

  remove(){
    //super.remove();
    for (const node of this.nodes){
      node.remove();
    }
    if(this.parent){
      this.parent.actions.splice(this.parent.actions.indexOf(this),1);
    }
    var editView = document.getElementById('editview');
    editView.replaceChildren();
  }

  moveUp(){
    super.moveUp();
    if(this.parent){
      var p_actions = this.parent.actions;
      if (p_actions.length > 1){
        var i = p_actions.indexOf(this);
        if (i != 0){
          p_actions.splice(i,1);
          p_actions.splice(i-1,0,this);
        }
      }
    }
  }

  moveDown(){
    super.moveDown();
    if(this.parent){
      var p_actions = this.parent.actions;
      if (p_actions.length > 1){
        var i = this.parent.actions.indexOf(this);
        if (i != p_actions.length - 1){
          p_actions.splice(i,1);
          p_actions.splice(i+1,0,this);
        }
      }
    }
  }
}

class Action_set_var extends Action {

  constructor(data) {
    super(data);

    this.name = "Action_set_var";
    this.description = "Set a variable.";

    this.variable = null;
    this.value = null;
  }

  load(data){
    super.load(data);
    this.variable = data['variable'];
    this.value = data['value'];
  }

  save(){
    var data = super.save();
    data['variable'] = this.variable;
    data['value'] = this.value;
    return data;
  }

  updateDisplay(nodeSpan){
    nodeSpan.innerHTML = '<b>Set</b> $' + this.variable + ' <b>to</b> ' + this.value;
  }

  edit(node) {
    super.edit(node);
    var me = this;
    var editView = document.getElementById("editview");

    var inputLabel = document.createElement('label');
    inputLabel.innerHTML = "Variable name: ";
    var variableInputField = createElementWithAttributes('input',{'type':'text','maxlength':'25','size':'17'});
    variableInputField.value = this.variable;
    variableInputField.addEventListener("change", (event)=> {
      me.variable = event.target.value;
      me.updateNodes();
    })


    var inputLabel2 = document.createElement('label');
    inputLabel2.innerHTML = "Value:"
    var valueInputField = createElementWithAttributes('input',{'type':'text','maxlength':'25','size':'17'});
    valueInputField.value = this.value;
    valueInputField.addEventListener("change", (event)=> {
      me.value = event.target.value;
      me.updateNodes();
    })

    editView.append(inputLabel,variableInputField,inputLabel2,valueInputField);
  }
}

class Action_message extends Action {

  constructor(data) {
    super(data);

    this.name = "Action_message";
    this.description = "Display a modal message.";

    this.text_lines = [];
  }

  load(data){
    super.load(data);
    this.text_lines = data['text_lines'];
  }

  save(){
    var data = super.save();
    data['text_lines'] = this.text_lines;
    return data;
  }

  updateDisplay(nodeSpan){
    if (this.text_lines.length > 0){
      if (this.text_lines[0].length >= 21){
        nodeSpan.innerHTML = '<b>Message</b> "' + this.text_lines[0].slice(0,20) + '..."';
      }else{
        nodeSpan.innerHTML = '<b>Message</b> "' + this.text_lines[0] + '"';
      }
    }else{
      nodeSpan.innerHTML = '<b>Message</b>';
    }
  }

  edit(node){
    super.edit(node);
    var me = this;
    var editView = document.getElementById("editview");

    var inputLabel = document.createElement("label")
    inputLabel.innerHTML = "Message: ";

    var messageInputField = createElementWithAttributes('textarea',{'rows':'8','cols':'30'});

    var text = '';
    for (const line of this.text_lines){
      text += line + "\n";
    }

    messageInputField.value = text;
    messageInputField.addEventListener("change", (event)=> {
      me.text_lines = event.target.value.split('\n');
      me.updateNodes();
    })

    editView.append(inputLabel,document.createElement("br"),messageInputField);
  }
}


class Action_start_timer extends Action {

  constructor(data){
    super(data);

    this.name = "Action_start_timer";
    this.description = "Start a timer. Uses the variable field if set.";

    this.milliseconds = 0;
    this.variable = '';
  }

  load(data){
    super.load(data);
    this.milliseconds = data['milliseconds'];
    this.variable = data['variable'];
  }

  save(){
    var data = super.save();
    data['milliseconds'] = this.milliseconds;
    data['variable'] = this.variable;
    return data;
  }

  updateDisplay(nodeSpan){
    if (this.variable.length > 0){
      nodeSpan.innerHTML = '<b>Timer:</b> $' + this.variable;
    } else {
      nodeSpan.innerHTML = '<b>Timer:</b> ' + this.milliseconds + 'ms';
    }
  }

  edit(node){
    super.edit(node);
    var me = this;
    var editView = document.getElementById("editview");

    var inputLabel = document.createElement("label")
    inputLabel.innerHTML = "Milliseconds: ";

    var msInputField = createElementWithAttributes('input',{'type':'number','min':'0','max':'10000'});
    msInputField.value = this.milliseconds;
    msInputField.addEventListener("change", (event)=> {
      me.milliseconds = event.target.value;
      me.updateNodes();
    })

    var inputLabel2 = document.createElement("label")
    inputLabel2.innerHTML = " or variable: ";

    var varInputField = createElementWithAttributes('input',{'type':'text','maxlength':'25','size':'17'});
    varInputField.value = this.variable;
    varInputField.addEventListener("change", (event)=> {
      me.variable = event.target.value;
      me.updateNodes();
    })

    editView.append(inputLabel,msInputField,inputLabel2,varInputField);
  }
}

class Action_else extends Action {

  constructor(data){
    super(data);

    this.name = "Action_else";
    this.description = "else. Does nothing unless it is the child of an If action.";
    this.actions = [];
  }

  updateDisplay(nodeSpan){
    nodeSpan.innerHTML = '<b>else</b>';
  }
}

class Action_if_eval extends Action {

  constructor(data) {
    super(data);

    this.name = "Action_if_eval";
    this.description = "if/then. Add an else action as a child to get that functionality.";
    this.actions = [];

    this.operators = ['>','<','>=','<=','==','!='];

    //initialization values for eval fields
    this.val1 = null;
    this.val2 = null;
    this.operator = this.operators[0];
  }

  load(data){
    super.load(data);
    this.val1 = data['val1'];
    this.val2 = data['val2'];
    this.val3 = data['val3'];
  }

  save(){
    var data = super.save();
    data['val1'] = this.val1;
    data['val2'] = this.val2;
    data['operator'] = this.operator;
    return data;
  }

  updateDisplay(nodeSpan){
    nodeSpan.innerHTML = '<b>if </b> ' + this.val1 + " <b>" + this.operator + "</b> " + this.val2
  }

  run(){
    if (eval(this.val1+this.operator+this.val2)){
        console.log("True!");
        return true; //return all actions except else
    } else {
        console.log("False!");
        return false; //find child else action if there is one and return its actions
    }
  }

  edit(node){
    super.edit(node);
    var me = this;
    var editView = document.getElementById("editview");

    var inputLabel1 = document.createElement("label")
    inputLabel1.innerHTML = "Value 1: ";

    var val1InputField = createElementWithAttributes('input',{'type':'text','maxlength':'25','size':'17'});
    val1InputField.value = this.val1;
    val1InputField.addEventListener("change", (event)=> {
      me.val1 = event.target.value;
      me.updateNodes();
    })

    var operatorSelector = document.createElement('select');
    var i = 0
    for (const operator of this.operators){
      var opt = new Option;
      opt.value = i;
      opt.innerHTML = operator;
      if (operator == this.operator){
        opt.setAttribute('seleted','true');
      }
      operatorSelector.appendChild(opt);
      i += 1;
    }
    operatorSelector.addEventListener("change", (event)=> {
      me.operator = me.operators[event.target.value];
      me.updateNodes();
    })

    var inputLabel2 = document.createElement("label")
    inputLabel2.innerHTML = "Value 2: ";

    var val2InputField = createElementWithAttributes('input',{'type':'text','maxlength':'25','size':'17'});
    val2InputField.value = this.val2;
    val2InputField.addEventListener("change", (event)=> {
      me.val2 = event.target.value;
      me.updateNodes();
    })

    editView.append(inputLabel1,val1InputField,operatorSelector,inputLabel2,val2InputField);
  }
}