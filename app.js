"use strict";

const Homey = require("homey");

class CandelaApp extends Homey.App {
  onInit() {
    this.log("Cluster Lights App is running!");

    Homey.on("unload", () => {
      this.log("App unload.");
    });

    Homey.on("memwarn", () => {
      this.log("App memwarn.");
    });

    process.on("unhandledRejection", error => {
      this.log("unhandledRejection: ", error);
    });

    process.on("uncaughtException", error => {
      this.log("uncaughtException: ", error);
    });
  }
}

module.exports = CandelaApp;
