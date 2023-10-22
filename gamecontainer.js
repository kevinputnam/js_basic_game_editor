

class GameContainer extends BuildingBlock{

  constructor(data) {
    super(data);

    this.name = ''; //text name of thing
    this.description = ''; //text description of thing
    this.actions = []; //list of action objects
    this.things = []; //list of thing ids

  }

  getChildContainer(parent,name){
    for (const node of parent.childNodes[1].childNodes){
      console.log(node);
      if (node.classList.contains(name)){
        return node;
      }
    }
  }

 updateDisplay(nodeSpan){
  nodeSpan.innerHTML = '<b>'+this.name+'[' + this.id + ']:</b> ' + this.description;
  }

  display(info) {
    var node = super.display(info);

    var thing_sp = document.createElement('span')
    var thing_tv = document.createElement('div');
    thing_sp.setAttribute('class','caret');
    thing_sp.setAttribute('onclick','flipCaret(this)');
    thing_sp.innerHTML = 'Things';
    thing_tv.append(thing_sp);

    var thingNodes = document.createElement('div');
    thingNodes.setAttribute('class','nested things');
    thing_tv.append(thingNodes);
    node.append(thing_tv);

    var action_sp = document.createElement('span')
    var action_tv = document.createElement('div');
    action_sp.setAttribute('class','caret');
    action_sp.setAttribute('onclick','flipCaret(this)');
    action_sp.innerHTML = 'Actions';
    action_tv.append(action_sp)

    var actionNodes = document.createElement('div');
    actionNodes.setAttribute('class','nested actions');
    action_tv.append(actionNodes)
    node.append(action_tv);

    if (this.actions){
      for (var action of this.actions){
        actionNodes.append(action.display());
      }
    }

    // allows the Game class to use this prototype
    if (Array.isArray(this.things)){
      if (this.things){
        for (var thing_id of this.things){
          thingNodes.append(game.things[thing_id].display());
        }
      }
    }

    return node;
  }

  load(data){
    this.name = data['name'];
    this.description = data['description'];
    this.things = data['things'];

    if (this.actions){
      console.log(data['actions']);
      for (const action of data['actions']){
        console.log(action);
        var new_action = eval("new " + action['name'] + "({'parent':this})");
        new_action.load(action);
        this.actions.push(new_action);
      }
    }
  }

  save(data){
    var data = {'name':this.name};
    data['description'] = this.description;
    data['things'] = this.things;
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

  buildThingSelector(thingDict){
    var thingSelector = document.createElement('select');
    for (const [t_id,t] of Object.entries(thingDict)){
      if (t_id != this.id){
        var opt = new Option;
        opt.value = t_id;
        opt.innerHTML = t.name + '['+t.id+']';
        thingSelector.appendChild(opt);
      }
    }
    return thingSelector;
  }

  addAction(action_type){
    var data = {'parent':this};
    var new_action = eval("new " + action_type + "(data)");
    this.actions.push(new_action);
    var actionNodes = this.getChildContainer(this.currentNode,'actions');
    actionNodes.append(new_action.display());
  }

  addThing(thing_id){
    this.things.push(thing_id);
    var thingNodes = this.getChildContainer(this.currentNode,'things');
    thingNodes.append(game.things[thing_id].display());
  }

  newThing(){
    var data = {'parent':this};
    var newT = new Thing(data);
    if (this.type != 'Game'){
      this.things.push(newT.id);
      for (var node of this.nodes){
        var thingNodes = this.getChildContainer(node,'things');
       thingNodes.append(newT.display());
      }
    }
    game.addNewThing(newT);
  }

  edit(node){
    super.edit(node);
    var editView = document.getElementById("editview");
    editView.replaceChildren();

    var me = this;

    var title = document.createElement("span");
    var bold = document.createElement("b");
    if (this.id){
      bold.innerHTML = this.type + ': ' + this.name + '<br>ID:' + this.id + '<br>';
    }else{
      bold.innerHTML = this.type + ': ' + this.name + '<br>';
    }
    title.append(bold);
    editView.append(title,document.createElement('br'));

    if (this.type!='Game'){
      this.addThingSelector = this.buildThingSelector(game.things);

      var thingAddBtn = document.createElement("button");
      thingAddBtn.innerHTML = 'Add Thing';
      thingAddBtn.addEventListener(
        "click",
        function () {
          me.addThing(me.addThingSelector.value);
        },
        false,
      );
      editView.append(this.addThingSelector,thingAddBtn)
    }
    var newThingBtn = document.createElement('button');
    newThingBtn.innerHTML = "New Thing";
    newThingBtn.addEventListener(
      "click",
      function (){
        me.newThing();
      },
      false,
    );

    editView.append(newThingBtn,document.createElement('br'));

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
          me.addAction(me.newActionSelector.value);
        },
        false,
      );
      editView.append(this.newActionSelector,addActionButton,document.createElement('br'),document.createElement('br'));
    }

    var inputLabel = document.createElement("label")
    inputLabel.innerHTML = "Name: ";

    var nameInputField = createElementWithAttributes('input',{'type':'text','maxlength':'25','size':'17'});
    nameInputField.value = this.name;
    nameInputField.addEventListener("change", (event)=> {
      me.name = event.target.value;
      bold.innerHTML = event.target.value + '[' + me.id + ']<br>';
      me.updateNodes();
    })

    editView.append(inputLabel,nameInputField,document.createElement('br'));

    var inputLabel2 = document.createElement("label");
    inputLabel2.innerHTML = "Description: ";

    var descInputField = createElementWithAttributes('input',{'type':'text','maxlength':'80','size':'80'});
    descInputField.value = this.description;
    descInputField.addEventListener("change", (event)=> {
      me.description = event.target.value;
      me.updateNodes();
    })
    editView.append(inputLabel2,descInputField,document.createElement('br'));
  }
}