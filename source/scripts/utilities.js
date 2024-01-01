export var GRID_SIZE = 9;
export var BOX_SIZE = 3;

export function convertPositionToIndex(row, column) {
  return row * GRID_SIZE + column;
}

export function convertIndexToPosition(index) {
  return {
    row: Math.floor(index / GRID_SIZE),
    column: index % GRID_SIZE
  };
}

export function changeVars(value) {
  GRID_SIZE = value;
  BOX_SIZE = Math.sqrt(value);
}