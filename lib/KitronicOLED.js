const Jimp = require('jimp');
const I2CCommunication = require('./I2CCommunication');

class KitronikOLED {
    constructor(flipScreen = false) {
        this.width = 128;
        this.height = 64;
        this.external_vcc = false;
        this.pages = 8;
        this.buffer = new Array(this.width * this.pages).fill(0);
        this.i2cComm = new I2CCommunication(0x3C);

        this.plotArray = [];
        this.plotYMin = 0;
        this.plotYMax = 100;
        this.yPixelMin = 63;
        this.yPixelMax = 12;

        this.image = new Jimp(this.width, this.height, 0x000000FF);
        this.font = Jimp.FONT_SANS_8_BLACK;

        // register definitions
        this.SET_CONTRAST = 0x81;
        this.SET_ENTIRE_ON = 0xA4;
        this.SET_NORM_INV = 0xA6;
        this.SET_DISP = 0xAE;
        this.SET_MEM_ADDR = 0x20;
        this.SET_COL_ADDR = 0x21;
        this.SET_PAGE_ADDR = 0x22;
        this.SET_DISP_START_LINE = 0x40;
        this.SET_SEG_REMAP = flipScreen ? 0xA0 : 0xA1;
        this.SET_COM_OUT_DIR = flipScreen ? 0xC0 : 0xC8;
        this.SET_MUX_RATIO = 0xA8;
        this.SET_DISP_OFFSET = 0xD3;
        this.SET_COM_PIN_CFG = 0xDA;
        this.SET_DISP_CLK_DIV = 0xD5;
        this.SET_PRECHARGE = 0xD9;
        this.SET_VCOM_DESEL = 0xDB;
        this.SET_CHARGE_PUMP = 0x8D;

        this.init_display();
    }

    write_cmd(cmd) {
        this.i2cComm.writeByteData(0x00, cmd);
    }

    write_data(data) {
        this.i2cComm.writeByteData(0x40, data);
    }

    init_display() {
        const commands = [
            this.SET_DISP | 0x00,  // off
            this.SET_MEM_ADDR, 0x00,  // horizontal
            this.SET_DISP_START_LINE | 0x00,
            this.SET_SEG_REMAP,
            this.SET_MUX_RATIO, this.height - 1,
            this.SET_COM_OUT_DIR,
            this.SET_DISP_OFFSET, 0x00,
            this.SET_COM_PIN_CFG, this.width > 2 * this.height ? 0x02 : 0x12,
            this.SET_DISP_CLK_DIV, 0x80,
            this.SET_PRECHARGE, this.external_vcc ? 0x22 : 0xF1,
            this.SET_VCOM_DESEL, 0x30,
            this.SET_CONTRAST, 0xFF,
            this.SET_ENTIRE_ON,
            this.SET_NORM_INV,
            this.SET_CHARGE_PUMP, this.external_vcc ? 0x10 : 0x14,
            this.SET_DISP | 0x01  // on
        ];

        commands.forEach(cmd => this.write_cmd(cmd));
        this.clear();
        this.show();
    }

    poweroff() {
        this.write_cmd(this.SET_DISP | 0x00);
    }

    poweron() {
        this.write_cmd(this.SET_DISP | 0x01);
    }

    contrast(contrast) {
        this.write_cmd(this.SET_CONTRAST);
        this.write_cmd(contrast);
    }

    invert(invert) {
        this.write_cmd(this.SET_NORM_INV | (invert & 1));
    }

    async displayText(text, line, x_offset = 0) {
        if (line < 1) line = 1;
        if (line > 6) line = 6;
        const y = (line * 11) - 10;
        const font = await Jimp.loadFont(this.font);
        this.image.print(font, x_offset, y, text);
    }

    show() {
        const pixels = this.image.bitmap.data;
        let index = 0;
        for (let page = 0; page < this.pages; page++) {
            for (let x = 0; x < this.width; x++) {
                let bits = 0;
                for (let bit = 0; bit < 8; bit++) {
                    bits = bits << 1;
                    bits |= pixels[(x + (page * 8 + 7 - bit) * this.width) * 4] === 0 ? 0 : 1;
                }
                this.buffer[index] = bits;
                index++;
            }
        }

        let x0 = 0;
        let x1 = this.width - 1;
        if (this.width === 64) {
            x0 += 32;
            x1 += 32;
        }
        this.write_cmd(this.SET_COL_ADDR);
        this.write_cmd(x0);
        this.write_cmd(x1);
        this.write_cmd(this.SET_PAGE_ADDR);
        this.write_cmd(0);
        this.write_cmd(this.pages - 1);
        for (let i = 0; i < this.buffer.length; i++) {
            this.write_data(this.buffer[i]);
        }
    }

    plot(variable) {
        variable = Math.trunc(variable);

        if (variable > this.plotYMax) {
            this.plotYMax = variable;
        }
        if (variable < this.plotYMin) {
            this.plotYMin = variable;
        }

        const entries = this.plotArray.length;
        if (entries >= 128) {
            this.plotArray.shift();
        }
        this.plotArray.push(variable);

        let prevX = 0;
        let prevY = this.plotArray[0];
        for (let entry = 0; entry < this.plotArray.length; entry++) {
            const x = entry;
            let y = this.plotArray[entry];
            y = Math.trunc(this.yPixelMin - (y * ((this.yPixelMin - this.yPixelMax) / (this.plotYMax - this.plotYMin))));
            if (x === 0) {
                this.image.setPixelColor(0xFFFFFFFF, x, y);
            } else {
                this.drawLine(prevX, prevY, x, y);
            }
            prevX = x;
            prevY = y;
        }
    }

    clear() {
        this.buffer.fill(0);
        this.image = new Jimp(this.width, this.height, 0x000000FF);
    }

    clearLine(line) {
        const y = (line - 1) + ((line * 10) - 10);
        this.image.scan(0, y, this.width, 10, function (x, y, idx) {
            this.bitmap.data[idx] = 0;
            this.bitmap.data[idx + 1] = 0;
            this.bitmap.data[idx + 2] = 0;
            this.bitmap.data[idx + 3] = 255;
        });
    }

    drawLine(start_x, start_y, end_x, end_y) {
        this.image.scan(start_x, start_y, end_x - start_x, end_y - start_y, function (x, y, idx) {
            this.bitmap.data[idx] = 255;
            this.bitmap.data[idx + 1] = 255;
            this.bitmap.data[idx + 2] = 255;
            this.bitmap.data[idx + 3] = 255;
        });
    }

    drawRect(start_x, start_y, width, height, fill = false) {
        const fill_value = fill ? 0xFFFFFFFF : 0x000000FF;
        this.image.scan(start_x, start_y, width, height, function (x, y, idx) {
            this.bitmap.data[idx] = fill_value;
            this.bitmap.data[idx + 1] = fill_value;
            this.bitmap.data[idx + 2] = fill_value;
            this.bitmap.data[idx + 3] = 255;
        });
    }
}

module.exports = KitronikOLED;