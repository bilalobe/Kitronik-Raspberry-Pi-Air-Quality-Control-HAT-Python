const Gpio = require('onoff').Gpio;
const pigpio = require('pigpio');


class KitronikGPIO {
    constructor(gpioNumber, isPWM = false) {
        if (![13, 19, 22, 23, 24].includes(gpioNumber)) {
            gpioNumber = 22;
        }
        this.gpioNumber = gpioNumber;
        this.isPWM = isPWM;

        if (isPWM) {
            this.gpio = new pigpio.Gpio(gpioNumber, { mode: pigpio.Gpio.OUTPUT });
            this.dutyCycle = 10;
            this.frequency = 500;
        } else {
            this.gpio = new Gpio(gpioNumber, 'out');
        }
    }

    // Turn the GPIO on, when not in PWM mode
    turnOn() {
        if (this.isPWM) return;
        this.gpio.writeSync(1);
    }

    // Turn the GPIO off, when not in PWM mode
    turnOff() {
        if (this.isPWM) return;
        this.gpio.writeSync(0);
    }

    // Update the frequency output by the GPIO, when in PWM mode
    changeFrequency(frequency) {
        if (!this.isPWM) return;
        if (frequency > 3000) frequency = 3000;
        if (frequency < 1) frequency = 1;
        this.frequency = frequency;
        this.gpio.hardwarePwmWrite(this.frequency, this.dutyCycle * 10000); // pigpio uses a range of 0-1M for duty cycle
    }

    // Update the duty cycle output by the GPIO, when in PWM mode
    changeDutyCycle(dutyCycle) {
        if (!this.isPWM) return;
        if (dutyCycle > 100) dutyCycle = 100;
        if (dutyCycle < 0) dutyCycle = 0;
        this.dutyCycle = dutyCycle;
        this.gpio.hardwarePwmWrite(this.frequency, this.dutyCycle * 10000); // pigpio uses a range of 0-1M for duty cycle
    }

    // Start the GPIO generating the PWM
    start() {
        if (!this.isPWM) return;
        this.gpio.hardwarePwmWrite(this.frequency, this.dutyCycle * 10000);
    }

    // Stop the GPIO generating the PWM
    stop() {
        if (!this.isPWM) return;
        this.gpio.hardwarePwmWrite(0, 0); // Stop the PWM signal
    }
}

module.exports = KitronikGPIO;