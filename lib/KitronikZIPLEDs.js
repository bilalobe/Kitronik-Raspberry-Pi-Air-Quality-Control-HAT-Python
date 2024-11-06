const { KitronikSerial } = require('./KitronikSerial');

class KitronikZIPLEDs {
    constructor(autoShow = true) {
        const s = new KitronikSerial();
        this.ser = s.getSerial();
        this.autoShow = autoShow;
    }

    // Ask the HAT to update the ZIPLEDs brightness
    setBrightness(brightness) {
        if (brightness < 0) brightness = 0;
        if (brightness > 100) brightness = 100;
        const req = [7, brightness, 0, 0, 0, 0, 0, 0, 0, 255];
        const request = Buffer.from(req);
        this.ser.write(request, (err) => {
            if (err) {
                console.error('Error writing to serial port:', err);
                return;
            }
            this.ser.once('data', (data) => {
                let response = data.toString();
                while (response !== 'LEDS BRIGHTNESS SET DONE\n') {
                    this.ser.write(request);
                    this.ser.once('data', (data) => {
                        response = data.toString();
                    });
                }
            });
        });
    }

    // Ask the HAT to show the updated ZIPLED values
    show() {
        const req = [8, 0, 0, 0, 0, 0, 0, 0, 0, 255];
        const request = Buffer.from(req);
        this.ser.write(request, (err) => {
            if (err) {
                console.error('Error writing to serial port:', err);
                return;
            }
            this.ser.once('data', (data) => {
                let response = data.toString();
                while (response !== 'LEDS SHOW DONE\n') {
                    this.ser.write(request);
                    this.ser.once('data', (data) => {
                        response = data.toString();
                    });
                }
            });
        });
    }

    // Ask the HAT to update a ZIPLED value
    setPixel(pixelNumber, colour) {
        let [r, g, b] = colour;
        if (pixelNumber < 0) pixelNumber = 0;
        if (pixelNumber > 2) pixelNumber = 2;
        if (r < 0) r = 0;
        if (r > 255) r = 255;
        if (g < 0) g = 0;
        if (g > 255) g = 255;
        if (b < 0) b = 0;
        if (b > 255) b = 255;
        const req = [9, pixelNumber, r, g, b, 0, 0, 0, 0, 255];
        const request = Buffer.from(req);
        this.ser.write(request, (err) => {
            if (err) {
                console.error('Error writing to serial port:', err);
                return;
            }
            this.ser.once('data', (data) => {
                let response = data.toString();
                while (response !== 'LED PIXEL SET DONE\n') {
                    this.ser.write(request);
                    this.ser.once('data', (data) => {
                        response = data.toString();
                    });
                }
                if (this.autoShow) {
                    this.show();
                }
            });
        });
    }

    // Ask the HAT to update the ZIPLEDs values
    fill(colour) {
        let [r, g, b] = colour;
        if (r < 0) r = 0;
        if (r > 255) r = 255;
        if (g < 0) g = 0;
        if (g > 255) g = 255;
        if (b < 0) b = 0;
        if (b > 255) b = 255;
        const req = [10, r, g, b, 0, 0, 0, 0, 0, 255];
        const request = Buffer.from(req);
        this.ser.write(request, (err) => {
            if (err) {
                console.error('Error writing to serial port:', err);
                return;
            }
            this.ser.once('data', (data) => {
                let response = data.toString();
                while (response !== 'LEDS FILL DONE\n') {
                    this.ser.write(request);
                    this.ser.once('data', (data) => {
                        response = data.toString();
                    });
                }
                if (this.autoShow) {
                    this.show();
                }
            });
        });
    }
}


module.exports = KitronikZIPLEDs;