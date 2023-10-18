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

class Action extends BuildingBlock{

  constructor(data) {
    super(data);

    this.type = "Action";
    this.description = "Action";
    this.actions = [];

  }

  run(args) {
    console.log("Run " + this.type + ": " + this.name);
  }
}

class Action_if_eval extends Action {

  constructor(data) {
    super(data);

    this.name = "Action_if";
    this.description = "if/then/else"

    this.operators = ['>','<','>=','<=','==','!='];

    //initialization values for eval fields
    this.val1 = '';
    this.val2 = '';
    this.operator = this.operators[0];
  }

  run(){
    if (eval(this.val1+this.operator+this.val2)){
        console.log("True!");
    } else {
        console.log("False!");
    }
  }

  load(){
    console.log("Building Action_if from saved data.")
  }

  save(){
    console.log("Returning json formatted Action_if for storage.")
  }

  edit(){
    var me = this;
    var editView = document.getElementById("editview");
    editView.innerHTML = "";

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
    })

    var inputLabel2 = document.createElement("label")
    inputLabel2.innerHTML = "Value 2: ";

    var val2InputField = createElementWithAttributes('input',{'type':'text','maxlength':'25','size':'17'});
    val2InputField.value = this.val2;
    val2InputField.addEventListener("change", (event)=> {
      me.val2 = event.target.value;
    })

    editView.append(title);

    editView.append(inputLabel1);
    editView.append(val1InputField);
    editView.append(operatorSelector);
    editView.append(inputLabel2);
    editView.append(val2InputField);
  }
}