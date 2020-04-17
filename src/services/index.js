import {Data as DeviceInfoListData}  from './deviceinfolistdata.js'

export const getDeviceInfoList = () => {
  /*fake taking sometime and make non blockng with settimeout*/
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
