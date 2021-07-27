let mbtns = [];
let a,b,c;
let auts = [];
let mans = [];
let tims = [];

let mONs = [];

let slds = [];
let sl_los = [];
let sl_his = [];
let sl_sets = [];

let hrs = [];
let mins = [];
let duras = [];
let timerstats = [];
let ends = [];
//let timeBtns = [];

let svs = [];
let ini = [1,2,3,4];
let vals = [];

let ctrl ="11111111"
let mode = "0120"
let device_msgs =['','','','']
let data

let paralist = ['Temperature','Humidity','Light','Water']

const mqttDeviceTopics = ['control/d1','control/d2','control/d3','control/d4']

function setup() {
    noCanvas();
    for (let i = 0; i <4; i++){
        //Create Div for control Bar
        let dv = createDiv();
        let p = createP(paralist[i]); p.parent('#mid_id'); //create P as name parameter and parent to #middle_id
        p.style('text-align', 'center');
        dv.class('para');
        dv.parent('#mid_id');
        //Create Control Session
        a = createDiv(); a.class('setmode hl'); a.parent(dv); //Div Mode box a
        //Add Botton and Botton ID
        let mbtn = createButton('Manual'); mbtn.class('md'); mbtn.id(`b${i}`); mbtn.parent(a);  mbtns.push(mbtn);
        mbtn.mousePressed(toggle); //Trigger Fn() when press

        b = createDiv(); b.class('control hl'); b.parent(dv); //Div Control Content b

        //Manual Mode
        let man = createDiv(); man.class('man'); man.parent(b); mans.push(man); 
        man.hide();
        let mON = createButton('W8'); mON.id(`s${i}`); mON.class('mON'); mON.parent(man); mONs.push(mON);
        mON.mousePressed(onOff);


        //Auto Mode
        let aut = createDiv(); aut.class('aut'); aut.parent(b); auts.push(aut);
        let sv = createP(`${i}`); sv.style('margin-top','10px'); sv.parent(aut); svs.push(sv); //sv is slide value
        let sld = createSlider(0,100,ini[i]); sld.parent(aut); sld.class('sld'); sld.id(`s${i}`); slds.push(sld);
        const sl_ = createDiv(); sl_.class('sl_div'); sl_.parent(aut);
        let sl_lo = createButton('OFF'); sl_lo.id(`n${i}`); sl_lo.class('sl_btn'); sl_lo.parent(sl_); sl_los.push(sl_lo);
        let sl_set = createButton('SET'); sl_set.id(`o${i}`); sl_set.class('sl_btn'); sl_set.parent(sl_); sl_sets.push(sl_set);
        let sl_hi = createButton('ON'); sl_hi.id(`m${i}`); sl_hi.class('sl_btn'); sl_hi.parent(sl_); sl_his.push(sl_hi);
        aut.hide()
        sl_lo.mousePressed(toggleAutoLo); sl_hi.mousePressed(toggleAutoHi); 
        sl_set.mousePressed(setAuto);


        //Timer Mode
        let tim = createDiv(); tim.class('tim'); tim.parent(b); tims.push(tim); 
        tim.hide();   
        //Timer Divisions
        let tim1 = createDiv(); tim1.class('box'); tim1.parent(tim); 
        let tim2 = createDiv(); tim2.class('box'); tim2.parent(tim);
        let tim3 = createDiv(); tim3.class('box'); tim3.parent(tim);

        p = createP('start time'); p.parent(tim1);
        c = createDiv(); c.class('hline'); c.parent(tim1)
        //p = createP('Hr'); p.parent(c);
        let hr = createSelect(); 
        for (let j=0; j<24; j++) {
            hr.option(`${j}`); 
        }
        hr.parent(c); hrs.push(hr);
        
        //p = createP('Min'); p.parent(c);
        let min = createSelect();
        for (let j=0; j<59; j++) {
            min.option(`${j}`); 
        }
        min.parent(c); mins.push(min);


        p = createP('duration (mins)'); p.parent(tim2);
        let dura = createInput(); dura.parent(tim2); duras.push(dura);
        p = createP(''); p.parent(tim2); timerstats.push(p)
        c = createDiv(); c.class('hline'); c.parent(tim2)
        let submitd = createButton('ON'); submitd.id(`s${i}`); submitd.parent(c); //timeBtns.push(submitd)
        submitd.mousePressed(setTime);
        submitd = createButton('OFF'); submitd.id(`f${i}`); submitd.parent(c); //timeBtns.push(submitd1)
        submitd.mousePressed(setTime);

        p = createP('end'); p.parent(tim3);
        let end = createP(`0:0${i}`); end.parent(tim3); ends.push(end);

        //////Div c
        c = createDiv(); c.class('value hl'); c.parent(dv); //Div val c
        p = createP('Value'); p.parent(c); //add content to c
        let v = createP(`${i}`); v.parent(c); vals.push(v); //use i in value will update later
    }

}


