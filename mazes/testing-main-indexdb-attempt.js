import JSMaze from "./display/js-maze.js";
import Prim3dGenerator from "./generation/prim-3d-generator.js";
import JSMazePersistence from "./display/js-maze-persistence.js";
import Simple3dGenerator from "./generation/simple-3d-generator.js";
/**
 * @type {IDBDatabase}
 * */
let db;

const openRequest = indexedDB.open('jsMaze_db');

openRequest.onerror = e => console.log(openRequest.errorCode)

openRequest.addEventListener('upgradeneeded', () => {
    db = openRequest.result;

    db.createObjectStore('mazes', {keyPath: 'name'})
    console.log('db setup complete');

})
openRequest.onsuccess = e => {
    console.log("opened successfully");
    db = openRequest.result;

const container = document.getElementById('jsMazeContainer');
const mFrame = document.getElementById('JSMazeFrame')
const persist = new JSMazePersistence();
const maze1 = new Prim3dGenerator(3,5,5).generate();
let js1 = new JSMaze(container, maze1);

mFrame.addEventListener('keydown', e => {
    let acceptable =[`PageUp`, `PageDown`, `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`]
    if(acceptable.includes(e.key)){
        js1.makeMove((e.key));
        e.preventDefault();
    }
}   );
mFrame.focus();
const savedMazes = new Map();

function saveMaze(name, jsmaze) {
    console.log(db);
    let mazeObjectStore = db.transaction('mazes', 'readwrite').objectStore('mazes');
    let saveRequest = mazeObjectStore.put({name: name, mazeInfo: [jsmaze.maze3d, jsmaze.charImagePath]});
    saveRequest.onerror = e => console.log(e.errorCode);
    saveRequest.onsuccess = e => console.log(`${name} maze saved`)
    //savedMazes.set(name, [jsmaze.maze3d, jsmaze.charImagePath]);
}
function loadMaze(name, jsMazeVar) {
    let mazeObjectStore = db.transaction('mazes', 'readwrite').objectStore('mazes');
    let loadRequest = mazeObjectStore.get(name);
    loadRequest.onerror = e => console.log(e.errorCode);
    loadRequest.onsuccess = e => {
        removeChildren(container);
        let mazeInfo = loadRequest.result.mazeInfo;
        // Reset the "private" variables that weren't saved
        mazeInfo[0].depth = mazeInfo[0].matrix.length;
        mazeInfo[0].height = mazeInfo[0].matrix[0].length;
        mazeInfo[0].width = mazeInfo[0].matrix[0][0].length;
        jsMazeVar.swapMaze(mazeInfo)
        saveMaze('default', jsMazeVar)
    }
    // if(savedMazes.has(name)){
    //     removeChildren(container);
    //     jsMazeVar.swapMaze(savedMazes.get(name));
    //     console.log(jsMazeVar);
    // }    
}

saveMaze('default', js1)

const resetBtn = document.getElementById('btnReset');

resetBtn.addEventListener('mousedown', e => {
    loadMaze('default', js1);
}   );

function solveMaze(alg) {
    js1.animateSolution(alg)
}

function hint(alg) {
    js1.showHint(alg);
}

const solBtn = document.getElementById('btnSolve');
const algSelect = document.getElementById('algo');

solBtn.addEventListener('mousedown', e => {solveMaze(algSelect.value)});
const hintBtn = document.getElementById('btnHint');

hintBtn.addEventListener('mousedown', e => {
    hint(algSelect.value)
}   );

const saveBtn = document.getElementById('btnSave');
const loadBtn = document.getElementById('btnLoad');

saveBtn.addEventListener('mousedown', () => {
    let mazeName = document.getElementById('name');
    saveMaze(mazeName.value, js1);
}    );

loadBtn.addEventListener('mousedown', () =>{
    let mazeName = document.getElementById('name');
    loadMaze(mazeName.value, js1);
} );

const genBtn = document.getElementById('btnGen');

function removeChildren(element){
    while(element.firstChild){
        element.removeChild(element.firstChild);
    }
}

function generateNewJSMaze(depth, height, width, container){
    let newMaze = new Prim3dGenerator(depth, height, width).generate();
    removeChildren(container);
    js1.swapMaze([newMaze, js1.charImagePath]);
    saveMaze('default', js1);
}

function validateNumber(value) {
    return (!isNaN(value) && value > 0);
}
genBtn.addEventListener('mousedown', e => {
    let z = Math.floor(Number(document.getElementById('depth').value));
    let y = Math.floor(Number(document.getElementById('height').value));
    let x = Math.floor(Number(document.getElementById('width').value));
    let confirmed = true;
    if(!validateNumber(z) || !validateNumber(y) || !validateNumber(x)) {
        return false;
    }

    if(x > 25 || y > 25) {
        confirmed = confirm('The maze may be difficult to read. Continue?');
    }

    if(confirmed) {
        generateNewJSMaze(z, y, x, container);
    }
})

const clickables = document.getElementsByTagName('button');
for(let clickable of clickables) {
    clickable.addEventListener('blur', e => {mFrame.focus();})
}

const inputs = document.getElementsByTagName('input');
for(let input of inputs ){
    input.addEventListener('blur', e => {mFrame.focus();})
}
};