const SerialPort = require('serialport');

class KitronikSerial {
    constructor() {
        if (!KitronikSerial.instance) {
            this.ser = new SerialPort('/dev/serial0', {
                baudRate: 115200,
                parity: 'none',
                stopBits: 1,
                dataBits: 8,
                timeout: 1000
            });
            KitronikSerial.instance = this;
        }
        return KitronikSerial.instance;
    }

    getSerial() {
        return this.ser;
    }
}

module.exports = KitronikSerial;