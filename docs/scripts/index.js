import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs";
kaboom({ global: true, debug: true, background: [255, 255, 255] })
let url = "https://airman-dotcom.github.io/web-packet-tracer/assets/"
loadRoot(url);
let name_index = {
    ethernetpc: "EthernetPC",
    wirelesspc: "WirelessPC",
    server: "Server",
    router: "Router",
    switch: "Switch",
    ethernetlaptop: "EthernetLaptop",
    wirelesslaptop: "WirelessLaptop",
    smartphone: "Smartphone",
    accesspoint: "AccessPoint",
    tablet: "Tablet",
    printer: "Printer",
    phone: "Phone",
    ipphone: "IPphone",
    tv: "TV",
    bridge: "Bridge",
    hub: "Hub",
    cablemodem: "CableModem",
    dslmodem: "DSLmodem",
    wirelesslancontroller: "WLC",
    homerouter: "HomeRouter",
    celltower: "CellTower"
}
Object.keys(name_index).forEach(element => {
    eval(`loadSprite("${name_index[element]}", "${element}.png")`)
})
/*onDraw(() => {
drawRect({

    width: 120,
    height: 240,
    pos: vec2(20, 20),
    color: YELLOW,
    outline: { color: BLACK, width: 4 },
})
})*/

let port_index = {
    EthernetPC: ["FastEthernet0", "RS 232", "USB0", "USB1"],
    WirelessPC: ["RS 232", "USB0", "USB1"],
    Server: ["FastEthernet0"],
    Router: ["Console", "FastEthernet0/0", "FastEthernet1/0", "Serial2/0", "Serial3/1", "FiberOptic4/0"],
    Switch: ["Console", "FastEthernet0/1", "FastEthernet1/1", "FastEthernet2/1", "FastEthernet3/1", "FiberOptic4/1", "FiberOptic5/1"],
    EthernetLaptop: ["RS 232", "FastEthernet0", "USB0", "USB1"],
    WirelessLaptop: ["RS 232", "USB0", "USB1"],
    SmartPhone: [],
    AccessPoint: ["Ethernet0"],
    Tablet: [],
    Printer: ['FastEthernet0'],
    Phone: ["Phone0"],
    IPphone: ["FastEthernet-Switch", "FastEthernet-PC"],
    TV: ["Coaxial0"],
    Bridge: ["Ethernet0/1", "Ethernet1/1"],
    Hub: ["FastEthernet0", "FastEthernet1", "FastEthernet2", "FastEthernet3", "FastEthernet4", "FastEthernet5"],
    CableModem: ["Coaxial", "Ethernet"],
    DSLmodem: ["Phone", "Ethernet"],
    WLC: ["GigabitEthernet1", "GigabitEthernet2", "GigabitEthernet3", "GigabitEthernet4"],
    HomeRouter: ["GigabitEthernet-Internet", "GigabitEthernet1", "GigabitEthernet2", "GigabitEthernet3", "GigabitEthernet4"],
    CellTower: ["Coaxial0"]
}
let names = [];
for (let x = 0; x < Object.keys(name_index).length; x++) {
    names.push([]);
}
let netdiv = document.getElementById("network");
let enddiv = document.getElementById("end");
let condiv = document.getElementById("connections");
let select = document.querySelector("select");
let objects = [];
let connections_clicked = [false, null];
let hovering_over_tile = false;
let tile_follow = [false, null, null];
let network_devices = ["accesspoint", "router", "switch", "bridge", "hub", "cablemodem", "dslmodem", "wirelesslancontroller", "homerouter", "celltower"];
let end_devices = ["ethernetpc", "wirelesspc", "server", "ethernetlaptop", "wirelesslaptop", "smartphone", "tablet", "printer", "phone", "ipphone", "tv"]
let connections = ["console", "straight-through", "cross-over", "fiberoptic", "phonecable", "coaxial", "serial", "octal", "usb"];
network_devices.forEach(element => {
    let img = document.createElement("img");
    img.src = `${url + element}.png`;
    img.width = 50;
    img.id = element;
    img.title = element;
    netdiv.appendChild(img)
})

end_devices.forEach(element => {
    let img = document.createElement("img");
    img.src = `${url + element}.png`;
    img.width = 50;
    img.id = element;
    img.title = element;
    enddiv.appendChild(img)
})

connections.forEach(element => {
    let img = document.createElement("img");
    img.src = `${url + element}.png`;
    img.title = element;
    img.id = element;
    img.width = 50;
    condiv.appendChild(img)
})

