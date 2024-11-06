# Kitronik Air Quality Control HAT (Unofficial)

This package provides an interface to control the Kitronik Air Quality Control HAT using a Raspberry Pi; With _JavaScript_.

## Installation

```bash
npm install kitronik-air-quality-control-hat
```

# Example Usage

```js
const { KitronikBME688 } = require('kitronik-air-quality-control-hat');

const bme688 = new KitronikBME688();
const sensorData = bme688.getSensorData();
console.log(sensorData);
```

Full credit goes to https://github.com/KitronikLtd/Kitronik-Raspberry-Pi-Air-Quality-Control-HAT-Python

Kitronik (c)

