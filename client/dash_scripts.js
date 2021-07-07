const reconnectTimeout = 2000;
const host="broker.hivemq.com"; //change this
const port=8000;

let ctrl
let data

function onConnect() {
    console.log("onConnected");
    mqtt.subscribe("DeviceStatus");
    mqtt.subscribe("Sensors");
}
function onFailure(message) {
    console.log("Connection to Host: "+host+"Failed");
    setTimeout(MQTTconnect,reconnectTimeout);
}

function onMessageArrived(message) {
    m = message.payloadString;
    let out_msg = "Message recieved :"+message.payloadString+"</br>";
    out_msg = out_msg+"Message Topic :"+message.destinationName;
    if (message.destinationName === "DeviceStatus") {
        ctrl = message.payloadString;
        console.log(ctrl);
        document.getElementById('c01').textContent = covert2text(ctrl[0]);
        document.getElementById('c02').textContent = covert2text(ctrl[1]);
        document.getElementById('c03').textContent = covert2text(ctrl[2]);
        document.getElementById('c04').textContent = covert2text(ctrl[3]);
    }
    if (message.destinationName === "Sensors") {
        data = JSON.parse(message.payloadString);
        //console.log(typeof(data));
        console.log(data);
        document.getElementById('p01').textContent = data.temperature;
        document.getElementById('p02').textContent = data.humidity;
        document.getElementById('p03').textContent = data.light;
        document.getElementById('p05').textContent = data.pressure;
        if (data.water < 300){
            document.getElementById('p04').textContent = "DRY";
        } else {
            document.getElementById('p04').textContent = "WET";
        }
    }
    //console.log(out_msg);
}

function MQTTconnect() {
    console.log("connecting to "+ host +" "+ port);
    const mqtt = new Paho.MQTT.Client(host,port,"clientjsx");
    var options = { //useSSL:true,
        timeout: 3,
        onSuccess: onConnect,
        onFailure: onFailure,
    };
    mqtt.onMessageArrived = onMessageArrived;
    mqtt.connect(options); //connect
}

console.log("connecting to "+ host +" "+ port);
const mqtt = new Paho.MQTT.Client(host,port,"clientjsx");
var options = { //useSSL:true,
    timeout: 3,
    onSuccess: onConnect,
    onFailure: onFailure,
};
mqtt.onMessageArrived = onMessageArrived;
mqtt.connect(options); //connect    


function covert2text(c) {
    if (c == '1') { return 'OFF' } 
    else if (c == '0') { return 'ON' }
    else { return 'Auto' }
}

function showCam() {
    document.getElementById('maincam').innerHTML ='<iframe width="720" height="480" src="https://www.youtube.com/embed/c7BqweTSfhc"></iframe>';
}

function Cam1() {
    document.getElementById('cam1').innerHTML ='<iframe width="360" height="240" src="https://www.youtube.com/embed/c7BqweTSfhc"></iframe>';
}

function Cam2() {
    document.getElementById('cam2').innerHTML ='<iframe width="360" height="240" src="https://www.youtube.com/embed/c7BqweTSfhc"></iframe>';
}
