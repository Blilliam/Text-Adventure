const player = {
    inv: [],
    x: 5,
    y: 0,
    hp: 10,
    atk: 1
}
const input = document.querySelector("#text-controls")
input.addEventListener("keypress", function(e) {
    console.log(e)
    if (e.key == "Enter"){
        console.log(input.value)
        console.log(xycheck(0, 1))
        console.log(xycheck(0, 0))
        console.log(xycheck(0, -1))
        console.log(xycheck(0, 10))
        if (e.key == "w") {
            if (xycheck(0, 1)) {
                player.y += 1
            }
        }
        if (e.key == "a") {
            if (xycheck(-1, 0)) {
                player.x--
            }
        }
        if (e.key == "s") {
            if (xycheck(0, -1)) {
                player.y--
            }
        }
        if (e.key == "d") {
            if (xycheck(1, 0)) {
                player.x++
            }
        }
        console.log(player.x, player.y)
        input.value = ""
    }
})
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
            name: "empty"
            }
}

map[5][5].name = 'Shop'
console.log(map)

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
