const KitronikGPIO = require('./KitronikGPIO.js');

// Class to control the High Power Out on the HAT
// Is a subclass of KitronikGPIO, uses the same functions
class KitronikHighPowerOut extends KitronikGPIO {
    constructor(hpoNumber, isPWM = false) {
        let gpioNumber = 13;
        if (hpoNumber === 2) gpioNumber = 19;
        super(gpioNumber, isPWM);
    }
}

module.exports = KitronikHighPowerOut;