function clickEvent(e) {
    let another = document.querySelector("img[src='https://airman-dotcom.github.io/web-packet-tracer/assets/using.png']")

    let thing = document.getElementById(e.target.id);
    if (another != null && another != thing) {
        another.src = `https://airman-dotcom.github.io/web-packet-tracer/assets/${another.id}.png`;
        if (connections.includes(another.id)) connections_clicked = [false, null];
    }
    if (!thing.src.includes("using.png")) {
        if (connections.includes(thing.id)) connections_clicked[1] = thing.id;
        thing.src = url + "using.png";
        follow = thing.id;
    } else {
        thing.src = url + `${thing.id}.png`;
        connections_clicked = [false, null];
        follow = undefined;
    }
}

document.querySelectorAll("div img").forEach(element => {
    element.addEventListener("click", clickEvent)
})

select.addEventListener("change", (e) => {
    if (select.value == "Network Devices") {
        netdiv.style.display = "flex";
        condiv.style.display = "none";
        enddiv.style.display = "none";
    } else if (select.value == "End Devices") {
        enddiv.style.display = "flex";
        condiv.style.display = "none";
        netdiv.style.display = "none";
    } else if (select.value == "Connections") {
        condiv.style.display = "flex";
        netdiv.style.display = "none";
        enddiv.style.display = "none";
    } else {
        condiv.style.display = "none";
        netdiv.style.display = "none";
        enddiv.style.display = "none";
    }
})

let follow, follow_s;
function create_node(name, type) {
    let x = add([
        sprite(type),
        pos(mousePos().x, mousePos().y),
        "tile",
        area(),
        scale(0.5),
        name,
        
    ])
    objects.push({ name: name, otype: "tile", ttype: type, ports: port_index.type, object: x})
    add([
        text(name, { size: 15, font: "apl386" }),
        color(0, 0, 0),
        pos(mousePos().x + 5, mousePos().y + 50),
        area(),
        "name",
        name,
    ])
}

onMousePress(() => {
    let name = "";
    let another = document.querySelector("img[src='https://airman-doctom.github.io/web-/assets/using.png']")
    if (another && Object.keys(name_index).indexOf(follow) != -1) {
        if (names[Object.keys(name_index).indexOf(follow)].length == 0) {
            name = name_index[follow] + "-0";
        } else {
            name = name_index[follow] + "-" + names[Object.keys(name_index).indexOf(follow)].length;
        }
        names[Object.keys(name_index).indexOf(follow)].push(name);
        console.log(names)
        create_node(name, name_index[follow])
        another.src = url + `${another.id}.png`;
        return;
    }
})

onUpdate("tile", (t) => {
    if (tile_follow[0]) {
        tile_follow[1].use(pos(mousePos().x, mousePos().y))
    }
})

onUpdate("name", (n) => {
    if (tile_follow[0]) {
        tile_follow[2].use(pos(mousePos().x + 5, mousePos().y + 50),)
    }
})

onUpdate(() => {
    if (connections_clicked[0]) {
        let ports;
        let t = connections_clicked[2];
        for(let x = 0; x<objects.length;x++){
            if (x.object == t){
                ports = x.ports
            }
        }
        console.log(ports)
        /*drawRect({

            width: 120,
            height: 180,
            pos: vec2(t.pos.x, t.pos.y),
            color: WHITE,
            outline: { color: BLACK, width: 4 }
        })*/
        
        add([
            pos(t.pos.x, t.pos.y),
            rect(120, 180),
            outline(4),
            area(),
            "conn",
        ])
        let a = t.pos.y;
        ports.forEach(e => {
            add([
                text("", {font: "apl386", size:20, width: 120}),
                pos(t.pos.x, a),
                color(0,0,0),
                area(),
                z(5),
                "connection"
            ])
            a += 20;
        })
        /*drawText({
            text: "oh hi",
            size: 20,
            font: "apl386",
            width: 120,
            pos: vec2(t.pos.x, t.pos.y),
            color: rgb(0, 0, 0),
            
        })*/
    }
})

onMousePress("connection", (con) => {
    console.log(con.text)
})


onClick("tile", (t) => {
    if (connections_clicked[1] != null) {
        connections_clicked[0] = true;
        connections_clicked[2] = t;
    } else {
        tile_follow[0] = true
        tile_follow[1] = t;
        let thi;
        let ts = get("tile");
        let ns = get("name")
        for (let x = 0; x < ts.length; x++) {
            if (ts[x] == t) {
                thi = ns[x]
                break;
            }
        }
        tile_follow[2] = thi;
    }
})


onMouseRelease(() => {
    tile_follow = [false, null, null]
})

onHover("tile", (t) => {
    t.use(cursor("pointer"))
    hovering_over_tile = true;
})

