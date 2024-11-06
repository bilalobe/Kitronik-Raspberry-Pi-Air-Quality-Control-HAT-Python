const KitronikBME688 = require('KitronikBME688');
const KitronikOLED = require('KitronikOLED');

console.log("BME688");

// Initialise the BME688 sensor
const bme688 = new KitronikBME688();
// Initialise the OLED display
const oled = new KitronikOLED();
// Calculate the baseline values for the BME688 sensor
bme688.calcBaselines(oled); // Takes OLED as input to show progress

// Measure the sensor every second
setInterval(() => {
    // Update the sensor values
    bme688.measureData();
    oled.clear();
    // Read and output the sensor values to the OLED display
    oled.displayText("Temperature:" + bme688.readTemperature(), 1);
    oled.displayText("Pressure:" + bme688.readPressure(), 2);
    oled.displayText("Humidity:" + bme688.readHumidity(), 3);
    oled.displayText("eCO2:" + bme688.readeCO2(), 4);
    oled.displayText("Air Quality %:" + bme688.getAirQualityPercent(), 5);
    oled.displayText("Air Quality Score:" + bme688.getAirQualityScore(), 6);
    oled.show();

    // Read and output the sensor values
    console.log("Temperature:", bme688.readTemperature());
    console.log("Pressure:", bme688.readPressure());
    console.log("Humidity:", bme688.readHumidity());
    console.log("eCO2:", bme688.readeCO2());
    console.log("Air Quality %:", bme688.getAirQualityPercent());
    console.log("Air Quality Score:", bme688.getAirQualityScore());
}, 1000);