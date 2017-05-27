var SENSORID = "";
var TOGGLELED = "";
var LEDSTATE = "";
var LEDSTREAM = "";

var rabbit = require("rabbot");
var Gpio = require("onoff").Gpio;
var led = new Gpio(26, "out");
var express = require("express");
var app = express();

function handleMessage(stream) {

    if (stream) {
        streamer();
    }

    //setting up the handler for the subscriber
    var handler = rabbit.handle(TOGGLELED, function (msg) {
        try {
            var parsedBody = msg.body;
            if (parsedBody.onOff == "1") {
                led.writeSync(1);
            } else {
                led.writeSync(0);
            }

            var ledState = led.readSync();

            console.log(ledState);

            publishState(LEDSTATE, ledState, false);
            msg.ack();
        }
        catch (err) {
            console.log(err);
            message.nack();
        }
    });
    console.log("waiting for message from publisher");
}

function publishState(variableId, onOff, numeric) {
    var p = rabbit.publish(SENSORID, {
        type: variableId,
        body: {
            variableId: variableId,
            value: convert(onOff, numeric)
        },
        routingKey: variableId
    });
}

function convert(onOff, numeric) {
    if (numeric) return onOff;

    return onOff === 1 ? true : false;
}

function streamer() {
    setTimeout(function () {
        var ledState = led.readSync();
        publishState(LEDSTREAM, ledState, false);

        streamer();
    }, 10 * 1000);
}

var bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    if (TOGGLELED === "") {
        res.sendFile("SensorWebPage.html", { root: __dirname });
    } else {
        res.send("LED Sensor Activated.");
    }
});

app.post("/start", function (req, res) {
    TOGGLELED = req.body.toggleLedId;
    LEDSTATE = req.body.ledStateId;
    LEDSTREAM = req.body.ledStreamId;
    SENSORID = req.body.sensorId;

    rabbit.configure({
        connection: {
            uri: "amqp://iqcujvfc:tAoosDI1yhbRh1-u4RK6Zb1KcaESx8E2@weasel.rmq.cloudamqp.com/iqcujvfc"
        },
        queues: [
            { name: TOGGLELED, subscribe: true, durable: true },
            { name: LEDSTATE, subscribe: true, durable: true }
        ],
        exchanges: [{ name: SENSORID, type: "topic", persistent: true, durable: true }],
        bindings: [
            { exchange: SENSORID, target: TOGGLELED, keys: [TOGGLELED] },
            { exchange: SENSORID, target: LEDSTATE, keys: [LEDSTATE] }
        ]
    })
        .then(() => {
            handleMessage(req.body.startStream);
        });
    //.then(publishMessage);

    res.send("LED Sensor Activated.");
});

app.listen(8080, function () {
    console.log("Listening...");
});