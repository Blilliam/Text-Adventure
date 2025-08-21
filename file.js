const player = {
    inv: [],
    x: 5,
    y: 0,
    hp: 10,
    atk: 1
}
const input = document.querySelector("#text-controls")
input.addEventListener("keypress", function(e) {
    if (input.value == "w") {
        move(0, -1)
    }
    if (input.value == "a") {
        move(-1, 0)
    }
    if (input.value == "s") {
        move(0, 1)
    }
    if (input.value == "d") {
        move(1, 0)
    }
}
)
const map = []
for (let row = 0;row < 10; row++) {
    map.push([])

    for (let collom = 0;collom < 10; collom++){
        map[row].push(room())
    }
}

function room() {
    return {enemies: [],
            items: [],
            name: " ~ ",
            }
}

function move(dx, dy) {
    if (xycheck(dx, dy)) {
        player.x += dx
        player.y += dy
        input.value = ""
        displayMap()
    }
}

function hall(name, map, x, y) {
    map[x][y].name = name
    map[x + 1][y].name = "Hall"
    map[x - 1][y].name = "Hall"
    map[x][y + 1].name = "Hall"
    map[x][y - 1].name = "Hall"
}


hall('Weapon Shop', map, 5 ,5)
hall('Item Shop', map, 1, 1)
hall('Field', map, 7, 8)
hall('Aurmor Shop', map, 2, 7)
hall('Lodge', map, 8, 1)
hall('Old House', map, 4, 2)
hall('Forge', map, 1, 4)
hall('Cave', map, 8, 4)

function displayMap() {
    let colStr = "    "
    for (let i = 0; i < map.length; i++) {
        colStr += i + "    "
    }
    console.log(colStr)

    for (let i = 0; i < map.length; i++) {
        let rowStr = i + "  "
        for (let j = 0; j < map[i].length; j++){
            if (player.x == j && player.y == i) {
                rowStr += "PLR"
            }
            else {
                rowStr += map[i][j].name.substring(0, 3)
            }
            rowStr += "  "
        }
        console.log(rowStr)
    }
}

displayMap()    

function xycheck(dx, dy) {
    let x = player.x + dx
    let y = player.y + dy
    if (x < 0 || x > 9 ) {
        return false
    }
    if (y < 0 || y > 9 ) {
        return false
    }
    
    return true
}
