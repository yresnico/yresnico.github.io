import Cell from "./generation/cell.js";
import DFSMaze3dGenerator from "./generation/dfs-maze-3d-generator.js";
import Maze3d from "./generation/maze3d.js";
import Prim3dGenerator from "./generation/prim-3d-generator.js";
import Simple3dGenerator from "./generation/simple-3d-generator.js";

const newCell = new Cell(0, 0, 0);

test('checkWallNumber', () => {
    expect(newCell.walls.length).toBe(6);
})

test('checkNeighborNumber', () => {
    expect(newCell.neighbors.length).toBe(6)
})

test('newCellValue', () => {
    expect(newCell.value).toBe('0,0,0')
})

test('newCellDepth', () => {
    expect(newCell.depth).toBe(0);
})

test('newCellHeight', () => {
    expect(newCell.height).toBe(0);
})

test('newCellWidth', () => {
    expect(newCell.width).toBe(0);
})

const rightCell = new Cell(0, 0, 1);

test('addRightNeighbor', () => {
    newCell.addNeighbor(rightCell, 5);
    expect(newCell.neighbors[5].value).toBe('0,0,1');
})

test('hasRightWall', () => {
    expect(newCell.walls[5]).toBe(true)
})

test('hammerRight', () => {
    newCell.hammer(rightCell);
    expect(newCell.walls[5]).toBe(false);
})

