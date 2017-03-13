(function(){
    "use strict";

    var cloneArray2D = array => array.map(row=>row.map(elem=>elem));

    (function () {

        var _ = self.Life = function (seed) {
            this.seed = seed;
            this.height = seed.length;
            this.width = seed[0].length;

            this.prevBoard = [];
            this.board = cloneArray2D(seed);
        }


        _.prototype.next = function () {
            this.prevBoard = cloneArray2D(this.board);

            this.prevBoard.forEach( (row,y) => {
                row.forEach( (elem, x) => {

                    var thisCell = !!this.board[y][x],
                        aliveNeighbors = this.aliveNeighbors( this.prevBoard, x, y);

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

    (function () {

        var _ = self.LifeView = function (table, size, autoplayID, nextID) {

            this.grid = table;
            this.size = size;
            this.game = null;
            this.started = false;

            this.autoplayButton = document.getElementById(autoplayID);
            this.nextButton = document.getElementById(nextID);

            this.createGrid();

            this.autoplayButton.addEventListener('change', evt => {
                this.nextButton.textContent = evt.target.checked === true ? "Play" : "Next";
                this.clearTimeout();
            });

            this.nextButton.addEventListener('click', ()=>this.next());

            this.grid.addEventListener('change', evt => {
                this.started = false;
                this.clearTimeout();
            });

            this.grid.addEventListener('keyup', evt => {

                var checkbox = evt.target,
                    y = evt.target.coords[0],
                    x = evt.target.coords[1];

                console.log(evt.keyCode);
                switch (evt.keyCode) {
                    case 13:
                        // enter
                        this.next();
                        break;
                    case 37:
                        // left
                        x > 0 && this.checkoboxes[y][x-1].focus();
                        break;
                    case 38:
                        // up
                        y > 0 && this.checkoboxes[y-1][x].focus();
                        break;
                    case 39:
                        // right
                        x < this.size-1 && this.checkoboxes[y][x+1].focus();
                        break;
                    case 40:
                        //  down
                        y < this.size-1 && this.checkoboxes[y+1][x].focus();
                        break;
                    default:

                }

            });

        }

        _.prototype.clearTimeout = function() {
            if(this.timeout){
                clearTimeout(this.timeout);
            }
        }
        _.prototype.createGrid = function () {

            var fragment = document.createDocumentFragment();
            this.grid.innerHTML = '';
            this.checkoboxes = [];


            for (let y = 0; y < this.size; y++) {
                let row = document.createElement('tr');
                this.checkoboxes[y]  = [];

                for (let x = 0; x < this.size; x++) {
                    let cell = document.createElement('td');
                    let checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    this.checkoboxes[y][x] = checkbox;
                    checkbox.coords = [y,x];
                    cell.appendChild(checkbox)
                    row.appendChild(cell);
                }

                this.grid.appendChild(row);
            }

        }


        _.prototype.play = function () {
            var seed = this.checkoboxes.map((row, y) => {
                return row.map((checkobox, x)=>{
                    return checkobox.checked;
                })
            });

            this.game = new Life(seed);
            this.started = true;
        };


        _.prototype.next = function () {
            !this.started && this.play();

            this.game.next();

            this.checkoboxes.forEach( (row, y) => {
                row.forEach((checkobox, x)=>{
                    checkobox.checked = this.game.board[y][x];
                });
            });

            if(this.autoplayButton.checked) {
                this.timeout = setTimeout(()=>{
                    this.next();
                },300);
            }
        };

    })();

    new LifeView( document.getElementById('grid'), 25, 'autoplay', 'next' );

})();

