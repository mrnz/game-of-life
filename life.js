(function(){
    "use strict";

    class Life {
        constructor(seed) {
            this.seed = seed;
            this.height = seed.length;
            this.width = seed[0].length;

            this.prevBoard = [];
            this.activeElems = {};

            this.board = this.cloneArray2D(seed);
        }

        cloneArray2D(array){
             return array.map(row=>row.map(elem=>elem))
        }

        next() {
            var totalAlive = 0;
            this.prevBoard = this.cloneArray2D(this.board);
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
                    totalAlive += this.board[y][x];
                });
            });
            return totalAlive;
        }

        toString() {
            return this.board.map(row=>row.join(' ')).join('\n');
        }

        aliveNeighbors(array ,x, y) {

            var prevRow = array[y-1] || [],
                nextRow = array[y+1] || [];

            return [
                prevRow[x-1],prevRow[x],prevRow[x+1],
                array[y][x-1],array[y][x+1],
                nextRow[x-1],nextRow[x],nextRow[x+1],
            ].reduce( (prev, curr) => prev + +!!curr, 0 );
        }
    }

    class LifeView {
        constructor(table, size, autoplayID, nextID, speedID, generations, alive) {
            this.grid = table;
            this.size = size;
            this.game = null;
            this.started = false;
            this.isPlaying = false;
            this.speed = 1000;
            this.generation = 0;

            this.autoplayButton = document.getElementById(autoplayID);
            this.nextButton = document.getElementById(nextID);
            this.speedSelect = document.getElementById(speedID);
            this.generationsCounter = document.getElementById(generations);
            this.aliveCounter = document.getElementById(alive);

            this.aliveCounter.innerText = '0';
            this.generationsCounter.innerText = '0';

            this.createGrid();

            this.setLabel = (label) => this.nextButton.setAttribute('class', label);

            this.autoplayButton.addEventListener('change', evt => {
                evt.target.checked === true ? this.setLabel('play') : this.setLabel('next');
                this.clearTimeout();
            });

            this.nextButton.addEventListener('click', () => {

                if( this.autoplayButton.checked){
                    this.isPlaying ? this.setLabel('play') : this.setLabel('stop');
                }

                this.isPlaying && this.autoplayButton.checked ? this.clearTimeout() : this.next();

            });

            this.speedSelect.addEventListener('change', evt => {
                this.speed = parseInt(evt.target.value);
                if(this.autoplayButton.checked && this.isPlaying){
                    this.clearTimeout();
                    this.next();
                }
            });

            this.grid.addEventListener('change', evt => {
                this.started = false;
                this.autoplayButton.checked === true ? this.setLabel('play') : this.setLabel('next');
                this.clearTimeout();
                this.generation = 0;
                this.generationsCounter.innerText = this.generation;
            });

            this.grid.addEventListener('keyup', evt => {

                var checkbox = evt.target,
                    y = evt.target.coords[0],
                    x = evt.target.coords[1];

                switch (evt.keyCode) {
                    case 13:
                        this.next();
                        break;
                    case 37:
                        x > 0 && this.checkoboxes[y][x-1].focus();
                        break;
                    case 38:
                        y > 0 && this.checkoboxes[y-1][x].focus();
                        break;
                    case 39:
                        x < this.size-1 && this.checkoboxes[y][x+1].focus();
                        break;
                    case 40:
                        y < this.size-1 && this.checkoboxes[y+1][x].focus();
                        break;
                    default:

                }

            });

        }

        clearTimeout() {
            if(this.timeout){
                clearTimeout(this.timeout);
                this.isPlaying = false;
            }
        }

        createGrid() {
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

        play() {
            var seed = this.checkoboxes.map((row, y) => {
                return row.map((checkobox, x)=>{
                    return checkobox.checked;
                })
            });

            this.game = new Life(seed);
            this.started = true;
        }

        next() {
            var totalAlive;

            !this.started && this.play();

            totalAlive = this.game.next();
            this.generation++;

            this.aliveCounter.innerText = totalAlive;
            this.generationsCounter.innerText = this.generation;

            this.checkoboxes.forEach( (row, y) => {
                row.forEach((checkobox, x)=>{
                    checkobox.checked = this.game.board[y][x];
                });
            });

            if(totalAlive === 0){

                if(this.autoplayButton.checked){
                    this.isPlaying = false;
                    this.setLabel('play');
                }

            }else if(this.autoplayButton.checked) {
                this.isPlaying = true;
                this.timeout = setTimeout(()=>{
                    this.next();
                },this.speed);
            }
        }
    }

    new LifeView( document.getElementById('grid'), 20, 'autoplay', 'next', 'speed', 'generations', 'alive' );

})();
