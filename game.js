
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
    this.buttonEventHandler = "default";
    this.player = null;
  }

  handleEvent(event){
    if (event.type == "keydown"){
      if (event.defaultPrevented){
        return;
      }
      if(this.controlKeys.includes(event.key)){
        switch(this.buttonEventHandler){
        case "message":
          this.messageButtonHandler(event.key);
          break;
        case "menu":
          this.menuButtonHandler(event.key);
          break;
        default:
          this.defaulButtonHandler(event.key);
        }
      }
      event.preventDefault();
    }
  }

  defaulButtonHandler(key){
    switch (key) {
      case "ArrowDown":
        this.movePlayer([0,2]);
        break;
      case "ArrowUp":
        this.movePlayer([0,-2]);
        break;
      case "ArrowLeft":
        this.movePlayer([-2,0]);
        break;
      case "ArrowRight":
        this.movePlayer([2,0]);
        break;
      case "a":
        console.log('select');
        break;
      case "s":
        console.log('dismiss');
        break;
      default:
        return; // Quit when this doesn't handle the key event.
    }
  }

  messageButtonHandler(key){
    if (key == 's' || key == 'a'){
      this.dismissMessage();
    }
  }

  menuButtonHandler(key){
    switch (key) {
      case "ArrowDown":
        if(this.menuSelectorIndex < this.menuChoices.length -1){
          this.menuSelectorIndex += 1;
        }
        break;
      case "ArrowUp":
        if(this.menuSelectorIndex > 0){
          this.menuSelectorIndex -= 1;
        }
        break;
      case "a":
        console.log("$" + this.menuVariable + " set to " + this.menuSelectorIndex);
        this.variables[this.menuVariable] = this.menuSelectorIndex;
        if (this.menuUseValue){
          this.variables[this.menuVariable] = this.menuChoices[this.menuSelectorIndex];
        }
        this.dismissMenu();
        break;
      case "s":
        console.log('dismiss');
        this.variables[this.menuVariable] = null;
        this.dismissMenu();
        break;
      default:
        return; // Quit when this doesn't handle the key event.
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
    this.variables = {};
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
      }//else{
       // this.stop();
      //}
    }
    this.updatePlayView();

    if (this.running){
      this.loop();
    }else{
      console.log("Stopping!");
      this.reset();
    }
  }

  runStackClear(){
    this.runStack = [];
  }

  runStackInsert(actions){
    var actionsCopy = actions.concat();
    this.runStack.unshift(...actionsCopy);
  }

  changeScene(scene_id){
    this.runStackClear();
    this.currentScene = this.scenes[scene_id];
    this.currentScene.run();
  }

  movePlayer(coords){
    if (this.currentScene.draw_player){
      this.player.location[0] = parseInt(this.player.location[0]) + coords[0];
      this.player.location[1] = parseInt(this.player.location[1]) + coords[1];

      const p_loc = this.player.location;
      const p_dim = this.player.dimensions;
      var player_rect = [p_loc[0],p_loc[1],p_loc[0]+p_dim[0],p_loc[1]+p_dim[1]];

      for(const thing_id of this.currentScene.things){
        const t_loc = this.game.things[thing_id].location;
        const t_dim = this.game.things[thing_id].dimensions;
        var thing_rect = [t_loc[0],t_loc[1],t_loc[0]+t_dim[0],t_loc[1]+t_dim[1]];
        if (collision(player_rect,thing_rect)){
          this.things[thing_id].run();
        }
      }
    }
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
      if(this.currentScene.draw_player){
        this.playContext.drawImage(this.player.spriteImage,this.player.location[0],this.player.location[1]);
      }
      this.drawMessage();
      this.drawMenu();
    }else{
      this.playContext.clearRect(0,0,this.screenDimensions[0],this.screenDimensions[1]);
    }
  }

  drawMessage(){
    if (this.currentMessage){
      var lineNum = 0;
      //draw rectangle
      this.playContext.fillStyle = "black";
      this.playContext.fillRect(80, 0, this.messageBoxDimensions[0], this.messageBoxDimensions[1])
      //draw text
      this.playContext.fillStyle = "white";
      for(const line of this.currentMessage){
        var y_coord = 10 + this.textFontSize*lineNum;
        var x_coord = 85;
        this.playContext.fillText(line,x_coord,y_coord);
        lineNum += 1;
      }
      lineNum = 9;
      this.playContext.fillText("B: Dismiss",215,5 + this.textFontSize*lineNum)
    }
  }

  drawMenu(){
    if (this.menuChoices){
      var lineNum = 0;
      var cursor = '>';
      var lines = this.menuPrompt.concat(); // make a copy
      var choiceIndex = 0;
      for(var line of this.menuChoices){
        if(choiceIndex == this.menuSelectorIndex){
          line = cursor + line;
        }else{
          line = ' ' + line;
        }
        choiceIndex += 1;
        lines.push(line);
      }
      //draw rectangle
      this.playContext.fillStyle = "black";
      this.playContext.fillRect(80, 0, this.messageBoxDimensions[0], this.messageBoxDimensions[1])
      //draw text
      this.playContext.fillStyle = "white";
      for(const line of lines){
        var y_coord = 10 + this.textFontSize*lineNum;
        var x_coord = 85;
        this.playContext.fillText(line,x_coord,y_coord);
        lineNum += 1;
      }
      lineNum = 9;
      this.playContext.fillText("A: Select B: Dismiss", 155, 5 + this.textFontSize*lineNum)
    }
  }

  displayMessage(text_lines){
    this.currentMessage = text_lines;
    this.buttonEventHandler = 'message';
    this.runStackPaused = true;
  }

  dismissMessage(){
    this.runStackPaused = false;
    this.currentMessage = null;
    this.buttonEventHandler = 'default';
  }

  displayMenu(choices,prompt,result_variable,useValue){
    this.menuChoices = choices;
    this.menuPrompt = prompt;
    this.menuSelectorIndex = 0;
    this.menuVariable = result_variable;
    this.menuUseValue = useValue;
    this.buttonEventHandler = 'menu';
    this.runStackPaused = true;
  }

  dismissMenu(){
    this.runStackPaused = false;
    this.menuChoices = null;
    this.menuPrompt = null;
    this.menuSelectorIndex = 0;
    this.menuVariable = null;
    this.menuUseValue = false;
    this.buttonEventHandler = 'default';
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

    var player_sp = document.createElement('span')
    var player_tv = document.createElement('div');
    player_sp.setAttribute('class','caret');
    player_sp.setAttribute('onclick','flipCaret(this)');
    player_sp.innerHTML = 'Player';
    player_tv.append(player_sp);

    var playerNodes = document.createElement('div');
    playerNodes.setAttribute('class','nested player');
    player_tv.append(playerNodes);
    node.append(player_tv);

    if (this.player){
      var playerNode = this.player.display('game');
      playerNodes.append(playerNode);
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

    var childData = {'parent':null,'game':this.game};

    this.things = {};
    for (const [thing_id,thing_data] of Object.entries(data['things'])){
      var newThing = new Thing(childData);
      newThing.load(thing_data);
      this.things[newThing.id] = newThing;
    }

    this.player = new Player(childData);
    if (data['player']){
      this.player.load(data['player']);
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

    var things = {}
    for (const [key,value] of Object.entries(this.things)){
      things[key] = value.save();
    }
    data['things'] = things;

    data['player'] = this.player.save();

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
}