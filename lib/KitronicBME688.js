const I2CCommunication = require("./I2CCommunication");
const SensorInitialization = require("./SensorInitialization");
const DataReading = require("./DataReading");
const CompensationCalculations = require("./CompensationCalculations");
const AirQualityCalculation = require("./AirQualityCalculation");
const BaselineCalculation = require("./BaselineCalculation");


class KitronikBME688 {
    constructor() {
        this.i2cComm = new I2CCommunication(0x77);
        this.sensorInit = new SensorInitialization(this.i2cComm);
        this.dataReading = new DataReading(this.i2cComm);
        this.compensationCalc = new CompensationCalculations();
        this.airQualityCalc = new AirQualityCalculation();
        this.baselineCalc = new BaselineCalculation();

        this.sensorInit.initialize();
    }

    measureData() {
        const tRaw = this.dataReading.readTemperature();
        const pRaw = this.dataReading.readPressure();
        const hRaw = this.dataReading.readHumidity();
        const gResRaw = this.dataReading.readGasResistance();
        const status = this.dataReading.readStatus();

        // Perform compensation calculations
        this.tRead = this.compensationCalc.calcTemperature(tRaw, this.PAR_T1, this.PAR_T2, this.PAR_T3);
        this.pRead = this.compensationCalc.intCalcPressure(pRaw, this.PAR_P1, this.PAR_P2, this.PAR_P3, this.PAR_P4, this.PAR_P5, this.PAR_P6, this.PAR_P7, this.PAR_P8, this.PAR_P9, this.PAR_P10);
        this.hRead = this.compensationCalc.intCalcHumidity(hRaw, this.tRead, this.PAR_H1, this.PAR_H2, this.PAR_H3, this.PAR_H4, this.PAR_H5, this.PAR_H6, this.PAR_H7);
        this.gRes = this.compensationCalc.intCalcgRes(gResRaw, this.gasRange);
    }

    getSensorData() {
        this.measureData();
        const data = {
            timestamp: new Date().toISOString(),
            temperature: this.readTemperature(),
            pressure: this.readPressure(),
            humidity: this.readHumidity(),
            gasResistance: this.readGasRes(),
            iaqPercent: this.getAirQualityPercent(),
            iaqScore: this.getAirQualityScore(),
            eCO2Value: this.readeCO2()
        };
        return JSON.stringify(data);
    }

    readTemperature(temperature_unit = "C") {
        let temperature = this.tRead;
        if (temperature_unit === "F") {
            temperature = ((temperature * 18) + 320) / 10;
        }
        return temperature;
    }

    readPressure(pressure_unit = "Pa") {
        let pressure = this.pRead;
        if (pressure_unit === "mBar") {
            pressure = pressure / 100;
        }
        return pressure;
    }

    readHumidity() {
        return this.hRead;
    }

    readGasRes() {
        if (!this.gasInit) {
            console.error("Setup Gas Sensor");
            return 0;
        }
        return this.gRes;
    }

    readeCO2() {
        if (!this.gasInit) {
            console.error("Setup Gas Sensor");
            return 0;
        }
        this.calcAirQuality();
        return this.eCO2Value;
    }

    getAirQualityPercent() {
        if (!this.gasInit) {
            console.error("Setup Gas Sensor");
            return 0;
        }
        this.calcAirQuality();
        return this.iaqPercent;
    }

    getAirQualityScore() {
        if (!this.gasInit) {
            console.error("Setup Gas Sensor");
            return 0;
        }
        this.calcAirQuality();
        return this.iaqScore;
    }

    calcAirQuality() {
        const { iaqPercent, iaqScore, eCO2Value } = this.airQualityCalc.calculateIAQ(this.hRead, this.gRes, this.gBase, this.tRead, this.tAmbient);
        this.iaqPercent = iaqPercent;
        this.iaqScore = iaqScore;
        this.eCO2Value = eCO2Value;
    }

    calcBaselines(screen, forcedRun = false) {
        this.baselineCalc.calcBaselines(screen, this.measureData.bind(this), this.gRes, this.newAmbTemp, forcedRun);
    }
}

module.exports = KitronikBME688;