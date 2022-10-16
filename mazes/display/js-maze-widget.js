import Maze3d from "../generation/maze3d.js";
import Prim3dGenerator from "../generation/prim-3d-generator.js";
import JSMaze from "./js-maze.js";

class JSMazeWidget {
    // empty constructor, nothing really needed here. Perhaps could introduce the id names here
    // but I don't really see any benefit, just a shift of magic strings
    constructor(depth=3, height=5, width=5, image='char-icon.png') {
        if(!this.validParameters(depth, height, width)){
            throw new Error('Invalid parameters');
        }
        this.defaultDepth = Math.floor(depth);
        this.defaultHeight = Math.floor(height);
        this.defaultWidth = Math.floor(width);
        this.defaultImage = image;
    }

    validParameters(z, y, x) {
        let notNumeric = (isNaN(z) || isNaN(y) || isNaN(x));
        if(notNumeric) {
            return false;
        }
        let notPositive = (z < 1 || y < 1 || x < 1);
        if(notPositive) {
            return false
        }
        let notSinglet = (z < 2 && y < 2 && x < 2);
        return !notSinglet;
    }
    /** Initializes and runs the JS maze display and the other game components
     *  assumes the correct html elements exist
     */
    run() {
        this.setVariables();
        this.setFunctions();
        this.setEventHandlers();
        this.saveMaze('default', this.js1);
        this.mFrame.focus();
    }

    /**
     * sets up all the variables used in the various functions 
     */
    setVariables() {
        this.container = document.getElementById('jsMazeContainer');
        this.mFrame = document.getElementById('JSMazeFrame');
        this.maze1 = new Prim3dGenerator(this.defaultDepth, this.defaultHeight, this.defaultWidth).generate(); 
        this.js1 = new JSMaze(this.container, this.maze1);
        this.js1.setCharImagePath(this.defaultImage);
        this.IMAGEEXT = '-image';
        this.algSelect = document.getElementById('algo');
        this.saveBtn = document.getElementById('btnSave');
        this.loadBtn = document.getElementById('btnLoad');
        this.genBtn = document.getElementById('btnGen');
        this.solBtn = document.getElementById('btnSolve');
        this.hintBtn = document.getElementById('btnHint');
        this.resetBtn = document.getElementById('btnReset');
    }

    /** sets the various functions that need to be run/bound to event handlers */
    setFunctions() {
        // movement function
        this.mazeKeyFunction = e => {
            if(!(e.target instanceof HTMLInputElement)){
                let acceptable =[`PageUp`, `PageDown`, `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`]
                if(acceptable.includes(e.key)){
                    this.js1.makeMove((e.key));
                    e.preventDefault();
                }
            }
        }
        // save named mazes to localStorage
        this.saveMaze = (name, jsmaze) => {
            localStorage.setItem(name, JSON.stringify(jsmaze.maze3d));
            localStorage.setItem(name + this.IMAGEEXT, jsmaze.charImagePath);
        }
        // loads from localStorage
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
        // delete the current displayed maze and replaces with a new one
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
    /** binds the various functions to event handlers */
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
                alert("Invalid maze parameter");
                return false;
            }
            if(!(z >= 2 || x >= 2 || y >= 2) ) {
                alert('Maze cannot be only 1 cell');
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

export default JSMazeWidget;