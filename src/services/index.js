import {Data as DeviceInfoListData}  from './deviceinfolistdata.js'
import {wait} from '../utils/utils.js'
import * as apttypes from './aptconstants.js'
//mix of require and imports yeuch note import doesnt work for ftdi addon module
//import * as FTD2XX from 'n-ftdi'
let FTD2XX = require('./n-ftdi-apt')


// async function Test(){
//   console.log( 'calling async get device list ')
//   const list = await FTD2XX.FTDI.getDeviceList()
//   console.log( 'real list retrieved ' + list.deviceList.length)
// }

//compare contrast explicit promise against async method style

export const getDeviceInfoList = async  () => {
  //uncomment to rebuild and kick program into life
  console.log('in get device info list ')
  const myList = await FTD2XX.FTDI.getDeviceList()
  console.log('getdeviceinfolist retrieved ' + myList.deviceList.length)
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

export const getMessageResult = async (ftdi) => {
  return await ftdi.getMessage()
}


export const openDevice = async (serialNo) => {
  console.log('Opening device with serial no !'+ serialNo + '!')
  //think we need to move scope of this up so we can keep hold of handle x
  const ftdi = new FTD2XX.FTDI()
  let status =  await ftdi.openBySerialNumber(serialNo)
  //console.log ('status =' + status + 'ftstatus ok = ' + FTD2XX.FT_STATUS.FT_OK )
  if (status === FTD2XX.FT_STATUS.FT_OK )
  {
    //TODO too much going on here  without involving reducer I think
    //console.log ('getting device info' )
    const deviceInfo = await  ftdi.getDeviceInfo()
    status = await ftdi.identifyDevice()
    //console.log(' identify status = ' + status)

    let currentPosition = 0
    status = await ftdi.requestStatusPzMot()
    //console.log('requeststatus status = ' + status)
    await wait(500)
    // const ftGetStatusResult = await ftdi.getMessage()
    // if (ftGetStatusResult.isUpdate)
    // {
    //   currentPosition == ftGetStatusResult.position
    // }
    const messageResult = await getMessageResult(ftdi)
    if (messageResult.messageType === apttypes.APT_PZMOT_GET_STATUS_UPDATE)
      currentPosition = messageResult.data.position
    //console.log('currentPosition is ' + currentPosition )
    return { ftdi: ftdi,
      device: {serialNo: deviceInfo.serialNumber, description: deviceInfo.description, productCode: 'XYZ',currentPosition : currentPosition, connected : true, targetPosition : 0 }}
  }
  else {
    //TODO cant connect message
    return {}
  }
}
