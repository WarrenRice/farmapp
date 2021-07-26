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

let starts = [];
let ins = [];
let ends = [];

let svs = [];
let ini = [10,25,50,65];
let vals = [];


let ctrl ="11111111"
let mode = "0120"
let data

let paralist = ['Temperature','Humidity','Light','Water']

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
        let tim1 = createDiv(); tim1.class('box'); tim1.parent(tim); 
        let tim2 = createDiv(); tim2.class('box'); tim2.parent(tim);
        let tim3 = createDiv(); tim3.class('box'); tim3.parent(tim);

        p = createP('start'); p.parent(tim1);
        let sel = createSelect(); 
        for (let j=0; j<24; j++) {
            sel.option(`${j}:00`); 
        }
        sel.parent(tim1); starts.push(sel);

        p = createP('duration (mins)'); p.parent(tim2);
        let input = createInput(); input.parent(tim2); ins.push(input);
        let submitd = createButton('SET'); submitd.id(`s${i}`); submitd.parent(tim2); 
        submitd.mousePressed(setTime);

        p = createP('end'); p.parent(tim3);
        let end = createP(`0:0${i}`); end.parent(tim3); ends.push(end);


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
        // tims[k].hide(); auts[k].hide(); 
        // mans[k].show();
        mode = mode.replaceAt(k, '0')
    } else if(this.html() == 'Manual') {
        this.html('Auto'); //<<Auto
        // mans[k].hide(); tims[k].hide();
        // auts[k].show();
        mode = mode.replaceAt(k, '1')  
    } else { 
        this.html('Timer'); //<<Timer
        // auts[k].hide(); mans[k].hide();
        // tims[k].show(); tims[k].style('display','flex');
        mode = mode.replaceAt(k, '2')    
    }
    console.log(`selected mode: ${mode}`);
    const message = new Paho.MQTT.Message(mode);
    message.retained = true;
    message.destinationName = "DeviceMode";
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
    let msg
    if (sl_los[k].html() === 'OFF') {
        msg = 'a,0,'
    } else {
        msg = 'a,1,'
    }
    msg=msg.concat(slds[k].value())
    console.log(msg)
}




String.prototype.replaceAt = function(index, replacement) {
    if (index >= this.length) {
        return this.valueOf();
    }
 
    var chars = this.split('');
    chars[index] = replacement;
    return chars.join('');
}

function onOff(){
    let k = this.id(); 
    k = k.substring(1); //console.log(k); console.log(typeof(k));

    if(this.html() === 'OFF'){
        ctrl = ctrl.replaceAt(k, '0')
    }else{
        ctrl = ctrl.replaceAt(k, '1')
    }
    console.log(ctrl);
    const message = new Paho.MQTT.Message(ctrl);
    message.retained = true;
    message.destinationName = "DeviceStatus";
    mqtt.send(message);
}

function setTime(){
    let k = this.id();
    k = k.substring(1);

    let hr = starts[k].value();
    hr = parseInt(hr.slice(0, -3));

    hr = hr + parseInt(ins[k].value()/60);

    console.log(hr);
    console.log(ins[k].value()%60);

    if (ins[k].value()%60 < 10) {
        ends[k].html(`${hr}:0${parseInt(ins[k].value()%60)}`);
    } else {
        ends[k].html(`${hr}:${parseInt(ins[k].value()%60)}`);
    }

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
    mqtt.subscribe("config/d1");
}

function onFailure(message) {
    console.log("Connection to Host: "+host+"Failed");
    setTimeout(MQTTconnect,reconnectTimeout);
}

function onMessageArrived(message) {
    let m = message.payloadString;
    let out_msg = "Message recieved :"+message.payloadString+"</br>";
    out_msg = out_msg+"Message Topic :"+message.destinationName;
    
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

    if (message.destinationName === "DeviceMode") {
         mode = message.payloadString;
         console.log(mode);
         for (let i = 0; i < 4; i++) {
             if ( mode[i] === "0"){
                mbtns[i].html('Manual')
                auts[i].hide();
                tims[i].hide();
                mans[i].show();
             } else if (mode[i] === "1") {
                mbtns[i].html('Auto')
                mans[i].hide();
                tims[i].hide();
                auts[i].show();
             } else {
                mbtns[i].html('Timer')
                auts[i].hide();
                mans[i].hide();
                tims[i].show(); tims[i].style('display','flex');
             }
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