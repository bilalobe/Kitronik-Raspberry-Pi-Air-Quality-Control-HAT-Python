const KitronikSerial = require('./KitronikSerial');

class KitronikRTC {
    constructor() {
        const s = new KitronikSerial();
        this.ser = s.getSerial();
    }

    // Ask the HAT for the current Real Time Clock value
    read() {
        return new Promise((resolve, reject) => {
            const req = [5, 0, 0, 0, 0, 0, 0, 0, 0, 255];
            const request = Buffer.from(req);
            this.ser.write(request, (err) => {
                if (err) {
                    return reject(err);
                }
                this.ser.once('data', (data) => {
                    let response = data.toString();
                    while (response.length < 24) {
                        this.ser.write(request);
                        this.ser.once('data', (data) => {
                            response = data.toString();
                        });
                    }
                    resolve(response.slice(2, -3));
                });
            });
        });
    }

    // Ask the HAT to update the Real Time Clock value
    set(year, month, day, dayOfWeek, hour, minute, second) {
        return new Promise((resolve, reject) => {
            const req = [6, (year >> 8) & 0xff, year & 0xff, month, day, dayOfWeek, hour, minute, second, 255];
            const request = Buffer.from(req);
            this.ser.write(request, (err) => {
                if (err) {
                    return reject(err);
                }
                this.ser.once('data', (data) => {
                    let response = data.toString();
                    while (response !== 'RTC SET DONE\n') {
                        this.ser.write(request);
                        this.ser.once('data', (data) => {
                            response = data.toString();
                        });
                    }
                    resolve();
                });
            });
        });
    }
}


module.exports = KitronikRTC;