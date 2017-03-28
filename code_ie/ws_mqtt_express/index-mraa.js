var Edison = require("edison-io");

var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://ec2-35-161-110-220.us-west-2.compute.amazonaws.com')

var mraa = require('mraa');

const SmartOn = 'on'
const SmartOff = 'off'

const HouseName = "/Main110_"
var HouseTopic = HouseName + 'Controller'
var AcTopic = HouseName + 'Ac'
var HeaterTopic = HouseName + 'Heater'
var LightsTopic = HouseName + 'Lights'
var StoveTopic = HouseName + 'Stove'
var ThermostatTopic = HouseName + 'Thermostat'
var ClockTopic = HouseName + 'Clock'
var TopicList = [HouseTopic, AcTopic, HeaterTopic, LightsTopic, StoveTopic, ThermostatTopic, ClockTopic]

const AcLedPin		= 2
const MotorPin		= 6		// pwm
const HeaterLedPin	= 4
const HouseLightsPin	= 5		// pwm
const WashingMachinePin	= 9		// pwm
const StoveLedPin	= 10		// pwm

const PortTypeGpio = "g"
const PortTypePwm = "p"

function IoWrite(value) {
	console.log("IoWrite " + this.pin .toString() + ' --> ' + value.toString() + ' - MaxPwm: ' + this.maxPwm.toString());
	if (this.type === PortTypePwm) {
		if (value < 0.001) {
			value = 0.0;
			this.io.enable(true);
			this.io.write(0.2);
			this.io.write(0.1);
			this.io.write(0);
			this.lastValue = value;
			this.io.enable(false);
			this.enabled = false;
			console.log("ZERO FIX " + value.toString());
		} else {
			if (!this.enabled) {
				this.io.enable(true);
				this.enabled = true;
			};
			if (value > this.maxPwm) {
			       value = this.maxPwm;
			};	       
			this.io.write(value);
			this.lastValue = value;
		}
	} else {
		this.io.write(value);
		this.lastValue = value;
	};
}

function IoFadeStep(step) {
	if (step != undefined) {
		this.fadeStep = step;
	};
	if (this.fadeStep == undefined) {
		return;
	};
	this.lastValue = this.lastValue + this.fadeStep;
	if (this.fadeStep < 0) {
		if (this.lastValue < 0.0) {
			this.lastValue = 0.0;
			this.fadeStep = undefined;
		}
	} else {
		if (this.lastValue > 1.0) {
			this.lastValue = 1.0;
			this.fadeStep = undefined;
		}
	}
}

function IoPort(type, pin, isOutput) {
	this.lastValue = 0;
	this.fadeStep = undefined;
	this.type = type;
	this.pin = pin;
	this.maxPwm = 0.9;
	if (isOutput === undefined) {
		this.isOutput = true;
	} else if (isOutput) {
		this.isOutput = true;
	} else {
		this.isOutput = false;
	};
	if (this.type == PortTypePwm) {
		this.io = new mraa.Pwm(this.pin);
		this.io.enable(true);
		this.enabled = true;
	} else {
		this.io = new mraa.Gpio(this.pin);
		if (this.isOutput) {
			this.io.dir(mraa.DIR_OUT);
		} else {
			this.io.dir(mraa.DIR_IN);
		};
		this.enabled = true;
	}
	this.write = IoWrite;
	this.fade = IoFadeStep;
}

var AcLedGpio = new IoPort(PortTypeGpio, AcLedPin); 
var MotorPwm = new IoPort(PortTypeGpio, MotorPin);
MotorPwm.maxPwm = 0.2;
var HeaterLedGpio = new IoPort(PortTypeGpio, HeaterLedPin); 
var StoveLedGpio = new IoPort(PortTypeGpio, StoveLedPin); 
var HouseLightsPwm = new IoPort(PortTypePwm, HouseLightsPin);

client.on('connect', function() {
    client.subscribe(TopicList);
    client.publish(HouseTopic, SmartOn);
});

AcDevice(SmartOff);
HeaterDevice(SmartOff);
GpioDevice(StoveLedGpio, SmartOff);

function AcDevice(state) {
  if (state === SmartOn) {
    HeaterDevice(SmartOff);
    MotorPwm.write(1.0);
    AcLedGpio.write(1);
    console.log('AC ON');
    //client.publish(AcTopic, SmartOn);
  } else {
    MotorPwm.write(0.0);
    AcLedGpio.write(0);
    console.log('AC OFF');
    //client.publish(AcTopic, SmartOff);
  }
}

function HeaterDevice(state) {
  if (state === SmartOn) {
    AcDevice(SmartOff);
    MotorPwm.write(1.0);
    HeaterLedGpio.write(1);
    console.log('Heater Turned On' );
    //client.publish(HeaterTopic, SmartOn);
  } else {
    MotorPwm.write(0.0);
    HeaterLedGpio.write(0);
    console.log('Heater Turned Off' );
    //client.publish(HeaterTopic, SmartOff);
  }
}

function GpioDevice(gpio, state) {
  if (state === SmartOn) {
    gpio.write(1);
  } else {
    gpio.write(0);
  }
}

function PwmDevice(gpio, valueS) {
  valueF = parseFloat(valueS);
  console.log('PWM ' + valueF.toString());
  gpio.write(valueF);
}

client.on('message', function(topic, message) {
            // message is Buffer
	    thisTopic = topic.toString();
	    thisMessage = message.toString(); 
            console.log(thisTopic + ' : ' + thisMessage );
            if(thisTopic === AcTopic){
		AcDevice(thisMessage);
            }else if(thisTopic === HeaterTopic){
		HeaterDevice(thisMessage);
            }else if(thisTopic === StoveTopic){
		GpioDevice(StoveLedGpio, thisMessage);
            }else if(thisTopic === LightsTopic){
		PwmDevice(HouseLightsPwm, thisMessage);
            };
            client.publish(thisTopic+'_State', thisMessage);
    });

var interval = setInterval(function(str1, str2) {
	  console.log(str1 + " " + str2);
}, 1000, "Running.", "House Monitor Loop");

// clearInterval(interval);
//while (true) {
//  setTimeout(function () {
//	  console.log('boo')
//  }, 5000);
//}




