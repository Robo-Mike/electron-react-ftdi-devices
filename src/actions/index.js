import * as types from '../constants/actiontypes.js'
import {getDeviceInfoList,openDevice} from '../services/index.js'
//import {openDevice} from '../services/apt.js'

//action creator bindings
let requestStatusTimer
let getStatusTimer

const createGettingDeviceInfos = ()=> {
  return {type : types.GETTING_DEVICE_INFOS}
}

const createReceivedDeviceInfos = (deviceInfos) => {
  return {
    type: types.RECEIVED_DEVICE_INFOS,
    deviceInfos: deviceInfos
  }
}

const createSelectingDevice = (serialNo)=> {
  return {
    type: types.SELECTING_DEVICE,
    serialNo: serialNo
  }
}

const createDeviceConnected = (device)=> {
  return {
    type: types.DEVICE_CONNECTED,
    device: device
  }
}

const createReceivedDeviceStatus = (currentPosition)=> {
  return {
    type: types.RECEIVED_DEVICE_STATUS,
    currentPosition : currentPosition
  }
}

const createSetTargetPosition= (targetPosition)=> {
  return {
    type: types.SET_DEVICE_POSITION,
    targetPosition : targetPosition
  }
}

const createSendToDevice= ()=> {
  return {
    type: types.SEND_TO_DEVICE
  }
}


export const refreshDeviceInfoList = () => {
  console.log('Refresh device list called')
    return dispatch => {
    dispatch(createGettingDeviceInfos())
    getDeviceInfoList()
    .then(deviceInfos => {
      dispatch(createReceivedDeviceInfos(deviceInfos))}, obj => {/*todo getdeviceinfos error*/})
  }
}

export const onTargetPositionChanged = (targetPosition) => {
  return dispatch => {
    dispatch(createSetTargetPosition(targetPosition))
  }
}

export const onSendToDevice = (targetPosition) => {
  return dispatch => {
    dispatch(createSendToDevice(targetPosition))
    //TODo send set message but dont wait for response
    console.log("call set target here")
  }

}


//TODO services openDevice, getDeviceInfoList
//TOD0 handle errors add new opendeviceerror action type
export const onDeviceInfoListItemClicked = (serialNo) => {
  return dispatch => {
    dispatch(createSelectingDevice(serialNo))
    openDevice(serialNo)
    .then(obj => {dispatch(createDeviceConnected(obj.device))
                    onOpenDeviceSuccesfull(obj.ftdi)} , obj => {/*todo open device error*/} )
  }
}

const onOpenDeviceSuccesfull = (ftdi) => {

    //requestStatusTimer = setInterval(ftdi.requestStatusPzMot,100)
    //getStatusTimer = setInterval(()=>{getDeviceStatus(ftdi)},75)

}


export const getDeviceStatus = async (ftdi) => {
  let currentPosition = 0
  const ftGetStatusResult = await ftdi.getStatusPzMot()
  if (ftGetStatusResult.isUpdate)
  {
    return (dispatch) => {dispatch(createReceivedDeviceStatus(ftGetStatusResult.currentPosition))}
  }
}
