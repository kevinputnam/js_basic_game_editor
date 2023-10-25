
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
    this.createPlayContext();
    this.runStack = [];
    this.variables = {};
  }

  run(args){

    this.runStack = this.runStack.concat(this.actions);
    this.currentScene = this.scenes[this.first_scene];
    this.currentScene.run();
    this.updatePlayView();
    while(this.runStack.length > 0){
      var action = this.runStack.pop();
      action.run();
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