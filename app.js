const Homey = require("homey");

class CandelaApp extends Homey.App {
  onInit() {
    this.log("Cluster Lights App is running!");
  }
}

module.exports = CandelaApp;
