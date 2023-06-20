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
      const mappedDiscoveredDevices = discoveredDevices.map((bleDevice) => ({
          name: `${PRESENTATION_NAME} ${bleDevice.address.substr(
            bleDevice.address.length - 5
          )}`,
          data: { id: bleDevice.uuid },
        }));

      return Promise.resolve(mappedDiscoveredDevices);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async onPair(session) {
    session.setHandler("list_devices", async () => {
      try {
        const devices = await this.discoverLights();

        if(devices.length) {
            return devices;
        }
        
        return [];
      } catch (error) {
        this.log(error);
      }
    });
  }
}

module.exports = CandelaBleDriver;
