//simple test of addon functionality - navigate to folder and type node <filename>
let FTD2XX = require('n-ftdi')
const obj =  new FTD2XX.FTDI
let status = obj.openBySerialNumberSync('97000008')
console.log ('Status is' + status)
