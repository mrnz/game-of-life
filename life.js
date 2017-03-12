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





(function () {

    var _ = self.LifeView = function (table, size, playID, nextID) {
        this.grid = table;
        this.size = size;
        this.game = null;
        var playButton = document.getElementById(playID);
        var nextButton = document.getElementById(nextID);
        this.createGrid();

        playButton.addEventListener('click', ()=>{
            this.play();
        });

        nextButton.addEventListener('click', ()=>{
            this.next();
        });

    }

    _.prototype.createGrid = function () {

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

    _.prototype.play = function () {
        var seed = Array.prototype.map.call(this.grid.children, (row, y)=>{
            return Array.prototype.map.call(row.children, (cell, x)=>{
                return cell.childNodes[0].checked;
            })
        });

        this.game = new Life(seed);
    };

    _.prototype.next = function () {
        this.game.next();

        Array.prototype.forEach.call(this.grid.children, (row, y)=>{
            Array.prototype.forEach.call(row.children, (cell, x)=>{
                cell.childNodes[0].checked = this.game.board[y][x];
            });
        });

    };

})();

var lifeView = new LifeView( document.getElementById('grid'), 12, 'play', 'next' );
