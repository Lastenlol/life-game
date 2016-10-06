var speed = 300;
var timer = null;
var running = false;
var cellSize = 22;
var width = Math.floor(window.innerWidth / cellSize);
var height = Math.floor((window.innerHeight - document.getElementsByTagName('header')[0].offsetHeight) / (cellSize));

var table = document.getElementById('field')

function createField() {
    var field = [];
    var fragment = document.createDocumentFragment();
    var tr, td;

    for (var i = 0; i < height; i++) {
        field[i] = [];
        tr = fragment.appendChild(document.createElement('tr'));

        for (var j = 0; j < width; j++) {
            field[i][j] = false;

            td = tr.appendChild(document.createElement('td'));
            td.className = 'death';
        }
    }

    table.appendChild(fragment);
    attachEventHandlers();

    return field;
}

function toggleLife() {
    if (timer) clearInterval(timer);

    running = !running;
    var text = running ? 'stop' : 'start';

    if (running) timer = setInterval(moveOfGod, speed);
    this.innerText = text;
    this.className = text;
}

function attachEventHandlers() {
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            (function () {
                var td = getCell(j, i);
                var x = j;
                var y = i;

                td.addEventListener("click", function () {
                    toggleState(x, y);
                })
            })()
        }
    }

    var btn = document.getElementById("godBtn")
    btn.addEventListener("click", toggleLife)
}

function getCell(x, y) {
    var tr = table.getElementsByTagName("tr")[y];
    var td = tr.getElementsByTagName("td")[x];

    return td;
}

var toggleState = function (x, y) {
    if (running) return;
    setState(x, y, !field[y][x]);
}

function setState(x, y, state) {
    if (x < width && y < height && x >= 0 && y >= 0) {
        var td = getCell(x, y);

        td.className = state ? 'alive' : 'death';
        field[y][x] = !!state;
    }
}

function countAliveNeighbors(x, y) {
    var state = 0;

    // ugly, but simple
    // todo: refactor conditions
    if (field[y - 1] === undefined) {
        state += field[height - 1][x];

        if (field[y][x - 1] === undefined) state += field[height - 1][width - 1];
        else state += field[height - 1][x - 1];

        if (field[y][x + 1] === undefined) state += field[height - 1][0];
        else state += field[height - 1][x + 1];
    }

    if (field[y + 1] === undefined) {
        state += field[0][x]

        if (field[y][x - 1] === undefined) state += field[0][width - 1]
        else state += field[0][x - 1]

        if (field[y][x + 1] === undefined) state += field[0][0];
        else state += field[0][x + 1];
    }

    if (field[y][x - 1] === undefined) {
        state += field[y][width - 1];

        if (field[y - 1] !== undefined) state += field[y - 1][width - 1];
        if (field[y + 1] !== undefined) state += field[y + 1][width - 1];
    }

    if (field[y][x + 1] == undefined) {
        state += field[y][0];

        if (field[y - 1] != undefined) state += field[y - 1][0];
        if (field[y + 1] != undefined) state += field[y + 1][0];
    }


    if (field[y - 1] != undefined) {
        state += field[y - 1][x];

        if (field[y][x - 1] != undefined) state += field[y - 1][x - 1];
        if (field[y][x + 1] != undefined) state += field[y - 1][x + 1];
    }

    if (field[y + 1] != undefined) {
        state += field[y + 1][x];

        if (field[y][x - 1] != undefined) state += field[y + 1][x - 1];
        if (field[y][x + 1] != undefined) state += field[y + 1][x + 1];
    }

    if (field[y][x - 1] != undefined) state += field[y][x - 1];
    if (field[y][x + 1] != undefined) state += field[y][x + 1];

    return state
}

function moveOfGod() {
    var nextGeneration = [];

    for (var i = 0; i < height; i++) {
        nextGeneration[i] = [];

        for (var j = 0; j < width; j++) {
            nextGeneration[i][j] = 0;
            aliveNeighbors = countAliveNeighbors(j, i);
            if (field[i][j] == 0 && aliveNeighbors == 3) {
                nextGeneration[i][j] = 1;
            } else if (field[i][j] == 1) {
                if (aliveNeighbors == 2 || aliveNeighbors == 3) nextGeneration[i][j] = 1;
                else nextGeneration[i][j] = 0;
            }
        }
    }

    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            setState(j, i, !!nextGeneration[i][j]);
        }
    }
}

var field = createField();

drawGlider();
