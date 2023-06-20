const Homey = require("homey");

const COMMAND_ON = Buffer.from("4340010101f4", "hex");
const COMMAND_OFF = Buffer.from("4340020101f4", "hex");
const COMMAND_DIM_HEADER = "4342";
const COMMAND_DIM_FOOTER = "0101f4";

const SERVICE_UUID = "0000fe8700001000800000805f9b34fb";
const SERVICE_NOTIFY_UUID = "8f65073d9f574aaaafea397d19d5bbeb";
const SERVICE_COMMAND_UUID = "aa7d3f342d4f41e0807f52fbf8cf7443";

class CandelaBle extends Homey.Device {
  onInit() {
    this.log("device init: ", this.getName(), "id:", this.getData().id);
    this.connectedBLEdevice = undefined;
    this.registerAtHomey();
  }

  async connectBleService() {
    try {
      const BLEdevice = await this.homey.ble.find(this.getData().id);

      this.log("Connecting to BLE device", BLEdevice);
      this.connectedBLEdevice = await BLEdevice.connect();

      const BleService = await this.connectedBLEdevice.getService(SERVICE_UUID);

      return Promise.resolve(BleService);
    } catch (error) {
      this.log(`error connecting because, ${error}`);
      return Promise.resolve(false);
    }
  }

  async sendCommand(command) {
    const BleService = await this.connectBleService();

    if (!BleService) {
      return Promise.resolve(false);
    }

    this.log(`Sending command: ${command.toString("hex")} to ${SERVICE_COMMAND_UUID}...`);
    await BleService.write(SERVICE_COMMAND_UUID, command).catch(error => {
      this.log(`Error sending command: ${command.toString("hex")} because of: ${error}`);
    });

    await this.connectedBLEdevice.disconnect().catch(error => {
      this.log(`Error disconnect(): ${error}`);
    });

    return Promise.resolve(true);
  }

  registerAtHomey() {
    this.registerCapabilityListener("onoff", async value => {
      this.log(`Power is set to: ${value}`);
      if (value) {
        await this.sendCommand(COMMAND_ON);
      } else {
        await this.sendCommand(COMMAND_OFF);
      }
      return Promise.resolve(true);
    });

    this.registerCapabilityListener("dim", async value => {
      this.log(`Brightness is set to ${value}`);

      const brightness = parseInt(100 * value);
      let command = "";
      if (brightness == 0) {
        command = COMMAND_OFF;
      } else {
        const brightnessHex = ("0" + Number(brightness).toString(16)).slice(-2);
        command = COMMAND_DIM_HEADER + brightnessHex + COMMAND_DIM_FOOTER;
      }
      let levelBuffer = Buffer.from(command, "hex");

      await this.sendCommand(levelBuffer); //this.ds.dimLevel(value));

      return Promise.resolve(true);
    });
  }
}

module.exports = CandelaBle;
