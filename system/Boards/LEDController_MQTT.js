var TOGGLELED = "";
var LEDSTATE = "";
var LEDSTREAM = "";

var mqtt = require('mqtt');
var Gpio = require("onoff").Gpio;
var led = new Gpio(26, "out");

var express = require("express");
var app = express();

var subscribed = false;

function startStreaming(stream) {
    var client = mqtt.connect("mqtt://ihoygctf:u78pw3kJdxjf@m12.cloudmqtt.com:14461");
    client.on('connect', function () {
        if (!subscribed) {
            client.subscribe(TOGGLELED, function () {
                subscribed = true;

                client.on('message', function (topic, message, packet) {
                    console.log(topic + " " + message);

                    var parsedBody = JSON.parse(message);
                    if (parsedBody.onOff == "1") {
                        led.writeSync(1);
                    } else {
                        led.writeSync(0);
                    }

                    var ledState = led.readSync();

                    client.publish(LEDSTATE, JSON.stringify({
                        variableId: LEDSTATE,
                        value: ledState
                    }), function () {
                        console.log("Message is published");
                    });
                });
            });

            if (stream) {
                streamer(client);
            }
        }
    });
}

function streamer(client) {
    setTimeout(function () {
        var ledState = led.readSync();

        client.publish(LEDSTREAM, JSON.stringify({
            variableId: LEDSTREAM,
            value: ledState ? true : false
        }), function () {
            console.log("Message is published");
            streamer(client);
        });
    }, 10000);
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

    startStreaming(req.body.startStream);

    res.send("LED Sensor Activated.");
});

app.listen(8081, function () {
    console.log("Listening...");
});