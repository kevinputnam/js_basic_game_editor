
class Scene extends GameContainer {
  static next_id = 0;

  constructor(data) {
    super(data);

    this.id = Scene.next_id;
    Scene.next_id += 1;
    this.type = "Scene";

    this.background = "";
    this.backgroundImage = null;
    this.map_size = [];
    this.grid_size = null;
    this.collisions = [];
  }

  load(data) {

    super.load(data);

    var me = this;
    this.background = data['background'];
    if(this.background){
      this.backgroundImage = document.createElement('img');
      this.backgroundImage.setAttribute('src',this.background);
      this.backgroundImage.addEventListener("load", (e) => {
        me.game.updatePlayView();
      });
    }
    this.map_size = data['map_size'];
    this.grid_size = data['grid_size'];
    this.collisions = data['collisions'];
  }

  save() {
    var data = super.save();
    data['background'] = this.background;
    data['map_size'] = this.map_size;
    data['grid_size'] = this.grid_size;
    data['collisions'] = this.collisions;

    return data;
  }

  edit(node){
    super.edit(node);
    this.game.currentScene = this;
    var me = this;
    var editView = document.getElementById('editview');

    this.game.updatePlayView();

    var inputLabel = document.createElement("label")
    inputLabel.innerHTML = "Background image: ";

    var backgroundThumbnail = document.createElement('img');
    backgroundThumbnail.setAttribute('style','width:100;');
    if(this.background){
      backgroundThumbnail.setAttribute('src',this.background);
    }

    var imageFileInputField = createElementWithAttributes('input',{'type':'text','maxlength':'100','size':'60'});
    imageFileInputField.value = this.background;
    imageFileInputField.addEventListener("change", (event)=> {
      me.background = event.target.value;
      backgroundThumbnail.setAttribute('src',event.target.value);
      me.backgroundImage.setAttribute('src',event.target.value);
    })


    editView.append(inputLabel,imageFileInputField,document.createElement('br'),backgroundThumbnail,document.createElement('br'));
    editView.append(this.createRemoveButton(),document.createElement('br'),document.createElement('br'));
  }

  remove(){
    super.remove();
    if(this.parent){
      this.parent.scenes.splice(this.parent.scenes.indexOf(this.id),1);
    }
    var editView = document.getElementById('editview');
    editView.replaceChildren();
  }
}