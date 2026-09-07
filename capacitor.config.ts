import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.thetreeplanner.app',
  appName: 'The Tree Planner',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
