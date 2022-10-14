import Maze3d from "../generation/maze3d.js";
import Prim3dGenerator from "../generation/prim-3d-generator.js";
import JSMaze from "./js-maze.js";

class JSMazeWidget{
    constructor(){

    }
    run(){
        this.setVariables();
        this.setfunctions();
        this.setEventHandlers();
        this.saveMaze('default', this.js1);
        this.mFrame.focus();
    }
    setVariables(){
        this.container = document.getElementById('jsMazeContainer');
        this.mFrame = document.getElementById('JSMazeFrame');
        this.maze1 = new Prim3dGenerator(3,5,5).generate(); 
        this.js1 = new JSMaze(this.container, this.maze1);
        this.IMAGEEXT = '-image';
        this.algSelect = document.getElementById('algo');
        this.saveBtn = document.getElementById('btnSave');
        this.loadBtn = document.getElementById('btnLoad');
        this.genBtn = document.getElementById('btnGen');
        this.solBtn = document.getElementById('btnSolve');
        this.hintBtn = document.getElementById('btnHint');
        this.resetBtn = document.getElementById('btnReset');
    }
    setfunctions() {
        this.mazeKeyFunction = e => {
            if(!(e.target instanceof HTMLInputElement)){
                let acceptable =[`PageUp`, `PageDown`, `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`]
                if(acceptable.includes(e.key)){
                    this.js1.makeMove((e.key));
                    e.preventDefault();
                }
            }
        }

        this.saveMaze = (name, jsmaze) => {
            localStorage.setItem(name, JSON.stringify(jsmaze.maze3d));
            localStorage.setItem(name + this.IMAGEEXT, jsmaze.charImagePath);
        }

        this.loadMaze = (name, jsMazeVar) => {
            if(localStorage.getItem(name)){
                this.removeChildren(this.container);
                console.log(localStorage.getItem(name));
                let storageObj =localStorage.getItem(name);
                let unparsed = Maze3d.fromStorage(JSON.parse(storageObj));
                jsMazeVar.swapMaze(unparsed);
                jsMazeVar.setCharImagePath(localStorage.getItem(name + this.IMAGEEXT))
                this.saveMaze('default', this.js1);
            }    
        }

        this.solveMaze = (alg) => {
            this.js1.animateSolution(alg)
        }
        
        this.hint = (alg) => {
            this.js1.showHint(alg);
        }

        this.removeChildren = (element) => {
            while(element.firstChild){
                element.removeChild(element.firstChild);
            }
        }
        
        this.generateNewJSMaze = (depth, height, width, container) => {
            let newMaze = new Prim3dGenerator(depth, height, width).generate();
            this.removeChildren(container);
            this.js1.swapMaze(newMaze);
            this.saveMaze('default', this.js1);
        }
        
        this.validateNumber = (value) => {
            return (!isNaN(value) && value > 0);
        }
        
        this.resizeMe = e => {
            this.removeChildren(this.container);
            this.js1.swapMaze(this.js1.maze3d);
        }
    }
    setEventHandlers() {
        document.addEventListener('keydown', e => this.mazeKeyFunction(e));
        document.defaultView.addEventListener('resize', e => this.resizeMe(e));
        
        this.saveBtn.addEventListener('mousedown', () => {
            let mazeName = document.getElementById('name');
            this.saveMaze(mazeName.value, this.js1);
        });
        
        this.loadBtn.addEventListener('mousedown', () =>{
            let mazeName = document.getElementById('name');
            this.loadMaze(mazeName.value, this.js1);
        });

        this.genBtn.addEventListener('mousedown', e => {
            let z = Math.floor(Number(document.getElementById('depth').value));
            let y = Math.floor(Number(document.getElementById('height').value));
            let x = Math.floor(Number(document.getElementById('width').value));
            let confirmed = true;
            if(!this.validateNumber(z) || !this.validateNumber(y) || !this.validateNumber(x)) {
                return false;
            }
        
            if(x > 25 || y > 25) {
                confirmed = confirm('The maze may be difficult to read. Continue?');
            }
        
            if(confirmed) {
                this.generateNewJSMaze(z, y, x, this.container);
            }
        });

        this.solBtn.addEventListener('mousedown', e => {this.solveMaze(this.algSelect.value)});
        
        this.hintBtn.addEventListener('mousedown', e => {this.hint(this.algSelect.value)});
        
        this.resetBtn.addEventListener('mousedown', e => {this.loadMaze('default', this.js1)});
    }
}
export default JSMazeWidget