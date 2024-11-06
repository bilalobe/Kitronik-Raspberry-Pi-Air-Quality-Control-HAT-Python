const I2CCommunication = require('./I2CCommunication');

class DataReading {
    constructor(i2cComm) {
        this.i2cComm = i2cComm;
        this.CHIP_ADDRESS = 0x77;
        this.TEMP_MSB_0 = 0x22;
        this.TEMP_LSB_0 = 0x23;
        this.TEMP_XLSB_0 = 0x24;
        this.PRESS_MSB_0 = 0x1F;
        this.PRESS_LSB_0 = 0x20;
        this.PRESS_XLSB_0 = 0x21;
        this.HUMID_MSB_0 = 0x25;
        this.HUMID_LSB_0 = 0x26;
        this.GAS_RES_MSB_0 = 0x2C;
        this.GAS_RES_LSB_0 = 0x2D;
        this.MEAS_STATUS_0 = 0x1D;
    }

    readTemperature() {
        const tRaw = (this.i2cComm.readByteData(this.TEMP_MSB_0) << 12) |
                     (this.i2cComm.readByteData(this.TEMP_LSB_0) << 4) |
                     (this.i2cComm.readByteData(this.TEMP_XLSB_0) >> 4);
        return tRaw;
    }

    readPressure() {
        const pRaw = (this.i2cComm.readByteData(this.PRESS_MSB_0) << 12) |
                     (this.i2cComm.readByteData(this.PRESS_LSB_0) << 4) |
                     (this.i2cComm.readByteData(this.PRESS_XLSB_0) >> 4);
        return pRaw;
    }

    readHumidity() {
        const hRaw = (this.i2cComm.readByteData(this.HUMID_MSB_0) << 8) |
                     (this.i2cComm.readByteData(this.HUMID_LSB_0) >> 4);
        return hRaw;
    }

    readGasResistance() {
        const gResRaw = (this.i2cComm.readByteData(this.GAS_RES_MSB_0) << 2) |
                        (this.i2cComm.readByteData(this.GAS_RES_LSB_0) >> 6);
        return gResRaw;
    }

    readStatus() {
        const status = this.i2cComm.readByteData(this.MEAS_STATUS_0);
        return status;
    }
}

module.exports = DataReading;