import DeviceInfoListData  from './deviceinfolist.json'


export const getDeviceInfoList = () => {
  /*fake taking sometime and make non blockng with settimeout*/
  return new Promise((success, failure) => {
    setTimeout( ()=> { success( DeviceInfoListData ) } ,500)
  } )

}

export const openDevice = (serialNo) => {
  /*fake taking sometime and make non blockng with settimeout*/
  const openedDevice = DeviceInfoListData.filter(device => device.serialNo === serialNo )[0]

  return new Promise((success, failure) => {
    setTimeout( ()=> { success( {...openedDevice, currentPosition : 5.0, connected : true, targetPosition : 0 } ) } ,500)
  } )

}
