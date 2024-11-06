const I2CCommunication = require('./I2CCommunication');

class SensorInitialization {
    constructor(i2cComm) {
        this.i2cComm = i2cComm;
        this.CHIP_ADDRESS = 0x77;
        this.CTRL_MEAS = 0x74;
        this.RESET = 0xE0;
        this.CHIP_ID = 0xD0;
        this.CTRL_HUM = 0x72;
        this.CONFIG = 0x75;
        this.CTRL_GAS_0 = 0x70;
        this.CTRL_GAS_1 = 0x71;
        this.OSRS_2X = 0x02;
        this.OSRS_16X = 0x05;
        this.IIR_3 = 0x02;
    }

    async initialize() {
        let chipID = this.i2cComm.readByteData(this.CHIP_ID);
        while (chipID !== 97) {
            chipID = this.i2cComm.readByteData(this.CHIP_ID);
        }
        this.i2cComm.writeByteData(this.RESET, 0xB6);
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.i2cComm.writeByteData(this.CTRL_MEAS, 0x00);
        this.i2cComm.writeByteData(this.CTRL_HUM, this.OSRS_2X);
        this.i2cComm.writeByteData(this.CTRL_MEAS, (this.OSRS_2X << 5) | (this.OSRS_16X << 2));
        this.i2cComm.writeByteData(this.CONFIG, this.IIR_3 << 2);
        this.i2cComm.writeByteData(this.CTRL_GAS_1, 0x20);
    }
}

module.exports = SensorInitialization;