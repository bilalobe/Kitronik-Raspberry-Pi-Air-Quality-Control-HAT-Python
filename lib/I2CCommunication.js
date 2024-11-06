const i2c = require('i2c-bus');

class I2CCommunication {
    constructor(address) {
        this.address = address;
        this.i2c = i2c.openSync(1);
    }

    writeByteData(cmd, data) {
        this.i2c.writeByteSync(this.address, cmd, data);
    }

    readByteData(cmd) {
        return this.i2c.readByteSync(this.address, cmd);
    }
}

module.exports = I2CCommunication;