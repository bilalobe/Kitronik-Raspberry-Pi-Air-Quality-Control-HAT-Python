const pigpio = require('pigpio');
const Gpio = pigpio.Gpio;

class KitronikBuzzer {
    constructor() {
        this.buzzerPin = new pigpio.Gpio(26, { mode: pigpio.Gpio.OUTPUT });
        this.frequency = 440;
        this.dutyCycle = 128; // 50% duty cycle for a square wave
    }

    // Update the tone output by the Buzzer
    changeTone(frequency) {
        if (frequency > 3000) frequency = 3000;
        if (frequency < 1) frequency = 1;
        this.frequency = frequency;
        this.buzzerPin.hardwarePwmWrite(this.frequency, this.dutyCycle * 10000); // pigpio uses a range of 0-1M for duty cycle
    }

    // Start the buzzer generating the tone
    start() {
        this.buzzerPin.hardwarePwmWrite(this.frequency, this.dutyCycle * 10000);
    }

    // Stop the buzzer generating the tone
    stop() {
        this.buzzerPin.hardwarePwmWrite(0, 0); // Stop the PWM signal
    }
}

module.exports = KitronikBuzzer;