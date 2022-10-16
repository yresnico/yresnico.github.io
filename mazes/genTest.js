import Cell from "./generation/cell.js";
import DFSMaze3dGenerator from "./generation/dfs-maze-3d-generator.js";
import Maze3d from "./generation/maze3d.js";
import Prim3dGenerator from "./generation/prim-3d-generator.js";
import Simple3dGenerator from "./generation/simple-3d-generator.js";

const dfsGen = new DFSMaze3dGenerator(3, 5, 5);
const primGen = new Prim3dGenerator(3, 5, 5);
const simpGen = new Simple3dGenerator(3, 5, 5)

let aMaze = dfsGen.generate();
console.log(aMaze.toString())
let stored = JSON.stringify(aMaze);
let unStored = Maze3d.fromStorage(JSON.parse(stored));
console.log(unStored);
let equivalent = (aMaze.start.value === unStored.start.value) && (aMaze.end.value === unStored.end.value) && (aMaze.depth === unStored.depth) && (aMaze.height === unStored.height) && (aMaze.width === unStored.width);
