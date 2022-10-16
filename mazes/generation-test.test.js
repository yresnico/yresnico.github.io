import Cell from "./generation/cell.js";
import DFSMaze3dGenerator from "./generation/dfs-maze-3d-generator.js";
import Maze3d from "./generation/maze3d.js";
import Prim3dGenerator from "./generation/prim-3d-generator.js";
import Simple3dGenerator from "./generation/simple-3d-generator.js";

const dfsGen = new DFSMaze3dGenerator(3, 5, 5);
const primGen = new Prim3dGenerator(3, 5, 5);
const simpGen = new Simple3dGenerator(3, 5, 5)

test('typeOfOutput', () => {
    let newDFS = dfsGen.generate();
    let newPrim = primGen.generate();
    let newSimp = simpGen.generate();
    expect((newDFS instanceof Maze3d) && (newPrim instanceof Maze3d) && (newSimp instanceof Maze3d)).toBe(true);
})

test('correctDimensionsDFS', () => {
    let newDFS = dfsGen.generate();
    expect((newDFS.depth === 3) && (newDFS.height === 5) && (newDFS.width === 5)).toBe(true);
})

test('correctDimensionsPrim', () => {
    let newPrim = primGen.generate();
    expect((newPrim.depth === 3) && (newPrim.height === 5) && (newPrim.width === 5)).toBe(true);
})

test('correctDimensionsSimp', () => {
    let newSimp = simpGen.generate();
    expect((newSimp.depth === 3) && (newSimp.height === 5) && (newSimp.width === 5)).toBe(true);
})

test('fromStorageTest', () => {
    let aMaze = dfsGen.generate();
    let stored = JSON.stringify(aMaze);
    let unStored = Maze3d.fromStorage(JSON.parse(stored));
    let equivalent = (aMaze.start.value === unStored.start.value) && (aMaze.end.value === unStored.end.value) && (aMaze.depth === unStored.depth) && (aMaze.height === unStored.height) && (aMaze.width === unStored.width);
    expect(equivalent).toBe(true)
})