function toggle(){
    let k = this.id();
    k = k.substring(1);

    if (this.html() == 'Timer') {
        this.html('Manual');
        tims[k].hide(); auts[k].hide(); 
        mans[k].show();

        //mode = mode.replaceAt(k, '0')
        device_msgs[k] = 'm,'

    } else if(this.html() == 'Manual') {
        this.html('Auto'); //<<Auto
        mans[k].hide(); tims[k].hide();
        auts[k].show();

        //mode = mode.replaceAt(k, '1')
        device_msgs[k] = 'a,'

    } else { 
        this.html('Timer'); //<<Timer
        auts[k].hide(); mans[k].hide();
        tims[k].show(); tims[k].style('display','flex');
        
        //mode = mode.replaceAt(k, '2')
        device_msgs[k] = 't,'    
    }
    console.log(k +" >> " +device_msgs[k])
}

function onOff(){
    let k = this.id(); 
    k = k.substring(1); //console.log(k); console.log(typeof(k));
    let out_msg = ''

    if(this.html() === 'OFF'){
        ctrl = ctrl.replaceAt(k, '0')
        out_msg = device_msgs[k]+'0'
    }else{
        ctrl = ctrl.replaceAt(k, '1')
        out_msg = device_msgs[k]+'1'
    }

    console.log(out_msg) //pub device mode to manual
    const message1 = new Paho.MQTT.Message(out_msg);
    message1.retained = true;
    message1.destinationName = mqttDeviceTopics[k];
    mqtt.send(message1);

    console.log(ctrl); //pub device status
    const message = new Paho.MQTT.Message(ctrl);
    message.retained = true;
    message.destinationName = "DeviceStatus";
    mqtt.send(message);
}

function toggleAutoLo(){
    let k = this.id(); 
    k = k.substring(1); //console.log(k); console.log(typeof(k));

    if(this.html() === 'OFF'){
        sl_los[k].html('ON')
        sl_his[k].html('OFF')
    }else{
        sl_los[k].html('OFF')
        sl_his[k].html('ON')
    }
}
function toggleAutoHi(){
    let k = this.id(); 
    k = k.substring(1); //console.log(k); console.log(typeof(k));

    if(this.html() === 'OFF'){
        sl_los[k].html('OFF')
        sl_his[k].html('ON')

        sl_his[k].class('')
    }else{
        sl_los[k].html('ON')
        sl_his[k].html('OFF')
    }
}

function setAuto(){
    let k = this.id();  k = k.substring(1);
    let out_msg
    if (sl_los[k].html() === 'OFF') {
        out_msg = 'a,0,'
    } else {
        out_msg = 'a,1,'
    }
    out_msg=out_msg.concat(slds[k].value())

    console.log(out_msg) //pub device mode to auto
    const message1 = new Paho.MQTT.Message(out_msg);
    message1.retained = true;
    message1.destinationName = mqttDeviceTopics[k];
    mqtt.send(message1);
}

String.prototype.replaceAt = function(index, replacement) {
    if (index >= this.length) {
        return this.valueOf();
    }
 
    var chars = this.split('');
    chars[index] = replacement;
    return chars.join('');
}


function setTime(){
    let k = this.id();
    k = k.substring(1);

    let out_msg = 't,';

    if (this.html() === 'OFF') {
        //this.html('ON')
        out_msg = out_msg.concat(0).concat(',') //////
    } else { //send 'ON'
        //this.html('OFF')
        out_msg = out_msg.concat(1).concat(',') //////
    }

    let hr = hrs[k].value();
    out_msg = out_msg.concat(hr).concat(',')
    let min = mins[k].value();
    out_msg = out_msg.concat(min).concat(',')
    let dur = duras[k].value();
    dur = parseInt(dur)

    if (dur > 0 && dur < 1440) {
        console.log(typeof(dur))
        timerstats[k].html(this.html())

        out_msg = out_msg.concat(dur).concat(',')

        console.log(hr);
        console.log(min);
        console.log(dur);
        
        z = hmr(hr,min,dur)
        ends[k].html(z)
        z = z.replace(":",",")

        out_msg = out_msg.concat(z)

        console.log(out_msg); //pub device mode to auto
        const message1 = new Paho.MQTT.Message(out_msg);
        message1.retained = true;
        message1.destinationName = mqttDeviceTopics[k];
        mqtt.send(message1);

    } else {
        timerstats[k].html('enter number: 1-1439')
        //don't pub
    }
    
}

