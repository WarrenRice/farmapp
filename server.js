const express = require('express');
const Datastore = require('nedb');
const mqtt = require('mqtt');
require('dotenv').config();

const app = express();
app.use(express.static('client'));
app.use(express.json({ limit: '10mb'}));

const database = new Datastore('database.db');
database.loadDatabase();

let client = mqtt.connect('mqtt://broker.hivemq.com');
let clientB = mqtt.connect('mqtt://broker.hivemq.com');
 
let parameters = {};
let tp = "";
let st = "";

client.on('connect', ()=> {
    client.subscribe('Sensors');
    console.log("Client has sub successfully");
});

clientB.on('connect', ()=> {
    clientB.subscribe('DeviceStatus');
    console.log("ClientB has sub successfully");
});

client.on('message', (topic,message) => {
    parameters = JSON.parse(message.toString())
    tp = topic;
    console.log("Arrive From:"+topic);
    console.log(parameters);
});

function saveData() {
    if (tp == "Sensors") {
        const timestamp = Date.now();
        parameters.timestamp = timestamp;
        database.insert(parameters);
    }
}

setInterval(saveData,600000)

clientB.on('message', (topic,message) => {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
    console.log("Arrive From:"+topic);
    console.log(message.toString());
    st = message.toString();
});

app.get('/api', (req, res) => {
    database.find({}, {_id:0}, (err, data) => {
        if (err) { res.end(); return;}

        let list = data;
        list.sort((a,b) => {
            if (a.timestamp > b.timestamp) {
                return 1
            } else {
                return -1
            }
        })

        let gdata = []
        for (let i = list.length-144; i < list.length; i++) {
            gdata.push(list[i]);
        }
        res.json(gdata);
    })
});

const port = process.env.PORT || 3000;
app.listen(PORT=port, ()=> {
    console.log(`listening at ${PORT}`); 
})