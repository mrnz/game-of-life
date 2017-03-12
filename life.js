(function () {

    var _ = self.Life = function (seed) {
        this.seed = seed;
        this.height = seed.length;
        this.width = seed[0].length;

        this.prevBoard = [];
        this.board = cloneArray2D(seed)
    }

    _.prototype.next = function () {
        this.prevBoard = cloneArray2D(this.board);

        this.prevBoard.forEach( (row,y) => {
            row.forEach( (elem, x) => {

                var aliveNeighbors = this.aliveNeighbors( this.prevBoard, x, y);
                var thisCell = !!this.board[y][x];
                if(thisCell){
                    if( aliveNeighbors < 2 || aliveNeighbors > 3 ){
                        this.board[y][x] = 0;
                    }
                }else{
                    if( aliveNeighbors === 3 ){
                        this.board[y][x] = 1;
                    }
                }

            });
        });

    };

    _.prototype.toString = function () {
        return this.board.map(row=>row.join(' ')).join('\n')
    }

    _.prototype.aliveNeighbors = function (array ,x, y) {
        var prevRow = array[y-1] || [],
            nextRow = array[y+1] || [];

        return [
            prevRow[x-1],prevRow[x],prevRow[x+1],
            array[y][x-1],array[y][x+1],
            nextRow[x-1],nextRow[x],nextRow[x+1],
        ].reduce( (prev, curr) => prev + +!!curr, 0 );
    }

})();

var cloneArray2D = array => array.map(row=>row.map(elem=>elem));


var game = new Life([
    [0,0,0,0,0,0],
    [0,0,0,0,0,0],
    [0,0,1,1,1,0],
    [0,1,1,1,0,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0],
]);

console.log(game + '');

game.next();

console.log(game + '');

game.next();

console.log(game + '');


(function () {

    var _ = self.LifeView = function (table, size) {
        this.grid = table;
        this.size = size;

        this.createGrid();
    }

    _.prototype.createGrid = function () {
        console.log(this);
        var fragment = document.createDocumentFragment();
        this.grid.innerHTML = '';
        this.checkoboxes = [];


        for (var y = 0; y < this.size; y++) {
            var row = document.createElement('tr');
            this.checkoboxes[y]  = [];

            for (var x = 0; x < this.size; x++) {
                var cell = document.createElement('td');
                var checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                this.checkoboxes[y][x] = checkbox;
                cell.appendChild(checkbox)
                row.appendChild(cell);
            }

            this.grid.appendChild(row);
        }

    }

})();

var lifeView = new LifeView( document.getElementById('grid'),12 );


