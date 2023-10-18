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
const action_types = ['Action_else','Action_if_eval'];

class Action extends BuildingBlock{

  constructor(data) {
    super(data);

    this.type = "Action";
    this.description = "Action";
    this.actions = null;

  }

  display() {
    super.display();

    if (this.actions){
      for (var action of this.actions){
        this.node.append(action.display());
      }
    }
    return this.node;
  }

  run(args) {
    console.log("Run " + this.type + ": " + this.name);
  }

  add(action_type){
    var new_action = eval("new " + action_type + "()");
    this.actions.push(new_action);
    this.node.append(new_action.display());
  }

  edit(){
    if (this.actions){
      var editView = document.getElementById("editview");

      var me = this;
      this.newActionSelector = document.createElement('select');
      for (const aType of action_types){
        var opt = new Option;
        opt.value = aType;
        opt.innerHTML = aType.replace('Action_','');
        this.newActionSelector.appendChild(opt);
      }
      var addActionButton = document.createElement('button');
      addActionButton.innerHTML = "Add Action";
      var me = this;
      addActionButton.addEventListener(
        "click",
        function () {
          me.add(me.newActionSelector.value);
        },
        false,
      );
      editView.replaceChildren(this.newActionSelector,addActionButton,document.createElement('br'),document.createElement('br'));
    }
  }
}

class Action_else extends Action {

  constructor(data){
    super(data);

    this.name = "Action_else";
    this.description = "else";
    this.actions = [];
  }

  updateDisplay(){
    this.nodeSpan.innerHTML = '<b>else</b>';
  }


}

class Action_if_eval extends Action {

  constructor(data) {
    super(data);

    this.name = "Action_if_eval";
    this.description = "if/then"
    this.actions = [];

    this.operators = ['>','<','>=','<=','==','!='];

    //initialization values for eval fields
    this.val1 = '';
    this.val2 = '';
    this.operator = this.operators[0];
  }

  updateDisplay(){
    this.nodeSpan.innerHTML = '<b>if </b> ' + this.val1 + " <b>" + this.operator + "</b> " + this.val2
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

  load(){
    console.log("Building Action_if from saved json data.")
  }

  save(){
    console.log("Returning json formatted Action_if for storage.")
  }

  edit(){
    super.edit();
    var me = this;
    var editView = document.getElementById("editview");

    var title = document.createElement("span");
    var bold = document.createElement("b");
    bold.innerHTML = this.name + "[" + this.description + "]<br>";
    title.append(bold);

    var inputLabel1 = document.createElement("label")
    inputLabel1.innerHTML = "Value 1: ";

    var val1InputField = createElementWithAttributes('input',{'type':'text','maxlength':'25','size':'17'});
    val1InputField.value = this.val1;
    val1InputField.addEventListener("change", (event)=> {
      me.val1 = event.target.value;
      me.updateDisplay();
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
      me.updateDisplay();
    })

    var inputLabel2 = document.createElement("label")
    inputLabel2.innerHTML = "Value 2: ";

    var val2InputField = createElementWithAttributes('input',{'type':'text','maxlength':'25','size':'17'});
    val2InputField.value = this.val2;
    val2InputField.addEventListener("change", (event)=> {
      me.val2 = event.target.value;
      me.updateDisplay();
    })

    editView.append(title,inputLabel1,val1InputField,operatorSelector,inputLabel2,val2InputField);
  }
}