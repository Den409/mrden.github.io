import { GRID_SIZE, BOX_SIZE } from "./utilities.js";
import { generateSudoku, findEmptyCell } from "./sudokuGenerator.js";

export class Sudoku {
  constructor() {
    let grids = generateSudoku();
    this.grid = grids.sudoku;
    this.resolvedGrid = grids.resolved;
  }

  isRight(row, column, value) {
    if (this.resolvedGrid[row][column] === value)
      return true;
    return false;
  }

  getDuplicatePositions(row, column, value) {
    const duplicatesInColumn = this.getDuplicatePositionsInColumn(row, column, value)
    const duplicatesInRow = this.getDuplicatePositionsInRow(row, column, value);
    const duplicatesInBox = this.getDuplicatePositionsInBox(row, column, value);

    const duplicates = [...duplicatesInColumn, ...duplicatesInRow];
    duplicatesInBox.forEach(duplicateInBox => {
      if (duplicateInBox.row !== row && duplicateInBox.column !== column) duplicates.push(duplicateInBox);
    });

    return duplicates;
  }

  getDuplicatePositionsInColumn(row, column, value) {
    const duplicates = [];
    for (let iRow = 0; iRow < GRID_SIZE; iRow++) {
      if (this.grid[iRow][column] === value && iRow !== row) {
        duplicates.push({ row: iRow, column });
      }
    }
    return duplicates;
  }

  getDuplicatePositionsInRow(row, column, value) {
    const duplicates = [];
    for (let iColumn = 0; iColumn < GRID_SIZE; iColumn++) {
      if (this.grid[row][iColumn] === value && iColumn !== column) {
        duplicates.push({ row, column: iColumn });
      }
    }
    return duplicates;
  }

  getDuplicatePositionsInBox(row, column, value) {
    const duplicates = [];
    const firstRowInBox = row - row % BOX_SIZE;
    const firstColumnInBox = column - column % BOX_SIZE;

    for (let iRow = firstRowInBox; iRow < firstRowInBox + BOX_SIZE; iRow++) {
      for (let iColumn = firstColumnInBox; iColumn < firstColumnInBox + BOX_SIZE; iColumn++) {
        if (this.grid[iRow][iColumn] === value && iRow !== row && iColumn !== column) {
          duplicates.push({ row: iRow, column: iColumn });
        }
      }
    }
    return duplicates;
  }

  hasEmptyCells() {
    return Boolean(findEmptyCell(this.grid));
  }
}