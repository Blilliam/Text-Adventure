// Select the HTML element where lore text will be displayed
const text = document.querySelector("#textContainer")
const MAP = document.querySelector("#mapContainer")
// Player object with stats and position
const player = {
    inventory: [],
    x: 5,   // player starting X position    
    y: 0,   // player starting Y position
    hp: 10, // player health
    atk: 1  // player attack power
}

function isNumeric(str) {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

// Build a 10x10 map of rooms
const map = []
for (let row = 0;row < 10; row++) {
    map.push([])
    for (let collom = 0;collom < 10; collom++){
        map[row].push(room()) // create empty room
    }
}

// Function that defines a room's default structure
function room() {
    return {
        enemies: [],
        items: [],
        name: " ~ ",          // default symbol
        description: "x",     // basic description
        found: false,
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

// Weapons (10 total)
map[0][1].items.push({ type: "Weapon", name: "Iron Sword", atk: 3 })
map[1][0].items.push({ type: "Weapon", name: "Steel Dagger", atk: 2 })
map[1][5].items.push({ type: "Weapon", name: "Stone Sword", atk: 1 })  // intro room
map[2][3].items.push({ type: "Weapon", name: "Fire Staff", atk: 5 })
map[3][6].items.push({ type: "Weapon", name: "Shadow Katana", atk: 6 })
map[4][2].items.push({ type: "Weapon", name: "Bone Club", atk: 3 })
map[5][5].items.push({ type: "Weapon", name: "War Hammer", atk: 7 })
map[6][8].items.push({ type: "Weapon", name: "Holy Lance", atk: 4 })
map[8][0].items.push({ type: "Weapon", name: "Thunder Sword", atk: 6 })
map[9][4].items.push({ type: "Weapon", name: "Venom Whip", atk: 5 })

// Armors (10 total)
map[1][5].items.push({ type: "Aurmor", name: "Iron Aurmor", hp: 5 })  // intro room
map[2][5].items.push({ type: "Aurmor", name: "Leather Aurmor", hp: 3 })
map[3][6].items.push({ type: "Aurmor", name: "Steel Aurmor", hp: 7 })
map[4][6].items.push({ type: "Aurmor", name: "Golden Aurmor", hp: 8 })
map[5][7].items.push({ type: "Aurmor", name: "Dragon Scale Aurmor", hp: 10 })
map[6][3].items.push({ type: "Aurmor", name: "Dark Aurmor", hp: 9 })
map[8][1].items.push({ type: "Aurmor", name: "Holy Aurmor", hp: 7 })
map[8][4].items.push({ type: "Aurmor", name: "Frost Aurmor", hp: 8 })
map[9][1].items.push({ type: "Aurmor", name: "Ancient Aurmor", hp: 9 })
map[9][9].items.push({ type: "Aurmor", name: "Phoenix Feather Aurmor", hp: 7 })

// Enemy in the Introduction Room
map[1][5].enemies.push({name: "Goblin", atk: 1, hp: 5})

// Grab the input box for player commands
const input = document.querySelector("#text-controls")

let mode = "normal"

// Listen for keypress events inside the input box
input.addEventListener("keypress", function(e) {
    if (e.key == "Enter") {  // Only check when Enter is pressed
        // Movement commands
        if (mode == "normal") {
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
                displayLore(listItem())
            }

            // Pick up items
            if (input.value == "j") {
                if (getLocation().items.length != 0) {
                    displayLore("What would you like to pick up? ")
                }

                displayLore(listItem())
                mode = "pickUp"
            }

            if (input.value == "k") {
                displayLore(listInventory())
            }
            
        } else if (mode == "pickUp") {
            pickUp()
            mode = "normal"
        }

        // Clear the input box after each command
        input.value = ""
    }
})

// function itemType(item) {
//     type = item.type
//     return type
// }

// Function to list all items in the current room
function listItem() {
    if (getLocation().items.length == 0) {
        return "There are no items around."
    }
    let list = "The following items are on the ground: "
    if (getLocation().items.length > 1) {
        // Multiple items -> list them separated by commas
        for (let count = 0;count < getLocation().items.length - 1; count++) {
            list+= (count+1) + " " + getLocation().items[count].name + ", " 
        }
        // Add "and" before the last item
        list += "and " + getLocation().items.length + " " + getLocation().items[getLocation().items.length - 1].name

    } else if (getLocation().items.length == 1) {
       // Only one item
       list += "1 "
       list += getLocation().items[0].name

    }
    return list

}

function listInventory() {
    if (player.inventory.length == 0) {
        return "There are no items in your inventory."
    }
    let list = "The following items are in your inventory: "
    if (player.inventory.length > 1) {
        // Multiple items -> list them separated by commas
        for (let count = 0;count < player.inventory.length - 1; count++) {
            list+= " " + player.inventory[count].name + ", " 
        }
        // Add "and" before the last item
        list += "and " + " " + player.inventory[player.inventory.length - 1].name

    } else if (player.inventory.length == 1) {
       // Only one item
       list += player.inventoryitems[0].name

    } 
    return list

}

// Picking up items
function pickUp() {
    displayLore(listItem())
    if (isNumeric(input.value) && !(input.value > getLocation().items.length)) {
        let index = parseInt(input.value) - 1
        let tempItem = getLocation().items[index]
        let itemType = tempItem.type
        let counter = 0

        let itemName = ""
        for (let i = 0;i < player.inventory.length; i++) {
            if (player.inventory[i].type == itemType && player.inventory[i].type != "Consumable") {
                itemName = getLocation().items[index].name

                let temp1 = getLocation().items[index]
                getLocation().items[index] = player.inventory[i]
                player.inventory[i] = temp1
                
                break

            } else {
                counter++
            }

        }

        if (counter == player.inventory.length) {  
            itemName = getLocation().items[index].name

            player.inventory.push(getLocation().items[index])
            getLocation().items.splice(index, 1)

        }
        if (itemName != "") {
            displayLore("You have picked up: " + itemName)
        }

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
        map[player.y][player.x].found = true
        player.x += dx
        player.y += dy
        newRoom = getLocation()

        // If room names are the same, say "looks different"
        if (oldRoom.name == newRoom.name) {
            moveDisplay("You are in a " + getLocation().name + "... <br>but it looks a little different")
        }
        else {
            moveDisplay("You are in a " + getLocation().name)
        }
    } else {
        // Invalid move
        map[player.y + dy][player.x + dx].found = true
        moveDisplay("You cannot move in that direction")
    }
}

function moveDisplay(roomDescription) {
    //document.getElementById('textContainer').textContent = '';
    displayLore(roomDescription)
    consGenerateMap()
    htmlGenerateMap()
    console.log(consMapStr)  
    document.getElementById('mapContainer').textContent = '';
    displayMap(htmlMapStr) 
}



// Display the map in the console

let consMapStr = ""

//console map display
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
                rowStr += " X "
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

//html map display
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
                rowStr += " X "
            }
            else {
                // Show first 3 letters of the room name
                if (map[i][j].found) {
                    rowStr += map[i][j].name.substring(0, 3)
                } else {
                    if (undiscovered(j, i)) {
                        rowStr += " ? "
                    } else {
                        rowStr += "   "
                    }
                }
            }
            rowStr += "  "
        }
        htmlMapStr += rowStr
    }
}

function undiscovered(j, i) {
    if (player.x + 1 == j && player.y == i && map[player.y][player.x + 1].found == false && map[player.y][player.x + 1].name != " ~ ") {
        return true
    } else if (player.x - 1 == j && player.y == i && map[player.y][player.x - 1].found == false && map[player.y][player.x - 1].name != " ~ ") {
        return true
    } else if (player.x == j && player.y + 1 == i && map[player.y + 1][player.x].found == false && map[player.y + 1][player.x].name != " ~ ") {
        return true
    } else if (player.x == j && player.y - 1 == i && map[player.y - 1][player.x ].found == false && map[player.y - 1][player.x].name != " ~ ") {
        return true
    } else {
        return false
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



