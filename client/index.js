const reconnectTimeout = 2000;
//const host="broker.hivemq.com"; //change this
//const port=8000;
const host="test.mosquitto.org";
const port=8081;

let ctrl;
let data;
const mqttDeviceTopics = ['control/d1','control/d2','control/d3','control/d4']

function onConnect() {
  console.log("onConnected");
  mqtt.subscribe("DeviceStatus");
  mqtt.subscribe("Sensors");
  for (let i=0; i<4; i++) {
    mqtt.subscribe(mqttDeviceTopics[i]);
  }
}

function onFailure(message) {
  console.log("Connection to Host: " + host + "Failed");
  setTimeout(MQTTconnect, reconnectTimeout);
}

function onMessageArrived(message) {
  let msg_in = message.payloadString;
  let out_msg = "Message recieved :" + msg_in + "</br>";
  out_msg = out_msg + "Message Topic :" + message.destinationName;
  const msg_Arr = msg_in.split(",")

  if (message.destinationName === "Sensors") {
    data = JSON.parse(message.payloadString);

    console.log(data);
    document.getElementById("p00").textContent = data.temperature + " C";
    document.getElementById("p01").textContent = data.humidity +"%";
    document.getElementById("p02").textContent = data.light +" lux";
    document.getElementById("p04").textContent = data.pressure +" Pa";
    if (data.water < 300) {
      document.getElementById("p03").textContent = "DRY";
    } else {
      document.getElementById("p03").textContent = "WET";
    }
  }

  if (mqttDeviceTopics.indexOf(message.destinationName) !== -1){
    let i = mqttDeviceTopics.indexOf(message.destinationName)
    console.log(msg_Arr)
    document.getElementById(`m0${i}`).textContent = covert2text(msg_Arr[0]);

    document.getElementById(`c0${i}`).textContent = covert2text(msg_Arr[1]);
    document.getElementById(`c0${i}`).className = covert2style(msg_Arr[1])
  }

}

function MQTTconnect() {
  console.log("connecting to " + host + " " + port);
  const mqtt = new Paho.MQTT.Client(host, port, "clientjsx");
  var options = {
    useSSL:true,
    timeout: 3,
    onSuccess: onConnect,
    onFailure: onFailure
  };
  mqtt.onMessageArrived = onMessageArrived;
  mqtt.connect(options); //connect
}

console.log("connecting to " + host + " " + port);
const mqtt = new Paho.MQTT.Client(host, port, "clientjsx");
var options = {
  useSSL:true,
  timeout: 3,
  onSuccess: onConnect,
  onFailure: onFailure
};
mqtt.onMessageArrived = onMessageArrived;
mqtt.connect(options); //connect

function covert2text(m) {
  if (m == "m") {
    return "Manual";
  } else if (m == "a") {
    return "Auto";
  } else if (m == "t") {
    return "Timer";
  } else if (m == "1") {
    return "OFF";
  } else if (m == "0") { 
    return "ON";
  }
}

function covert2style(m) {
  if (m == "1") {
    return "w-25 badge bg-secondary";
  } else if (m == "0") { 
    return "w-25 badge bg-success";
  }
}

function showCam() {
  document.getElementById("maincam").innerHTML =
    '<iframe width="720" height="480" src="http://irismech.thddns.net:5510/"></iframe>';
}

function Cam1() {
  document.getElementById("cam1").innerHTML =
    '<iframe width="360" height="240" src="http://192.168.1.105:5510/"></iframe>';
}

function Cam2() {
  document.getElementById("cam2").innerHTML =
    '<iframe width="360" height="240" src="http://irismech.thddns.net:5511"></iframe>';
}
