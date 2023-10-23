var game_files = ["game_data_0.json","game_data_1.json"];
var game = null;
var saveLink = null;

function populate_game_picker(){
  var gameselector = document.getElementById('gamefilepicker');
  for (const gamefile of game_files){
    var opt = new Option;
    opt.value = gamefile;
    opt.innerHTML = gamefile;
    gameselector.appendChild(opt);
  }
}

function get_game_data(){
  var gameselector = document.getElementById('gamefilepicker');
  fetch(gameselector.value).then(response => response.text()).then(respText => load_game(respText));
}

function load_game(text){
  reset();
  var gameView = document.getElementById('gamedata');
  var jstuff = JSON.parse(text);
  game = new Game();
  game.load(jstuff);
  gameView.replaceChildren(game.display());
}

function create_new_game(){
  reset();
  var gameView = document.getElementById('gamedata');
  game = new Game();
  gameView.replaceChildren(game.display());
}

function save_game(){
  saveLink = null;
  if (game){
    var gameJSON = JSON.stringify(game.save(),null,'  ');
    const downloadFile = new File([gameJSON], 'game_data.json');
    var fileURL = URL.createObjectURL(downloadFile);
    var saveLink = document.createElement('a');
    saveLink.innerHTML = 'Download save game.'
    saveLink.setAttribute('href',fileURL);
    saveLink.setAttribute('id','download_link');
    saveLink.setAttribute('download','game_data.json');
    saveLink.click();
  }
}

function reset(){
  var editView = document.getElementById('editview');
  var gameView = document.getElementById('gamedata');

  //need to set id counters to zero
  Thing.next_id = 0;
  Scene.next_id = 0;

  game = null;
  editView.replaceChildren();
  gameView.replaceChildren();
}
