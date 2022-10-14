import JSMaze from "./display/js-maze.js";
import Prim3dGenerator from "./generation/prim-3d-generator.js";
import Maze3d from "./generation/maze3d.js";
const container = document.getElementById('jsMazeContainer');
const mFrame = document.getElementById('JSMazeFrame')
const maze1 = new Prim3dGenerator(3,5,5).generate();
let js1 = new JSMaze(container, maze1);
function mazeKeyFunction(e){
    if(!(e.target instanceof HTMLInputElement)){
        let acceptable =[`PageUp`, `PageDown`, `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`]
        if(acceptable.includes(e.key)){
            js1.makeMove((e.key));
            e.preventDefault();
        }
    }
}
document.addEventListener('keydown', e => mazeKeyFunction(e));
mFrame.focus();
//const savedMazes = new Map();
const IMAGEEXT = '-image'

function saveMaze(name, jsmaze) {
    localStorage.setItem(name, JSON.stringify(jsmaze.maze3d));
    localStorage.setItem(name + IMAGEEXT, jsmaze.charImagePath);
}
function loadMaze(name, jsMazeVar) {
    if(localStorage.getItem(name)){
        removeChildren(container);
        console.log(localStorage.getItem(name));
        let storageObj =localStorage.getItem(name);
        let unparsed = Maze3d.fromStorage(JSON.parse(storageObj));
        jsMazeVar.swapMaze(unparsed);
        jsMazeVar.setCharImagePath(localStorage.getItem(name + IMAGEEXT))
        saveMaze('default', js1);
    }    
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
    js1.swapMaze(newMaze);
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
function resizeMe() {
    removeChildren(container);
    js1.swapMaze(js1.maze3d);
}
//todo - currently very problematic when going from small media query to large
document.defaultView.addEventListener('resize', e => {removeChildren(container);js1.swapMaze(js1.maze3d)});

