
const KitronikSerial = require('./KitronikSerial.js');

class KitronikADC {
    constructor(adcNumber) {
        if (adcNumber > 2) adcNumber = 2;
        if (adcNumber < 0) adcNumber = 0;
        this.adcNumber = adcNumber + 1; // Increment for communication with HAT, can't send a request of zero
        const s = new KitronikSerial();
        this.ser = s.getSerial();
    }

    // Ask the HAT for the current ADC value
    read() {
        return new Promise((resolve, reject) => {
            const req = [this.adcNumber, 0, 0, 0, 0, 0, 0, 0, 0, 255];
            const request = Buffer.from(req);
            this.ser.write(request, (err) => {
                if (err) {
                    return reject(err);
                }
                this.ser.once('data', (data) => {
                    try {
                        const response = data.toString();
                        const temp = parseInt(response.slice(2, -3), 10);
                        resolve(temp);
                    } catch (error) {
                        this.read().then(resolve).catch(reject);
                    }
                });
            });
        });
    }
}

module.exports = KitronikADC;