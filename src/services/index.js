import {Data as DeviceInfoListData}  from './deviceinfolistdata.js'
//mix of require and imports yeuch note import doesnt work for ftdi addon module
//import * as FTD2XX from 'n-ftdi'
let FTD2XX = window.require('n-ftdi')


async function Test(){
  console.log(await 'real list retrieved ' + FTD2XX.FTDI.getDeviceList())
}

export const getDeviceInfoList = () => {
  /*fake taking sometime and make non blockng with settimeout*/
  Test()
  return new Promise((success, failure) => {
    setTimeout( ()=> { success( DeviceInfoListData ) } ,500)
  } )

}

export const openDevice = (serialNo) => {
  /*fake taking sometime and make non blockng with settimeout*/
  const openedDevice = DeviceInfoListData.filter(device => device.serialNo === serialNo )[0]
  console.log('Opening device with serial no ' + openedDevice.serialNo)
  return new Promise((success, failure) => {
    setTimeout( ()=> { success( {...openedDevice, currentPosition : 5.0, connected : true, targetPosition : 0 } ) } ,500)
  } )

}
