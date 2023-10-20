
class Game extends GameContainer {

  constructor(data) {
    super(data);

    this.type = "Game";

    this.author = "";
    this.scenes = {};
    this.things = {};
    this.first_scene = null;
    this.start_player_pos = [0,0];

    var scene_sp = document.createElement('span')
    this.scene_tv = document.createElement('div');
    scene_sp.setAttribute('class','caret');
    scene_sp.setAttribute('onclick','flipCaret(this)');
    scene_sp.innerHTML = 'Scenes';
    this.scene_tv.append(scene_sp)

    this.sceneNodes = document.createElement('div');
    this.sceneNodes.setAttribute('class','nested');
    this.scene_tv.append(this.sceneNodes)
    this.node.append(this.scene_tv);
  }

  updateDisplay(){
    this.nodeSpan.innerHTML = '<b>'+this.name+ ':</b> ' + this.description;
  }

  display() {
    super.display();

    if (this.things){
      for (var [id,thing] of Object.entries(this.things)){
        console.log(thing);
        this.thingNodes.append(thing.display());
      }
    }

    if (this.scenes){
      for (const [id,scene] of Object.entries(this.scenes)){
        this.sceneNodes.append(scene.display());
      }
    }
    return this.node;
  }

  load(data) {

    super.load(data);

    this.author= data['author'];
    this.first_scene = data['first_scene'];
    this.start_player_pos = data['start_player_pos'];

    this.things = {};
    for (const thing_data of data['things']){
      var newThing = new Thing({'parent':this});
      newThing.load(thing_data);
      this.things[newThing.id] = newThing;
    }

    this.scenes = {};
    for (const scene_data of data['scenes']){
      var newScene = new Scene({'parent':this});
      newScene.load(scene_data);
      this.scenes[newScene.id] = newScene;
    }

  }

  save() {
    var data = super.save();
    data['author'] = this.author;
    data['first_scene'] = this.first_scene;
    data['start_player_pos'] = this.start_player_pos;

    things = {}
    for (const [key,value] of Object.entries(this.things)){
      things[key] = value.save();
    }
    data['things'] = things;

    scenes = {}
    for (const [key,value] of Object.entries(this.scenes)){
      scenes[key] = value.save();
    }
    data['scenes'] = scenes;

    return data;
  }

  edit(){
    super.edit();
    var editView = document.getElementById('editview');
  }
}