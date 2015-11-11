/**
 * Created by Sunil Soundarapandian
*/

function Blocks(getV) {
    this.value = getV;this.row = -1;this.col = -1;
    this.getValue = function() {
        return this.value;
    };
    this.addValue = function(o) {
        o.value += this.value;
    };
    this.collaps = function(other, matrix) {
        this.addValue(other);
        matrix.spaces[this.row][this.col] = null;
    };
    this.isPossibleMerge = function(other) {
        return other != null && other != -1 && this.value === other.getValue();

    };
    this.canMove = function(dir, grid) {
        return this.getAdjacentBlocks(dir, grid) == null;
    };

    this.moveOnce = function(dir, grid) {
        switch (dir) {
            case "down":
                var currRow = this.row + 1;
                var currCol = this.col;
                break;
            case "up":
                var currRow = this.row - 1;
                var currCol = this.col;
                break;
            case "left":
                var currRow = this.row;
                var currCol = this.col - 1;
                break;
            case "right":
                var currRow = this.row;
                var currCol = this.col + 1;
                break;
        }
        grid.spaces[this.row][this.col] = null;

        grid.spaces[currRow][currCol] = this;
        this.row = currRow;
        this.col = currCol;
    };
    this.getAdjacentBlocks = function(dir, grid) {
        var isPresentInBounds = function(row, col) {
            return row < grid.spaces.length && row >= 0 && col < grid.spaces[row].length && col >= 0;
        };
        switch (dir) {
            case "down":
                var currRow = this.row + 1;
                var currCol = this.col;
                break;
            case "up":
                var currRow = this.row - 1;
                var currCol = this.col;
                break;
            case "left":
                var currRow = this.row;
                var currCol = this.col - 1;
                break;
            case "right":
                var currRow = this.row;
                var currCol = this.col + 1;
                break;
        }
        if (!isPresentInBounds(currRow, currCol)) {
            return -1;
        }

        return grid.spaces[currRow][currCol];

    };
}
function theBlocks() {
    this.spaces = [
        [,,,,],
        [,,,,],
        [,,,,],
        [,,,,]
    ];
    var makeMove = false;
    this.move = function(dir) {
        var currRow = 0;
        var currCol = 0;
        var moveBoxess = function(piece, grid) {
            if (currPiece != null) {
                while (currPiece.canMove(dir, grid)) {
                    currPiece.moveOnce(dir, grid);
                    makeMove = true;
                }
                var neighbor = currPiece.getAdjacentBlocks(dir, grid);
                if (currPiece.isPossibleMerge(neighbor)) {
                    currPiece.collaps(neighbor, grid);
                    makeMove = true;
                }
            }
        }
        switch (dir) {
            case "down":
                currRow = this.spaces.length - 1;
                for (var col = currCol; col < this.spaces[0].length; col++) {
                    for (var row = currRow; row >= 0; row--) {
                        var currPiece = this.spaces[row][col];
                        moveBoxess(currPiece, this);
                    }
                }
                break;
            case "up":
                currRow = 0;
                for (var col = currCol; col < this.spaces[0].length; col++) {
                    for (var row = currRow; row < this.spaces.length; row++) {
                        var currPiece = this.spaces[row][col];
                        moveBoxess(currPiece, this);
                    }
                }
                break;
            case "left":
                currCol = 0;
                for (var row = currRow; row < this.spaces.length; row++) {
                    for (var col = currCol; col < this.spaces[0].length; col++) {
                        var currPiece = this.spaces[row][col];
                        moveBoxess(currPiece, this);
                    }
                }
                break;
            case "right":
                currCol = this.spaces[0].length - 1;
                for (var row = currRow; row < this.spaces.length; row++) {
                    for (var col = currCol; col >= 0; col--) {
                        var currPiece = this.spaces[row][col];
                        moveBoxess(currPiece, this);
                    }
                }
                break;
        }
        if (makeMove) {
            if (Math.random() < 0.5) {
                this.addBlock(new Blocks(2));
            } else {
                this.addBlock(new Blocks(4));
            }
        }
        makeMove = false;
    };
    this.addBlock = function(piece) {
        var emptyPositions = [];
        for (var i = 0; i < this.spaces.length; i++) {
            for (var j = 0; j < this.spaces[i].length; j++) {
                if (this.spaces[i][j] == null) {
                    emptyPositions.push([i, j]);
                }
            }
        }
        var randomPos = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
        this.spaces[randomPos[0]][randomPos[1]] = piece;
        piece.row = randomPos[0];
        piece.col = randomPos[1];
    };
    this.addPieceToPos = function(piece, row, col) {
        this.spaces[row][col] = piece;
        piece.row = row;
        piece.col = col;
    };
    this.canEndGame = function() {
        var g = this;
        var isGameEnd = function(piece) {
            if (piece === -1) {
                return true;
            } else if (piece == null) {
                return false;
            } else {
                var rightSideBlock = piece.getAdjacentBlocks("right", g);
                var bottomBlockItem = piece.getAdjacentBlocks("down", g);
                return !piece.isPossibleMerge(rightSideBlock) && !piece.isPossibleMerge(bottomBlockItem)
                    && isGameEnd(rightSideBlock) && isGameEnd(bottomBlockItem);
            }
        }
        return isGameEnd(this.spaces[0][0]);

    };
    this.toString = function() {
        var returned = "";
        for (var row = 0; row < this.spaces.length; row++) {
            for (var col = 0; col < this.spaces[row].length; col++) {
                var currPiece = this.spaces[row][col];
                if (currPiece == null) {
                    returned = returned + "0"
                } else {
                    returned = returned + currPiece.getValue();
                }
                returned = returned + " ";
            }
            returned = returned + "\n";
        }
        return returned;

    };
}
function Myplay() {
    this.score = 0;
    this.grid = new theBlocks();
    this.playing = false;
    this.configureFromReset = function() {
        this.grid = new theBlocks();
        this.score = 0;
        this.grid.addBlock(new Blocks(2));
        this.grid.addBlock(new Blocks(2));
        this.playing = true;
        this.chengeBlocks();
    };
    this.chengeBlocks = function() {
        for (var i = 0; i < this.grid.spaces.length; i++) {
            for (var j = 0; j < this.grid.spaces[i].length; j++) {
                var currPiece = this.grid.spaces[i][j];
                var idString = "#block-" + i + "-" + j;
                if (currPiece == null) {
                    $(idString + " .label").html("&nbsp;");
                    $(idString).attr("data-bg", 0);
                } else {
                    $(idString + " .label").html("" + currPiece.getValue());
                    $(idString).attr("data-bg", currPiece.value);
                }
            }
        }
    };
    this.start = function() {
        this.configureFromReset();
        var grid = this.grid;
        var myplay = this;
        $(document).keydown(function(e) {
            switch(e.which) {
                case 37:
                    grid.move("left");
                    break;

                case 38:
                    grid.move("up");
                    break;

                case 39:
                    grid.move("right");
                    break;

                case 40:
                    grid.move("down");
                    break;

                default: return;
            }
            myplay.chengeBlocks();
            if (grid.canEndGame()) {
                myplay.playing = false;
                alert("game over")
                return;
            }
            e.preventDefault();
        });
    };
}
var myplay = new Myplay();
$(document).ready(function(){
    var b = c = 0;
    for(a=0;a<16;a++){
        if(a > 3 && a % 4 == 0){
            b = b+1;
            c = 0 ;
        }
        var boxes = $('<div class = "boxing" id = "block-'+b+'-'+c+'"><div class = "label"></div></div>');
        c = c+1;
        $('.grid').append(boxes);
    }
    myplay.start();
});


