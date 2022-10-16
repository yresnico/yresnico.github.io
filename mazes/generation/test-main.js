import Cell from "./cell.js";
import DFSMaze3dGenerator from "./dfs-maze-3d-generator.js";
import Maze3d from "./maze3d.js";
import Prim3dGenerator from "./prim-3d-generator.js";
import Simple3dGenerator from "./simple-3d-generator.js";
// This file contains the code originally used to test my functions
// const cell = new Cell();
// console.dir(cell);
// const cell2 = new Cell(4);
// console.dir(cell2);
// const maze = new Maze3d(3, 5, 5, 4);
// console.dir(maze);
// console.log(maze.toString());
// maze.matrix[1][1][1].addWall(4)
// console.dir(maze);
// console.log(maze.toString());
const simple = new Simple3dGenerator(2, 5, 5);
const newMaze = simple.generate();
console.log(newMaze.toString());
// console.log(simple.measureAlgorithmTime());
 const dfs = new DFSMaze3dGenerator(2, 5, 5);
const newMaze2 = dfs.generate();

console.log(newMaze2.toString());
// console.log(dfs.measureAlgorithmTime());
const primGen = new Prim3dGenerator(2, 5, 5);
const newMaze3 = primGen.generate();
console.log(newMaze3.toString());
console.log(`Simple generation time: `, simple.measureAlgorithmTime());
console.log(`DFS generation time: `, dfs.measureAlgorithmTime());
console.log(`Prim generation time: `, primGen.measureAlgorithmTime());
const aCopyMaze = new Maze3d(1, 2, 2);
aCopyMaze.fromMaze3d(newMaze3);
console.log(aCopyMaze.toString())