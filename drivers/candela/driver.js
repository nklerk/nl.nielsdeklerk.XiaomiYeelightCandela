"use strict";

const Homey = require("homey");
const SERVICE_UUID = "fe87";
const PRESENTATION_NAME = "Ambiance Lamp";

class CandelaBleDriver extends Homey.Driver {
  onInit() {
    this.log("Initializing candela BLE driver.");
  }

  async discoverLights() {
    this.log("Discovering Candela BLE devices.");
    try {
      const discoveredDevices = await this.homey.ble.discover([SERVICE_UUID]);
      const mappedDiscoveredDevices = discoveredDevices.map(bleDevice => {
        const device = {
          name: `${PRESENTATION_NAME} ${bleDevice.address.substr(bleDevice.address.length - 5)}`,
          data: { id: bleDevice.uuid }
        };

        return device;
      });
      return Promise.resolve(mappedDiscoveredDevices);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  onPairListDevices(data, callback) {
    this.discoverLights()
      .then(deviceList => {
        callback(null, deviceList);
      })
      .catch(error => {
        callback(error);
      });
  }
}

module.exports = CandelaBleDriver;
