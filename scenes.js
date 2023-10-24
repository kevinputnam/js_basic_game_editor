
class Scene extends GameContainer {
  static next_id = 0;

  constructor(data) {
    super(data);

    this.id = Scene.next_id;
    Scene.next_id += 1;
    this.type = "Scene";

    this.background = "";
    this.map_size = [];
    this.grid_size = null;
    this.collisions = [];
    this.canvasContext = null;
  }

  load(data) {

    super.load(data);

    this.background = data['background'];
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

  updatePlayView(){
    var playView = document.getElementById('mapview');
    var map = document.getElementById('map');
    if (map){
      map.remove();
    }
      const canvas = document.createElement("canvas");
      canvas.setAttribute('id','map');
      canvas.setAttribute('width','720');
      canvas.setAttribute('height','480');
      playView.append(canvas);
      const ctx = canvas.getContext("2d");
      this.canvasContext = ctx;

    if (this.background.length > 0){
      var image = document.createElement('img');
      image.setAttribute('src',this.background);
      image.addEventListener("load", (e) => {
        ctx.scale(2,2);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(image, 0,0);
      });

    }
    for (const thing of this.things){
      this.game.things[thing].showSprite();
    }
  }

  edit(node){
    super.edit(node);
    var me = this;
    var editView = document.getElementById('editview');

    this.updatePlayView();

    var inputLabel = document.createElement("label")
    inputLabel.innerHTML = "Background image: ";

    var imageFileInputField = createElementWithAttributes('input',{'type':'text','maxlength':'100','size':'60'});
    imageFileInputField.value = this.background;
    imageFileInputField.addEventListener("change", (event)=> {
      me.background = event.target.value;
      me.updatePlayView();
    })

    editView.append(inputLabel,imageFileInputField,document.createElement('br'));
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