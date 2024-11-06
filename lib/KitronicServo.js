const pigpio = require('pigpio');
const Gpio = pigpio.Gpio;

class KitronikServo {
    constructor() {
        this.servoPin = new pigpio.Gpio(6, { mode: pigpio.Gpio.OUTPUT });
        this.dutyCycle = 2.5;
        this.frequency = 50; // 50 Hz for servo control
    }

    // Update the duty cycle output to the Servo
    changeDutyCycle(dutyCycle) {
        if (dutyCycle > 12.5) dutyCycle = 12.5;
        if (dutyCycle < 2.5) dutyCycle = 2.5;
        this.dutyCycle = dutyCycle;
        this.servoPin.servoWrite(this.dutyCycle * 1000); // pigpio uses microseconds for servo control
    }

    // Start the Servo PWM
    start() {
        this.servoPin.servoWrite(this.dutyCycle * 1000);
    }

    // Stop the Servo PWM
    stop() {
        this.servoPin.servoWrite(0); // Stop the PWM signal
    }

    // Update the percent the Servo is set to between 0 and 100
    changePercent(percent) {
        if (percent > 100) percent = 100;
        if (percent < 0) percent = 0;
        this.changeDutyCycle(2.5 + (percent / 10));
    }

    // Update the angle the Servo is set to between 0 and 180
    changeAngle(angle) {
        if (angle > 180) angle = 180;
        if (angle < 0) angle = 0;
        this.changePercent(angle / 1.8);
    }
}

module.exports = KitronikServo;