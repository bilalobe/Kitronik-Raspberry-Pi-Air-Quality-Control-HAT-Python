const KitronikSerial = require('./lib/KitronikSerial');
const KitronikBuzzer = require('./lib/KitronikBuzzer');
const KitronikADC = require('./lib/KitronikADC');
const KitronikZIPLEDs = require('./lib/KitronikZIPLEDs');
const KitronikRTC = require('./lib/KitronikRTC');
const KitronikGPIO = require('./lib/KitronikGPIO');
const KitronikHighPowerOut = require('./lib/KitronikHighPowerOut');
const KitronikServo = require('./lib/KitronikServo');
const KitronikOLED = require('./lib/KitronikOLED');
const KitronikBME688 = require('./lib/KitronikBME688');
const I2CCommunication = require('./lib/I2CCommunication');
const SensorInitialization = require('./lib/SensorInitialization');
const DataReading = require('./lib/DataReading');
const CompensationCalculations = require('./lib/CompensationCalculations');
const AirQualityCalculation = require('./lib/AirQualityCalculation');
const BaselineCalculation = require('./lib/BaselineCalculation');

module.exports = {
    KitronikSerial,
    KitronikBuzzer,
    KitronikADC,
    KitronikZIPLEDs,
    KitronikRTC,
    KitronikGPIO,
    KitronikHighPowerOut,
    KitronikServo,
    KitronikOLED,
    KitronikBME688,
    I2CCommunication,
    SensorInitialization,
    DataReading,
    CompensationCalculations,
    AirQualityCalculation,
    BaselineCalculation
};