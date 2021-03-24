const { execSync } = require('child_process');

const now = new Date

const branch = execSync('git branch --show-current').toString().trim();
const buildVersion = `${now.getFullYear() - 2000}.${now.getMonth() + 1}.${now.getDate()}`

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
  directories: {
    output: 'dist',
    buildResources: 'buildResources',
  },
  files: [
    'packages/**/dist/**',
  ],
  extraMetadata: {
    version: `${buildVersion}-${branch}`,
  },
  win: {
    target: 'portable'
  },
  mac: {
    target: 'dmg'
  },
  appId: "com.electron.sgwsdataformatter",
  productName: "SGWS Data Formatter",
}

module.exports = config