function hmr(h,m,r) {
    let y = parseInt(m)+parseInt(r)
    let x = parseInt(h)
    if (y >= 60 ) {
        x = x + Math.floor(y/60);
        y = y%60; 
    }
    if (x >= 24) {
        x = x-24
    }
    let z =''
    if (y < 10) { z = x + ':0' + y} 
    else {z = x + ':' + y}
    return z
}


//////////MQTT//////////////
const reconnectTimeout = 2000;
//const host="broker.hivemq.com"; //change this
//const port=8000;
const host="test.mosquitto.org";
const port=8081;

function onConnect() {
    console.log("onConnected");
    mqtt.subscribe("DeviceStatus");
    mqtt.subscribe("DeviceMode");
    mqtt.subscribe("Sensors");
    for (let i=0; i<4; i++) {
        mqtt.subscribe(mqttDeviceTopics[i]);
    }
}

function onFailure(message) {
    console.log("Connection to Host: "+host+"Failed");
    setTimeout(MQTTconnect,reconnectTimeout);
}

function onMessageArrived(message) {
    let msg_in = message.payloadString;
    let out_msg = "Message recieved :"+msg_in+"</br>";
    out_msg = out_msg+"Message Topic :"+message.destinationName;
    const msg_Arr = msg_in.split(",")

    //console.log(message.destinationName)

    if (message.destinationName === "DeviceStatus") {
        ctrl = message.payloadString;
        console.log(ctrl);
        for (let i = 0; i < 4; i++) {
            if ( ctrl[i] === "1"){
                mONs[i].html('OFF')
            } else {
                mONs[i].html('ON')
            }
        }
    }

    if (mqttDeviceTopics.indexOf(message.destinationName) !== -1){
        let i = mqttDeviceTopics.indexOf(message.destinationName)

        console.log(i+' >> '+msg_Arr)

        if ( msg_Arr[0] === "m"){
            mbtns[i].html('Manual')
            auts[i].hide();
            tims[i].hide();
            mans[i].show();
         } else if (msg_Arr[0] === "a") {
            mbtns[i].html('Auto')
            mans[i].hide();
            tims[i].hide();
            auts[i].show();

            //set initial auto
            ini[i] = parseInt(msg_Arr[2])
            slds[i].value(parseInt(msg_Arr[2]))
            if (msg_Arr[1] === '0') {
                sl_los[i].html('OFF')
                sl_his[i].html('ON')
            } else {
                sl_los[i].html('ON')
                sl_his[i].html('OFF')
            }
            


         } else if (msg_Arr[0] === "t"){
            mbtns[i].html('Timer')
            auts[i].hide();
            mans[i].hide();
            tims[i].show(); tims[i].style('display','flex');

            //set initial timers
            if (msg_Arr[1] === '1') {
                timerstats[i].html('ON')
                //timeBtns[i].html('ON')
            } else {
                timerstats[i].html('OFF')
                //timeBtns[i].html('OFF')
            }

            hrs[i].value(parseInt(msg_Arr[2]))
            mins[i].value(parseInt(msg_Arr[3]))
            duras[i].value(parseInt(msg_Arr[4]))

            z = hmr(msg_Arr[2],msg_Arr[3],msg_Arr[4])
            ends[i].html(z)

         }
    }

    if (message.destinationName === "Sensors") {
        data = JSON.parse(message.payloadString);
        //console.log(typeof(data));
        console.log(data);
        vals[0].html(data.temperature);
        vals[1].html(data.humidity);
        vals[2].html(data.light);
        vals[3].html(data.water);
    }
    //console.log(out_msg);
}

function MQTTconnect() {
    console.log("connecting to "+ host +" "+ port);
    const mqtt = new Paho.MQTT.Client(host,port,"clientjsx");
    var options = { 
        useSSL:true,
        timeout: 3,
        onSuccess: onConnect,
        onFailure: onFailure,
    };
    mqtt.onMessageArrived = onMessageArrived;
    mqtt.connect(options); //connect
}

console.log("connecting to "+ host +" "+ port);
const mqtt = new Paho.MQTT.Client(host,port,"clientjsx");
var options = { 
    useSSL:true,
    timeout: 3,
    onSuccess: onConnect,
    onFailure: onFailure,
};
mqtt.onMessageArrived = onMessageArrived;
mqtt.connect(options); //connect    

///////////MQTT/////////////

function draw() { //main loop
    for (let i =0; i < 4; i++){
        svs[i].html(slds[i].value());
        //ends[i].html(starts[i].value() + ins[i].value());       
    }
}