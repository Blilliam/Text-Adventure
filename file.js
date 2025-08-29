const text = document.querySelector("#textContainer")
const player = {
    weapons: "none",
    aurmor: "none",
    consumable: "none",
    x: 5,
    y: 0,
    hp: 10,
    atk: 1
}

const input = document.querySelector("#text-controls")
input.addEventListener("keypress", function(e) {
    if (e.key = "Enter") {
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
        if (input.value == "l") {
            displayLore(location().description)
            displayLore("The following items are on the ground " + listItem())
        }
        if (input.value == "j") {
            pickUp(location().item)
        }
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

function listItem() {
    let list = ""
    if (location().item.length > 1) {
        for (let count = 0;count < location().item.length - 1; count++) {
            list+= location().item[count].name + ", "
        }
         list += "and " + location().item[location().item.length - 1].name
    } else {
       list = location().item.name
    }
        
    return list
}

function pickUp(item) {

}

function room() {
    return {enemies: [],
            item: [],
            name: " ~ ",
            description: "x",
            }
}

let oldRoom = ""
let newRoom = ""

function location() {
    return map[player.y][player.x]
}

function move(dx, dy) {
    if (xycheck(dx, dy)) {
        oldRoom = location()
        player.x += dx
        player.y += dy
        newRoom = location()
        if (oldRoom.name == newRoom.name) {
            displayLore("You are in a " + location().name + "... but it looks a little different")
            displayMap()
        }
        else {
            displayLore("You are in a " + location().name)
            displayMap()
        }
        
    
    } else {
        displayLore("You cannot move in that direction")
    }
    
}

function hall(name, map, x, y) {
    map[x][y].name = name
    map[x + 1][y].name = "Hall"
    map[x - 1][y].name = "Hall"
    map[x][y + 1].name = "Hall"
    map[x][y - 1].name = "Hall"
}


/*  0    1    2    3    4    5    6    7    8    9    
 0   ~   Hal   ~    ~    ~   Hal   ~    ~    ~    ~   
 1  Hal  Ite  Hal  Hal  Hal  Int  Hal   ~    ~    ~   
 2   ~   Hal  Hal  For  Hal  Hal  Hal   ~    ~    ~   
 3   ~    ~   Hal  Hal   ~   Hal  Aur  Hal   ~    ~   
 4   ~   Hal  Old  Hal   ~   Hal  Hal   ~   Hal   ~   
 5   ~    ~   Hal  Hal  Hal  Wea  Hal  Hal  Fie  Hal  
 6   ~    ~   Hal  Ite  Hal  Hal   ~    ~   Hal   ~   
 7   ~   Hal   ~   Hal  Hal   ~    ~    ~    ~    ~   
 8  Hal  Lod  Hal  Hal  Cav  Hal   ~    ~    ~    ~   
 9   ~   Hal   ~    ~   Hal   ~    ~    ~    ~    ~ 
*/

hall('Weapon Shop', map, 5 ,5)
hall('Item Shop', map, 1, 1)
hall('Field', map, 5, 8)
hall('Aurmor Shop', map, 3, 6)
hall('Lodge', map, 8, 1)
hall('Old House', map, 4, 2)
hall('Forge', map, 2, 3)
hall('Cave', map, 8, 4)
hall('Item Shop', map, 6, 3)
hall("Introduction Room", map, 1, 5)

//items
map[1][5].item.push({type: "Weapon", name: "Stone Sword", atk: 1})
map[1][5].item.push({type: "Aurmor", name: "Iron Aurmor", hp: 5})

//enimeies
map[1][5].enemies.push({name: "Goblin", atk: 1, hp: 5})



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
    console.log("\n\n")
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
    if (map[y][x].name == " ~ ") {
            return false
    }
    
    return true
}

function displayLore(displayStr) {
    let textElement = document.createElement("div")
    textElement.id = "lore"
    textElement.innerHTML = displayStr
    text.appendChild(textElement)
}
