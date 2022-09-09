
window.onload = main;

const start_y = 100;
const start_x = 100;

const margin = 2;
const size = 200;
const empty_color = '#cfcfcf';

const r_start = 200;
const g_start = 180;
const b_start = 150;

function getEmptyArray (x, y) {
    const res = new Array(y);
    for (const i of res.keys()) {
        res[i] = new Array(x);
        for (const j of res[i].keys()) {
            res[i][j] = null;
        }
    }
    return res;
}

function calcColor (n) {
    const l = Math.log2(n);
    const r = r_start;
    const g = Math.floor(g_start / Math.max(1, 0.3 * l));
    const b = Math.floor(b_start / l);

    return '#' + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');
}

function getId (x, y) {
    return '(' + x + ',' + y + ')';
}

function getHTMLTile (x, y, n) {
    let div = document.getElementById(getId(x, y));
    if (div === null) {
        div = document.createElement('div');
        div.id = getId(x, y);
        div.style.position = 'absolute';
        div.className = 'tile';
        div.style.height = getPx(size);
        div.style.width = getPx(size);
    }
    div.style.top = getPx(y);
    div.style.left = getPx(x);
    

    const ps = div.getElementsByTagName('p');
    let p;
    if (ps.length === 0) {
        p = document.createElement('p');
        div.appendChild(p);
    } else {
        p = ps[0];
    }

    p.style.fontSize = '40pt';
    p.style.textAlign = 'center';
    p.style.position = 'relative';
    p.style.fontFamily = 'sans-serif';
    p.style.top = '6%';

    if (n === null) {
        div.style.backgroundColor = empty_color;
        p.innerHTML = '';
    } else {
        div.style.backgroundColor = calcColor(n);
        p.innerHTML = '' + n;
    }

    return div;
}

function clearTiles () {
    const divs = document.getElementsByClassName('tile');
    for (var i = (divs.length - 1) ; i >= 0; i--) {
        divs[i].remove();
    }
}

function getPx (n) {
    return n + 'px';
}

function renderTiles (array) {
    for (const y in array) {
        for (const x in array[y]) {
            const x_ = start_x + x * (margin + size);
            const y_ = start_y + y * (margin + size);

            const d = getHTMLTile(x_, y_, array[y][x]);
            document.body.insertBefore(d, null);
        }
    }
}

function getRandomInt (max) {
    return Math.floor(Math.random() * max);
}

function insertInRandom (tiles) {
    const free = getFreeSpace(tiles);
    let pos = getRandomInt(free);
    const value = getRandomInt(4);

    for (const y in tiles) {
        for (const x in tiles[y]) {
            if (tiles[y][x] === null && (pos--) == 0) {
                tiles[y][x] = value === 3 ? 4 : 2;
                break;
            }
        }
    }
}

function leftTurn (tiles) {
    for (const i of tiles.keys()) {
        tiles[i] = leftTurnLine(tiles[i]);
    }
}

function rightTurn (tiles) {
    for (const i of tiles.keys()) {
        tiles[i] = rightTurnLine(tiles[i]);
    }
}

function upTurn (tiles) {
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

function downTurn (tiles) {
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
function leftTurnLine (line) {
    let res = [];
    for (const i of line.keys()) {
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
function rightTurnLine (line) {
    let res = [];
    for (const i of line.keys()) {
        if (line[i] === null) {
            continue;
        }
        res.push(line[i]);
    }
    res = merge(res);
    const r = [];
    while (r.length + res.length != line.length) {
        r.push(null);
    }

    for (const e of res) {
        r.push(e);
    }

    return r;
}

function merge (line) {
    const r = [];
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

function getFreeSpace (tiles) {
    let cnt = 0;
    for (const y in tiles) {
        for (const x in tiles[y]) {
            if (tiles[y][x] === null) {
                cnt++;
            }
        }
    }
    return cnt;
}

function getFieldSize () {
    const str = prompt('Insert field size (like "4 4")', '4 4');
    const [x, y] = str.split(' ');
    return {
        x: Number(x),
        y: Number(y)
    };
}

function getTotal(tiles) {
    let total = 0;
    for (const y in tiles) {
        for (const x in tiles[y]) {
            if (tiles[y][x] !== null) {
                total += tiles[y][x];
            }
        }
    }
    return total;
}

function getMaxTotal(total_score, max_total) {
    if (total_score > max_total) return total_score;
    return max_total;
}

function setTotal(total) {
    const total_h1 = document.getElementById('total_score_title');
    total_h1.innerHTML = 'Total score: ' + total;
}

function setMaxTotal(max_total) {
    const total_h1 = document.getElementById('max_total_title');
    total_h1.innerHTML = 'Max total score: ' + max_total;
}

function main () {
    let sz = getFieldSize();

    let tiles = getEmptyArray(sz.x, sz.y);

    const allowed_keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'm'];
    
    let total_score = 0;
    let max_total = 0;

    renderTiles(tiles);

    document.addEventListener('keydown', function (event) {
        if (allowed_keys.includes(event.key)) {
            if (event.key === 'ArrowUp') {
                upTurn(tiles);
            } else if (event.key === 'ArrowDown') {
                downTurn(tiles);
            } else if (event.key === 'ArrowLeft') {
                leftTurn(tiles);
            } else if (event.key === 'ArrowRight') {
                rightTurn(tiles);
            }

            if (getFreeSpace(tiles) === 0) {
                clearTiles();
                alert('You lost');
                sz = getFieldSize();
                console.log(sz);
                tiles = getEmptyArray(sz.x, sz.y);
            }

            insertInRandom(tiles);
            renderTiles(tiles);
            total_score = getTotal(tiles);
            setTotal(total_score);
            max_total = getMaxTotal(total_score, max_total);
            setMaxTotal(max_total);
        }
    });
}
