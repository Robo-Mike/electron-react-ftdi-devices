import {Data as DeviceInfoListData}  from './deviceinfolistdata.js'
//mix of require and imports yeuch note import doesnt work for ftdi addon module
//import * as FTD2XX from 'n-ftdi'
let FTD2XX = window.require('n-ftdi')


// async function Test(){
//   console.log( 'calling async get device list ')
//   const list = await FTD2XX.FTDI.getDeviceList()
//   console.log( 'real list retrieved ' + list.deviceList.length)
// }

//compare contrast explicit promise against async method style

export const getDeviceInfoList = async  () => {
  const myList = await FTD2XX.FTDI.getDeviceList()
  console.log('real list retrieved ' + myList.deviceList.length)
  return myList.deviceList.map((value,index) => ({serialNo: value.serialNumber, description: value.description, productCode: 'XYZ'}) )
}

export const getDeviceInfoListMock = () => {
  /*fake taking sometime and make non blockng with settimeout*/

  return new Promise((success, failure) => {
    setTimeout( ()=> { success( DeviceInfoListData ) } ,500)
  } )

}

export const openDeviceMock = (serialNo) => {
  /*fake taking sometime and make non blockng with settimeout*/
  const openedDevice = DeviceInfoListData.filter(device => device.serialNo === serialNo )[0]
  console.log('Opening device with serial no ' + openedDevice.serialNo)
  return new Promise((success, failure) => {
    setTimeout( ()=> { success( {...openedDevice, currentPosition : 5.0, connected : true, targetPosition : 0 } ) } ,500)
  } )
}

export const openDevice = async (serialNo) => {
  console.log('Opening device with serial no !'+ serialNo + '!')
  //think we need to move scope of this up so we can keep hold of handle x
  const ftdi = new FTD2XX.FTDI()
  const status =  await ftdi.openBySerialNumber(serialNo)
  console.log ('status =' + status + 'ftstatus ok = ' + FTD2XX.FT_STATUS.FT_OK )
  if (status === FTD2XX.FT_STATUS.FT_OK )
  {
    console.log ('getting device info' )
    //TODO wrap write and get status + read with APT function to get position
    const deviceInfo = await  ftdi.getDeviceInfo()

    return {serialNo: deviceInfo.serialNumber, description: deviceInfo.description, productCode: 'XYZ',currentPosition : 5.0, connected : true, targetPosition : 0 }
  }
  else {
    //TODO cant connect message
    return {}
  }
}
