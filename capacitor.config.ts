import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sahand.planapp',
  appName: 'Plan App',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
