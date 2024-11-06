const fs = require('fs');

class BaselineCalculation {
    constructor() {
        this.gBase = 0;
        this.tAmbient = 0;
        this.ambTempFlag = false;
    }

    calcBaselines(screen, measureData, gRes, newAmbTemp, forcedRun = false) {
        screen.clear();
        screen.displayText("Setting Baseline", 2);
        screen.show();

        try {
            if (!forcedRun) {
                const data = fs.readFileSync('baselines.txt', 'utf8').split('\r\n');
                this.gBase = parseFloat(data[0]);
                this.tAmbient = parseFloat(data[1]);
            } else {
                throw new Error("RUNNING BASELINE PROCESS");
            }
        } catch (error) {
            this.ambTempFlag = false;
            let burnInReadings = 0;
            let burnInData = 0;
            let ambTotal = 0;
            let progress = 0;

            while (burnInReadings < 60) {
                progress = Math.trunc((burnInReadings / 60) * 100);
                screen.clear();
                screen.displayText(`${progress}%`, 4, 50);
                screen.displayText("Setting Baseline", 2);
                screen.show();
                measureData();
                burnInData += gRes;
                ambTotal += newAmbTemp;
                setTimeout(() => {}, 5000);
                burnInReadings++;
            }

            this.gBase = burnInData / 60;
            this.tAmbient = ambTotal / 60;

            fs.writeFileSync('baselines.txt', `${this.gBase}\r\n${this.tAmbient}\r\n`);
            this.ambTempFlag = true;
        }

        screen.clear();
        screen.displayText("Setup Complete!", 2);
        screen.show();
        setTimeout(() => {
            screen.clear();
            screen.show();
        }, 2000);
    }
}

module.exports = BaselineCalculation;