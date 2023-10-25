
class Game extends GameContainer {

  constructor(data) {
    super(data);

    this.type = "Game";

    this.author = "";
    this.scenes = {};
    this.things = {};
    this.first_scene = null;
    this.start_player_pos = [0,0];
    this.game = this;
    this.screenDimensions = [360,240];
    this.canvas = null;
    this.playContext = null;
    this.currentScene = null;
    this.messageBoxDimensions = [200,100];
    this.textFontSize = 10;
    this.textFont = this.textFontSize + "px courier";
    this.currentMessage = null;
    this.createPlayContext();
    this.runStack = [];
    this.variables = {};
    this.runStackPaused = false;
    this.stackRunnerInterval = null;
    this.running = false;
    this.disable_editing = null;
    this.enable_editing = null;
    this.currentAction = null;
    this.controlKeys = ["ArrowDown","ArrowUp","ArrowLeft","ArrowRight","a","s"];
    this.defaultButtonBindings = {'up':this,'down':this,'left':this,'right':this,'menu':this,'dismiss':this};
    this.buttonBindings = this.defaultButtonBindings;
  }

  moveButton(direction){
    console.log("move " + direction);
  }

  menuButton(){
    console.log("open menu");
  }

  dismissButton(){
    console.log("do nothing");
  }

  handleEvent(event){
    if (event.type == "keydown"){
      if (event.defaultPrevented){
        return;
      }
      if(this.controlKeys.includes(event.key)){
        switch (event.key) {
          case "ArrowDown":
            this.buttonBindings['down'].moveButton('down');
            break;
          case "ArrowUp":
            this.buttonBindings['up'].moveButton('up');
            break;
          case "ArrowLeft":
            this.buttonBindings['left'].moveButton('left');
            break;
          case "ArrowRight":
            this.buttonBindings['right'].moveButton('right');
            break;
          case "a":
            this.buttonBindings['menu'].menuButton();
            break;
          case "s":
            this.buttonBindings['dismiss'].dismissButton();
            break;
          default:
            return; // Quit when this doesn't handle the key event.
        }

      }
      event.preventDefault();
    }
  }

  run(args){
    if(args){
      if(args['disable_editing']){
        this.disable_editing = args['disable_editing'];
        this.disable_editing();
      }
      if(args['enable_editing']){
        this.enable_editing = args['enable_editing'];
      }
    }

    window.addEventListener("keydown", this, false);

    this.running = true;
    this.runStack = this.runStack.concat(this.actions);
    this.changeScene(this.first_scene);
    this.loop();
  }

  stop(){
    if (this.running){
      this.running = false;
    }
  }

  reset(){
    this.runStackPaused = false;
    this.runStack = [];
    if (this.enable_editing){
      this.enable_editing();
    }
    this.currentMessage = null;
    this.currentScene = null;
    removeEventListener("keydown",this,false);
  }

  loop(){
    setTimeout(() => this.stackRunner(),25);
  }

  stackRunner(){
    if(!this.runStackPaused){
      if (this.runStack.length > 0){
        this.currentAction = this.runStack.shift();
        this.currentAction.run();
      }else{
        this.stop();
      }
    }
    this.updatePlayView();

    if (this.running){
      this.loop();
    }else{
      console.log("Stopping!");
      this.reset();
    }
  }

  changeScene(scene_id){
    this.currentScene = this.scenes[scene_id];
    this.currentScene.run();
  }

  createPlayContext(){
    var playView = document.getElementById('mapview');
    if (this.canvas){
      this.playContext.remove;
      this.canvas.remove;
    }
    this.canvas = document.createElement("canvas");
    this.canvas.setAttribute('id','map');
    this.canvas.setAttribute('width','720');
    this.canvas.setAttribute('height','480');
    playView.append(this.canvas);
    this.playContext = this.canvas.getContext("2d");
    this.playContext.scale(2,2);
    this.playContext.imageSmoothingEnabled = false;
    this.playContext.font = this.textFont;
  }

