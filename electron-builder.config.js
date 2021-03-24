const now = new Date
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
    version: buildVersion,
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
