import { GRID_SIZE, BOX_SIZE } from "./utilities.js";


export function generateSudoku() {
    const sudoku = createEmptyGrid();
    generateResolvedSudoku(sudoku);
    //resolveSudoku(sudoku);
    const resolved = sudoku;
    return {sudoku: removeCells(sudoku), resolved: resolved};
}

function createEmptyGrid() {
    return new Array(GRID_SIZE).fill().map(() => new Array(GRID_SIZE).fill(null));
}

function resolveSudoku(grid) {
    const emptyCell = findEmptyCell(grid);
    if (!emptyCell) return true;

    const numbers = getRandomNumbers();

    for (let i = 0; i < numbers.length; i++) {
        if (!validate(grid, emptyCell.row, emptyCell.column, numbers[i])) continue;

        grid[emptyCell.row][emptyCell.column] = numbers[i];

        if (resolveSudoku(grid)) return true;

        grid[emptyCell.row][emptyCell.column] = null;
    }
}

export function findEmptyCell(grid) {
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let column = 0; column < GRID_SIZE; column++) {
            if (grid[row][column] === null) return { row, column };
        }
    }
    return null;
}

function getRandomNumbers() {
    let numbers = [];

    for (let i = 1; i <= GRID_SIZE; i++) {
        numbers.push(i);
    }
    console.log(numbers)

    for (let i = numbers.length - 1; i >= 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[randomIndex]] = [numbers[randomIndex], numbers[i]];
    }

    return numbers;
}

function validate(grid, row, column, value) {
    return validateColumn(grid, row, column, value)
        && validateRow(grid, row, column, value)
        && validateBox(grid, row, column, value);
}

function validateColumn(grid, row, column, value) {
    for (let iRow = 0; iRow < GRID_SIZE; iRow++) {
        if (grid[iRow][column] === value && iRow !== row) return false;
    }
    return true;
}

function validateRow(grid, row, column, value) {
    for (let iColumn = 0; iColumn < GRID_SIZE; iColumn++) {
        if (grid[row][iColumn] === value && iColumn !== column) return false;
    }
    return true;
}

function validateBox(grid, row, column, value) {
    const firstRowInBox = row - row % BOX_SIZE;
    const firstColumnInBox = column - column % BOX_SIZE;

    for (let iRow = firstRowInBox; iRow < firstRowInBox + BOX_SIZE; iRow++) {
        for (let iColumn = firstColumnInBox; iColumn < firstColumnInBox + BOX_SIZE; iColumn++) {
            if (grid[iRow][iColumn] === value && iRow !== row && iColumn !== column) return false;
        }
    }
    return true;
}

function removeCells(grid) {
    const DIFFICULTY = Math.round(GRID_SIZE ** 2 / 2);
    const resultGrid = [...grid].map(row => [...row]);

    let i = 0;
    while (i < DIFFICULTY) {
        let row = Math.floor(Math.random() * GRID_SIZE);
        let column = Math.floor(Math.random() * GRID_SIZE);
        if (resultGrid[row][column] !== null) {
            resultGrid[row][column] = null;
            i++;
        }
    }

    return resultGrid;
}

function generateResolvedSudoku(grid) {
    fillBasic(grid);
    
    for (let i = 0; i < 10 * BOX_SIZE; i++) {
		switch (Math.floor(Math.random() * BOX_SIZE)) {
		case 0: transposing(grid); break;
		case 1: swapRows(grid); break;
		case 2: swapColums(grid); break;
		}
	}
}

function fillBasic(grid) {
	let num = 0;

	for (let i = 0; i < GRID_SIZE; i++) {
		for (let j = 0; j < GRID_SIZE; j++)
			grid[i][j] = num++ % GRID_SIZE + 1;
		num += (i + 1) % BOX_SIZE ? BOX_SIZE : BOX_SIZE + 1;
	}
}

function transposing(grid) {
	let temp;

	for (let i = 0; i < GRID_SIZE; i++) {
		for (let j = 0; j < i + 1; j++) {
			temp = grid[i][j];
			grid[i][j] = grid[j][i];
			grid[j][i] = temp;
		}
	}
}

function swapRows(grid) {
	let temp;
	let area = Math.floor(Math.random() * BOX_SIZE);
	let line1 = Math.floor(Math.random() * BOX_SIZE);
	let line2 = Math.floor(Math.random() * BOX_SIZE);

	while (line1 == line2) {
		line2 = Math.floor(Math.random() * BOX_SIZE);
	}

	for (let j = 0; j < GRID_SIZE; j++) {
		temp = grid[area * BOX_SIZE + line1][j];
		grid[area * BOX_SIZE + line1][j] = grid[area * BOX_SIZE + line2][j];
		grid[area * BOX_SIZE + line2][j] = temp;
	}
}

function swapColums(grid) {
	let temp;
	let area = Math.floor(Math.random() * BOX_SIZE);
	let line1 = Math.floor(Math.random() * BOX_SIZE);
	let line2 = Math.floor(Math.random() * BOX_SIZE);

	while (line1 == line2) {
		line2 = Math.floor(Math.random() * BOX_SIZE);
	}

	for (let i = 0; i < GRID_SIZE; i++) {
		temp = grid[i][area * BOX_SIZE + line1];
		grid[i][area * BOX_SIZE + line1] = grid[i][area * BOX_SIZE + line2];
		grid[i][area * BOX_SIZE + line2] = temp;
	}
}