  updatePlayView(){
    if (this.currentScene){
      this.playContext.drawImage(this.currentScene.backgroundImage, 0,0);

      for (const thing_id of this.currentScene.things){
        var thing = game.things[thing_id];
        if (thing.spriteImage){
          this.playContext.drawImage(thing.spriteImage,thing.location[0],thing.location[1]);
        }
      }
      if (this.currentMessage){
        var lineNum = 0;
        this.playContext.fillStyle = "black";
        this.playContext.fillRect(80, 0, this.messageBoxDimensions[0], this.messageBoxDimensions[1])
        this.playContext.fillStyle = "white";
        for(const line of this.currentMessage){
          var y_coord = 10 + this.textFontSize*lineNum;
          var x_coord = 85;
          this.playContext.fillText(line,x_coord,y_coord);
          lineNum += 1;
        }
        lineNum = 9;
        this.playContext.fillText("Press S",235,5 + this.textFontSize*lineNum)
      }
    }else{
      this.playContext.clearRect(0,0,this.screenDimensions[0],this.screenDimensions[1]);
    }
  }

  updateDisplay(nodeSpan){
    nodeSpan.innerHTML = '<b>'+this.name+ ':</b> ' + this.description;
  }

  display() {
    var node = super.display();

    var thingNodes = this.getChildContainer(node,'things');
    if (this.things){
      for (const [id,thing] of Object.entries(this.things)){
        var thingNode = thing.display('game');
        thingNodes.append(thingNode);
      }
    }

    var scene_sp = document.createElement('span')
    var scene_tv = document.createElement('div');
    scene_sp.setAttribute('class','caret');
    scene_sp.setAttribute('onclick','flipCaret(this)');
    scene_sp.innerHTML = 'Scenes';
    scene_tv.append(scene_sp)

    var sceneNodes = document.createElement('div');
    sceneNodes.setAttribute('class','nested scenes');
    scene_tv.append(sceneNodes)
    node.append(scene_tv);
    if (this.scenes){
      for (const [id,scene] of Object.entries(this.scenes)){
        var sceneNode = scene.display();
        sceneNodes.append(sceneNode);
      }
    }
    return node;
  }

  load(data) {

    super.load(data);

    this.author= data['author'];
    this.first_scene = data['first_scene'];
    this.start_player_pos = data['start_player_pos'];

    var childData = {'parent':null,'game':this.game};

    this.things = {};
    for (const [thing_id,thing_data] of Object.entries(data['things'])){
      var newThing = new Thing(childData);
      newThing.load(thing_data);
      this.things[newThing.id] = newThing;
    }

    childData['parent'] = this;

    this.scenes = {};
    for (const [scene_id,scene_data] of Object.entries(data['scenes'])){
      var newScene = new Scene(childData);
      newScene.load(scene_data);
      this.scenes[newScene.id] = newScene;
    }
  }

  save() {
    var data = super.save();
    data['author'] = this.author;
    data['first_scene'] = this.first_scene;
    data['start_player_pos'] = this.start_player_pos;

    var things = {}
    for (const [key,value] of Object.entries(this.things)){
      things[key] = value.save();
    }
    data['things'] = things;

    var scenes = {}
    for (const [key,value] of Object.entries(this.scenes)){
      scenes[key] = value.save();
    }
    data['scenes'] = scenes;

    return data;
  }

  addNewScene(){
    var scene = new Scene({'parent':this,'game':this});
    this.scenes[scene.id]=scene;
    var sceneNodes = this.getChildContainer(this.nodes[0],'scenes');
    sceneNodes.append(scene.display());
  }

  addNewThing(thing){
    this.things[thing.id]=thing;
    var thingNodes = this.getChildContainer(this.nodes[0],'things');
    thingNodes.append(thing.display('game'));
    this.edit(this.currentNode);
  }

  edit(node){
    super.edit(node);
    var me = this;
    var editView = document.getElementById('editview');

    var sceneLabel = document.createElement('label');
    sceneLabel.innerHTML = '<b>First scene: <b>';

    var startSceneSelector = document.createElement('select');
    for (const [s_id,s] of Object.entries(this.scenes)){
    var opt = new Option;
    opt.value = s_id;
    opt.innerHTML = s.name + '['+s.id+']';
    startSceneSelector.appendChild(opt);
    startSceneSelector.addEventListener(
        "change",
        function () {
          me.first_scene = startSceneSelector.value;
        },
        false,
      );
    }
    startSceneSelector.value = this.first_scene;
    editView.append(sceneLabel,startSceneSelector);
  }
}