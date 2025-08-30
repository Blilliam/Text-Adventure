// Select the HTML element where lore text will be displayed
const text = document.querySelector("#textContainer")
const MAP = document.querySelector("#mapContainer")

// Player object with stats and position
const player = {
    weapons: "none",
    aurmor: "none",
    consumable: "none",
    x: 5,   // player starting X position
    y: 0,   // player starting Y position
    hp: 10, // player health
    atk: 1  // player attack power
}

// Grab the input box for player commands
const input = document.querySelector("#text-controls")

// Listen for keypress events inside the input box
input.addEventListener("keypress", function(e) {
    if (e.key == "Enter") {  // Only check when Enter is pressed
        // Movement commands
        if (input.value == "w") {
            move(0, -1) // up
        }
        if (input.value == "a") {
            move(-1, 0) // left
        }
        if (input.value == "s") {
            move(0, 1) // down
        }
        if (input.value == "d") {
            move(1, 0) // right
        }

        // Lore + items in current location
        if (input.value == "l") {
            displayLore(getLocation().description)
            displayLore("The following items are on the ground " + listItem())
        }

        // Pick up items
        if (input.value == "j") {
            pickUp(getLocation().item)
        }

        // Clear the input box after each command
        input.value = ""
    }
})

// Build a 10x10 map of rooms
const map = []
for (let row = 0;row < 10; row++) {
    map.push([])
    for (let collom = 0;collom < 10; collom++){
        map[row].push(room()) // create empty room
    }
}

// Function to list all items in the current room
function listItem() {
    let list = ""
    if (getLocation().item.length > 1) {
        // Multiple items -> list them separated by commas
        for (let count = 0;count < getLocation().item.length - 1; count++) {
            list+= getLocation().item[count].name + ", " 
        }
        // Add "and" before the last item
        list += "and " + getLocation().item[getLocation().item.length - 1].name
    } else {
       // Only one item
       list = getLocation().item[0].name
    }
    return list
}

// Picking up items (currently empty)
function pickUp(item) {

}

// Function that defines a room's default structure
function room() {
    return {
        enemies: [],
        item: [],
        name: " ~ ",          // default symbol
        description: "x",     // basic description
    }
}

let oldRoom = ""
let newRoom = ""

// Return the room object at the player’s location
function getLocation() {
    return map[player.y][player.x]
}

// Function to move the player
function move(dx, dy) {
    if (xycheck(dx, dy)) { // check if movement is valid
        oldRoom = getLocation()
        player.x += dx
        player.y += dy
        newRoom = getLocation()

        // If room names are the same, say "looks different"
        if (oldRoom.name == newRoom.name) {
            document.getElementById('textContainer').textContent = '';
            displayLore("You are in a " + getLocation().name + "... <br>but it looks a little different")
            consGenerateMap()
            htmlGenerateMap()
            console.log(consMapStr) 
            document.getElementById('mapContainer').textContent = '';
            displayMap(htmlMapStr) 
        }
        else {
            document.getElementById('textContainer').textContent = '';
            displayLore("You are in a " + getLocation().name)
            consGenerateMap()
            htmlGenerateMap()
            console.log(consMapStr)  
            document.getElementById('mapContainer').textContent = '';
            displayMap(htmlMapStr) 
        }
    } else {
        // Invalid move
        displayLore("You cannot move in that direction")
    }
}

// Create hallways connecting rooms
function hall(name, map, x, y) {
    map[x][y].name = name
    map[x + 1][y].name = "Hall"
    map[x - 1][y].name = "Hall"
    map[x][y + 1].name = "Hall"
    map[x][y - 1].name = "Hall"
}

// Example ASCII map layout (reference only)
/*  
   0    1    2    3    4    5    6    7    8    9    
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

// Define special rooms
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

// Items in the Introduction Room
map[1][5].item.push({type: "Weapon", name: "Stone Sword", atk: 1})
map[1][5].item.push({type: "Aurmor", name: "Iron Aurmor", hp: 5})

// Enemy in the Introduction Room
map[1][5].enemies.push({name: "Goblin", atk: 1, hp: 5})

// Display the map in the console

let consMapStr = ""

function consGenerateMap() {
    console.clear()
    consMapStr = ""
    let numRowStr = "    "
    for (let i = 0; i < map.length; i++) {
        numRowStr += i + "    "
    }
    consMapStr += numRowStr

    for (let i = 0; i < map.length; i++) {
        let rowStr = "\n" + i + "  "
        for (let j = 0; j < map[i].length; j++){
            // If player is here, display "PLR"
            if (player.x == j && player.y == i) {
                rowStr += "PLR"
            }
            else {
                // Show first 3 letters of the room name
                rowStr += map[i][j].name.substring(0, 3)
            }
            rowStr += "  "
        }
        consMapStr += rowStr
    }
}

let htmlMapStr = ""

function htmlGenerateMap() {
    htmlMapStr = ""
    let numRowStr = "    "
    for (let i = 0; i < map.length; i++) {
        numRowStr += i + "    "
    }
    htmlMapStr += numRowStr

    for (let i = 0; i < map.length; i++) {
        let rowStr = "<br>" + i + "  "
        for (let j = 0; j < map[i].length; j++){
            // If player is here, display "PLR"
            if (player.x == j && player.y == i) {
                rowStr += "PLR"
            }
            else {
                // Show first 3 letters of the room name
                rowStr += map[i][j].name.substring(0, 3)
            }
            rowStr += "  "
        }
        htmlMapStr += rowStr
    }
}
// Display the initial map at game start
consGenerateMap()
htmlGenerateMap()
console.log(consMapStr)  
displayMap(htmlMapStr) 

// Checks if the move is valid (not out of bounds or into empty room)
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

// Add lore text to the text container in the DOM
function displayLore(displayStr) {
    let textElement = document.createElement("div")
    textElement.id = "lore"
    textElement.innerHTML = displayStr
    text.appendChild(textElement)
}

function displayMap(displayStr) {
    let MAPElement = document.createElement("div")
    MAPElement.id = "map"
    MAPElement.innerHTML = displayStr
    MAP.appendChild(MAPElement)
}
