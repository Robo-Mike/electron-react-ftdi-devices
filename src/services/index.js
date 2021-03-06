import {Data as DeviceInfoListData}  from './deviceinfolistdata.js'
import {wait} from '../utils/utils.js'
import * as apttypes from './aptconstants.js'
//mix of require and imports yeuch note import doesnt work for ftdi addon module
//import * as FTD2XX from 'n-ftdi'
//let APT = require ('./apt.js')
import Controller from './apt.js'
let FTD2XX = window.require('n-ftdi')


// async function Test(){
//   console.log( 'calling async get device list ')
//   const list = await FTD2XX.FTDI.getDeviceList()
//   console.log( 'real list retrieved ' + list.deviceList.length)
// }

//compare contrast explicit promise against async method style

export const getDeviceInfoList = async  () => {

  const iVID = 0x0403
  const iPID = 0xfaf0
  if (! (process.platform === 'win32'))
  {
    //!process.platform==='win32'
    // Would need to call multiple times with each VID/PID  used
    console.log('set vidpid result is' + await FTD2XX.FTDI.setVIdPId(iVID, iPID))
  }
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

export const getMessageResult = async (aptController) => {
  return await aptController.getMessage()
}


export const openDevice = async (serialNo) => {
  console.log('Opening device with serial no !'+ serialNo + '!')
  //APT needs these additional data characteristics which have been added to teh ftdi plugin
  const ftdi = new FTD2XX.FTDI(115200,FTD2XX.FT_FLOW_CONTROL.FT_FLOW_RTS_CTS,0x0,0x0)
  let status =  await ftdi.openBySerialNumber(serialNo)
  console.log ('status =' + status + 'ftstatus ok = ' + FTD2XX.FT_STATUS.FT_OK )
  if (status === FTD2XX.FT_STATUS.FT_OK )
  {
    //TODO too much going on here  without involving reducer I think
    console.log ('getting device info' )
    const deviceInfo = await  ftdi.getDeviceInfo()
    const aptController = new Controller(ftdi)
    status = await aptController.identifyDevice()
    console.log(' identify status = ' + status)

    let currentPosition = 0
    status = await aptController.requestStatusPzMot()
    console.log('requeststatus status = ' + status)
    await wait(500)
    // const ftGetStatusResult = await ftdi.getMessage()
    // if (ftGetStatusResult.isUpdate)
    // {
    //   currentPosition == ftGetStatusResult.position
    // }
    const messageResult = await getMessageResult(aptController)
    if (messageResult.messageType === apttypes.APT_PZMOT_GET_STATUS_UPDATE)
      currentPosition = messageResult.data.position
    console.log('currentPosition is ' + currentPosition )
    return { apt: aptController,
      device: {serialNo: deviceInfo.serialNumber, description: deviceInfo.description, productCode: 'XYZ',currentPosition : currentPosition, connected : true, targetPosition : 0 }}
  }
  else {
    //TODO cant connect message
    return {}
  }
}
