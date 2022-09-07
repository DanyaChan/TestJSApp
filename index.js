
window.onload = main;

const start_y = 100;
const start_x = 100;

const margin = 2;
const size = 200;
const color = '#a38e8e';
const empty_color = '#cfcfcf';

const r_start = 200;
const g_start = 180;
const b_start = 150;


function calcColor(n) {
    const l = Math.log2(n);
    const r = r_start;
    const g = Math.floor(g_start / Math.max(1, 0.3 * l));
    const b = Math.floor(b_start / l);

    return '#' + r.toString(16) + g.toString(16) + b.toString(16);
}


function getHTMLTile(x, y, n) {
    var div = document.createElement('div');
    div.style.top = getPx(y);
    div.style.left = getPx(x);
    div.style.height = getPx(size);
    div.style.width = getPx(size);
    div.style.position = 'absolute';

    var p = document.createElement('p');

    p.style.fontSize = '40pt'
    p.style.textAlign = 'center'  
    p.style.position = 'relative';
    p.style.fontFamily = 'sans-serif'
    p.style.top = '6%';


    if (n === null) {
        div.style.backgroundColor = empty_color;
    } else {
        div.style.backgroundColor = calcColor(n);
        p.innerHTML = '' + n;
        div.appendChild(p);
    }

    

    return div;
}

function getPx(n) {
    return n + 'px';
}

function renderTiles(array) {
    for (let y in array) {
        for (let x in array[y]) {

            const x_ = start_x + x * (margin + size);
            const y_ = start_y + y * (margin + size);

            let d = getHTMLTile(x_, y_, array[y][x]);
            document.body.insertBefore(d, null);
        }
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}


function insertInRandom(tiles) {
    const free = getFreeSpace(tiles);
    let pos = getRandomInt(free);
    let value = getRandomInt(4);

    for (let y in tiles) {
        for (let x in tiles[y]) {
            if (tiles[y][x] === null && (pos--) == 0) {
                tiles[y][x] = value === 3 ? 4 : 2;
                break;
            }
        }
    }
}

function leftTurn(tiles) {
    for (let i of tiles.keys()) {
        tiles[i] = leftTurnLine(tiles[i]);
    }
}


function rightTurn(tiles) {
    for (let i of tiles.keys()) {
        tiles[i] = rightTurnLine(tiles[i]);
    }
}

function upTurn(tiles) {
    const ysize = tiles.length;
    const xsize = tiles[0].length;

    for (let x = 0; x < xsize; x++) {
        let new_line = [];
        for (let y = 0; y < ysize; y++) {
            new_line.push(tiles[y][x]);
        }

        new_line = leftTurnLine(new_line);

        for (let y = 0; y < ysize; y++) {
            tiles[y][x] = new_line[y];
        }
    }
}

function downTurn(tiles) {
    const ysize = tiles.length;
    const xsize = tiles[0].length;

    for (let x = 0; x < xsize; x++) {
        let new_line = [];
        for (let y = 0; y < ysize; y++) {
            new_line.push(tiles[y][x]);
        }

        new_line = rightTurnLine(new_line);

        for (let y = 0; y < ysize; y++) {
            tiles[y][x] = new_line[y];
        }
    }
}

/**
 * Not my proudest moment but it was more testing js in browser than actually writing alghorithm
 * @param {Array} line 
 */
function leftTurnLine(line) {
    let res = [];
    for (let i of line.keys()) {
        if (line[i] === null) {
            continue;
        }
        res.push(line[i]);
    }
    res = merge(res);

    while (res.length != line.length) {
        res.push(null);
    }
    return res;
}

/**
 * 
 * @param {Array} line 
 */
function rightTurnLine(line) {
    let res = [];
    for (let i of line.keys()) {
        if (line[i] === null) {
            continue;
        }
        res.push(line[i]);
    }
    res = merge(res);
    let r = [];
    while (r.length + res.length != line.length) {
        r.push(null);
    }

    for (let e of res) {
        r.push(e);
    }

    return r;
}


function merge(line) {
    let r = [];
    for (let i = 0; i < line.length; i++) {

        if (i == line.length - 1) {
            r.push(line[i]);
            break;
        }

        if (line[i] == line[i + 1]) {
            r.push(2 * line[i]);
            i++;
        } else {
            r.push(line[i]);
        }
    }
    return r;
}


function getFreeSpace(tiles) {
    let cnt = 0;
    for (let y in tiles) {
        for (let x in tiles[y]) {
            if (tiles[y][x] === null) {
                cnt++;
            }
        }
    }
    return cnt;
}

function main() {

    let tiles = [
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
    ];

    const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'm'];

    renderTiles(tiles);

    document.addEventListener('keydown', function (event) {
        if (arrowKeys.includes(event.key)) {


            if (event.key === 'ArrowUp') {
                upTurn(tiles);

            }
            else if (event.key === 'ArrowDown') {
                downTurn(tiles);

            }
            else if (event.key === 'ArrowLeft') {
                leftTurn(tiles);

            }
            else if (event.key === 'ArrowRight') {
                rightTurn(tiles);

            }

            if (getFreeSpace(tiles) === 0) {
                alert('Is this loss');
                tiles = [
                    [null, null, null, null],
                    [null, null, null, null],
                    [null, null, null, null],
                    [null, null, null, null],
                ];
            }

            insertInRandom(tiles);
            renderTiles(tiles);
        }
    });
}

