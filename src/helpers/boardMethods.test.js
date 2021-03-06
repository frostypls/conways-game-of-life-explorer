/* global test expect */
import {
  cellCount,
  arrayFromWidthHeightWeight,
  iterateBoard,
} from './boardMethods';

test('it correctly counts the number of living cells surrounding a cell, which is 0 if everyone is dead', () => {
  var board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  expect(board.length).toEqual(9);
  var result = cellCount(board, 3, 5);
  expect(result).toBe(0);
  // this should work regardless of starting index
  for (var i = 0; i < board.length; i++) {
    result = cellCount(board, 3, i);
    expect(result).toBe(0);
  }
});

test('it correctly counts the number of living cells surrounding a cell, which is 8 if everyone is alive', () => {
  var board = [1, 1, 1, 1, 1, 1, 1, 1, 1];
  expect(board.length).toEqual(9);
  var result = cellCount(board, 3, 3, 5);
  expect(result).toBe(8);
  // this should work regardless of starting index
  for (var i = 0; i < board.length; i++) {
    result = cellCount(board, 3, i);
    expect(result).toBe(8);
  }
});

test('it creates a board with the expected width, height, and default weighting', () => {
  var result = arrayFromWidthHeightWeight(1, 1);
  expect(result).toEqual([0]);
  result = arrayFromWidthHeightWeight(2, 1);
  expect(result).toEqual([0, 0]);
  result = arrayFromWidthHeightWeight(3, 3);
  expect(result).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0]);
  result = arrayFromWidthHeightWeight(20, 10);
  expect(result.length).toEqual(200);
  expect(result.includes(1)).toEqual(false);
  result = arrayFromWidthHeightWeight(0, 0);
  expect(result).toEqual([]);
});

test('it creates a board with the expected width, height, and defined weighting of 100%', () => {
  var result = arrayFromWidthHeightWeight(20, 10, 100);
  expect(result.length).toEqual(200);
  expect(result.includes(0)).toEqual(false);
  expect(result.includes(1)).toEqual(true);
});

test('it creates a board with the expected width, height, and defined weighting of 0%', () => {
  var result = arrayFromWidthHeightWeight(20, 10, 0);
  expect(result.length).toEqual(200);
  expect(result.includes(0)).toEqual(true);
  expect(result.includes(1)).toEqual(false);
});

test('it iterates the board with the proper decisions (default rules)', () => {

  // any 3x3 board with a single living cell will iterate to all zeros
  for (var i = 0; i < 9; i++) {
    var board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    board[i] = 1;
    expect(iterateBoard(board, 3)).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0]);
  }
});

test('it tests a 2 period blinker with the default rules', () => {

  // any 3x3 board with a single living cell will iterate to all zeros
  var board = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  expect(iterateBoard(board, 5)).toEqual([0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]);
});

test('it tests that a 5x5 board with a single glider repeats every 20 iterations with the standard rules', () => {
  var board = [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0];
  var newBoard = board.slice();

  for (let i = 0; i < 20; i++)
    newBoard = iterateBoard(newBoard, 5);
  expect(newBoard).toEqual(board);
});

test('iterateBoard will fail when handling array with nonstandard cell values', () => {
  let board = [0,1,0,1];
  let width = 2;
  expect(() => iterateBoard(board, width)).not.toThrow();
  board = [0,1,0,2];
  expect(() => iterateBoard(board, width)).toThrow();
});


test('it converts and integer array to an array of cell objects with populateBoard', () => {
  var board = [];
  var result = board;
  expect(result).toEqual([]);
  board = [0];
  result = board;
  expect(result).toEqual([0]);
  board = [1];
  result = board;
  expect(result).toEqual([1]);
});

test('updateCellValues fails with old and new arrays of different lengths', () => {
  var oldBoard = [1, 42];
  var newBoard = [1, 2, 3];
  expect(() => updateCellValues(oldBoard, newBoard)).toThrow();
});
