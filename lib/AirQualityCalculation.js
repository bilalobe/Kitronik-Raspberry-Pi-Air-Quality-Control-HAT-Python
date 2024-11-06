class AirQualityCalculation {
    constructor() {
        this.hBase = 40;
        this.hWeight = 0.25;
    }

    calculateIAQ(hRead, gRes, gBase, tRead, tAmbient) {
        let humidityScore = 0;
        let gasScore = 0;
        const humidityOffset = hRead - this.hBase;
        const ambTemp = tAmbient / 100;
        const temperatureOffset = tRead - ambTemp;
        const humidityRatio = (humidityOffset / this.hBase) + 1;
        const temperatureRatio = temperatureOffset / ambTemp;

        if (humidityOffset > 0) {
            humidityScore = (100 - hRead) / (100 - this.hBase);
        } else {
            humidityScore = hRead / this.hBase;
        }
        humidityScore = humidityScore * this.hWeight * 100;

        const gasRatio = gRes / gBase;
        if ((gBase - gRes) > 0) {
            gasScore = gasRatio * (100 * (1 - this.hWeight));
        } else {
            gasScore = Math.floor(70 + (5 * (gasRatio - 1)));
            if (gasScore > 75) {
                gasScore = 75;
            }
        }

        const iaqPercent = Math.trunc(humidityScore + gasScore);
        const iaqScore = (100 - iaqPercent) * 5;
        const eCO2Value = 250 * Math.pow(Math.E, (0.012 * iaqScore));

        return { iaqPercent, iaqScore, eCO2Value };
    }
}

module.exports = AirQualityCalculation;