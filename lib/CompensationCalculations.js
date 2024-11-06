class CompensationCalculations {
    constructor() {
        this.t_fine = 0;
    }

    twosComp(value, bits) {
        if ((value & (1 << (bits - 1))) !== 0) {
            value = value - (1 << bits);
        }
        return value;
    }

    calcTemperature(tempADC, PAR_T1, PAR_T2, PAR_T3) {
        let var1 = (tempADC >> 3) - (PAR_T1 << 1);
        let var2 = (var1 * PAR_T2) >> 11;
        let var3 = ((((var1 >> 1) * (var1 >> 1)) >> 12) * (PAR_T3 << 4)) >> 14;
        this.t_fine = var2 + var3;
        let newAmbTemp = ((this.t_fine * 5) + 128) >> 8;
        return newAmbTemp / 100;
    }

    intCalcPressure(pressureADC, PAR_P1, PAR_P2, PAR_P3, PAR_P4, PAR_P5, PAR_P6, PAR_P7, PAR_P8, PAR_P9, PAR_P10) {
        let var1 = (this.t_fine >> 1) - 64000;
        let var2 = ((((var1 >> 2) * (var1 >> 2)) >> 11) * PAR_P6) >> 2;
        var2 = var2 + ((var1 * PAR_P5) << 1);
        var2 = (var2 >> 2) + (PAR_P4 << 16);
        var1 = (((((var1 >> 2) * (var1 >> 2)) >> 13) * (PAR_P3 << 5)) >> 3) + ((PAR_P2 * var1) >> 1);
        var1 = var1 >> 18;
        var1 = ((32768 + var1) * PAR_P1) >> 15;
        let pRead = 1048576 - pressureADC;
        pRead = ((pRead - (var2 >> 12)) * 3125);

        if (pRead >= (1 << 30)) {
            pRead = (pRead / var1) << 1;
        } else {
            pRead = ((pRead << 1) / var1);
        }

        var1 = (PAR_P9 * (((pRead >> 3) * (pRead >> 3)) >> 13)) >> 12;
        var2 = ((pRead >> 2) * PAR_P8) >> 13;
        var3 = ((pRead >> 8) * (pRead >> 8) * (pRead >> 8) * PAR_P10) >> 17;
        pRead = pRead + ((var1 + var2 + var3 + (PAR_P7 << 7)) >> 4);
        return pRead;
    }

    intCalcHumidity(humidADC, tempScaled, PAR_H1, PAR_H2, PAR_H3, PAR_H4, PAR_H5, PAR_H6, PAR_H7) {
        let var1 = humidADC - (PAR_H1 << 4) - (((tempScaled * PAR_H3) / 100) >> 1);
        let var2 = (PAR_H2 * (((tempScaled * PAR_H4) / 100) + (((tempScaled * ((tempScaled * PAR_H5) / 100)) >> 6) / 100) + (1 << 14))) >> 10;
        let var3 = var1 * var2;
        let var4 = ((PAR_H6 << 7) + ((tempScaled * PAR_H7) / 100)) >> 4;
        let var5 = ((var3 >> 14) * (var3 >> 14)) >> 10;
        let var6 = (var4 * var5) >> 1;
        let hRead = (var3 + var6) >> 12;
        hRead = (((var3 + var6) >> 10) * (1000)) >> 12;
        return hRead // 1000;
    }

    intCalcgRes(gasADC, gasRange) {
        let var1 = 262144 >> gasRange;
        let var2 = gasADC - 512;
        var2 = var2 * 3;
        var2 = 4096 + var2;
        let calcGasRes = ((10000 * var1) / var2);
        return calcGasRes * 100;
    }
}

module.exports = CompensationCalculations;