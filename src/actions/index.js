import * as types from '../constants/actiontypes.js'
import {getDeviceInfoList, openDevice} from '../services/index.js'

//action creator bindings

const createGettingDeviceInfos = ()=> {
  return {type : types.GETTING_DEVICEINFOS}
}

const createReceivedDeviceInfos = (deviceInfos) => {
  return {
    type: types.RECEIVED_DEVICES
    deviceInfos: deviceInfos
  }
}

const createSelectingDevice = (serialNo)=> {
  return {
    type: types.SELECTING_DEVICE
    serialNo: serialNo
  }
}

const createDeviceConnected = (device)=> {
  return {
    type: types.DEVICE_CONNECTED
    device: device
  }
}

const createReceivedDeviceStatus = (currentPosition)=> {
  return {
    type: types.RECEIVED_DEVICE_STATUS
    currentPosition : currentPosition
  }
}

const createSetDevicePosition= (targetPosition)=> {
  return {
    type: types.SET_DEVICE_POSITION
    targetPosition : targetPosition
  }
}
//TODO services openDevice, getDeviceInfoList
//TOD0 handle errors add new opendeviceerror action type
//ACTIONS proper TODO do i need to pass dispatch as argument or can I just return func??
export const onDeviceInfoListItemClicked = (serialNo) => {
  return dispatch => {
    dispatch(createSelectingDevice(serialNo))
    openDevice(serialNo)
    .then(device => {dispatch( createDeviceConnected(device))} , obj => {/*todo open device error*/} )

  }

}

export const onDeviceInfoListMounted = () => {
  return dispatch => {
    dispatch(createGettingDeviceInfos())
    getDeviceInfoList()
    .then(deviceinfos => {dispatch(createReceivedDeviceInfos(deviceInfos))}, obj = > {/*todo getdeviceinfos error*/})
  }
}
