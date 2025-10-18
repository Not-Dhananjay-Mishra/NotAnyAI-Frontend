// webContainerService.js
// Singleton service to manage WebContainer instance across the app
// This ensures WebContainer boots only ONCE and stays alive

import { WebContainer } from "@webcontainer/api";

class WebContainerService {
  constructor() {
    this.instance = null;
    this.bootPromise = null;
    this.isBooting = false;
  }

  // Get or create the WebContainer instance
  async getInstance() {
    // If already booted, return immediately
    if (this.instance) {
      console.log("✓ Using cached WebContainer instance");
      return this.instance;
    }

    // If currently booting, wait for that to complete
    if (this.isBooting && this.bootPromise) {
      console.log("⏳ Waiting for WebContainer boot...");
      return this.bootPromise;
    }

    // Start booting
    this.isBooting = true;
    console.log("⚡ Booting WebContainer for the first time...");
    const startTime = performance.now();

    this.bootPromise = WebContainer.boot()
      .then((wc) => {
        this.instance = wc;
        this.isBooting = false;
        const endTime = performance.now();
        console.log(`✓ WebContainer booted in ${(endTime - startTime).toFixed(0)}ms`);
        return wc;
      })
      .catch((error) => {
        this.isBooting = false;
        this.bootPromise = null;
        console.error("Failed to boot WebContainer:", error);
        throw error;
      });

    return this.bootPromise;
  }

  // Check if instance is ready
  isReady() {
    return this.instance !== null;
  }

  // Optional: Teardown method (usually not needed)
  async teardown() {
    if (this.instance) {
      try {
        await this.instance.teardown();
        this.instance = null;
        this.bootPromise = null;
        this.isBooting = false;
        console.log("WebContainer torn down");
      } catch (error) {
        console.error("Error tearing down WebContainer:", error);
      }
    }
  }
}

// Export singleton instance
export const webContainerService = new WebContainerService();

// Optional: Pre-boot on app initialization for instant access
export const preBootWebContainer = async () => {
  try {
    await webContainerService.getInstance();
    console.log("✓ WebContainer pre-booted and ready!");
  } catch (error) {
    console.error("Pre-boot failed:", error);
  }
};