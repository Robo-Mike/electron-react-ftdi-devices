import * as types from '../constants/actiontypes.js'
import * as apttypes from '../services/aptconstants.js'
import {getDeviceInfoList,openDevice} from '../services/index.js'
//import {openDevice} from '../services/apt.js'

//module scope variables  - perhaps these should be pushed into state
//TODO need to clear up in disconnect
let requestStatusTimer
let getStatusTimer


//action creator bindings
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

const createDeviceConnected = (device, apt)=> {
  return {
    type: types.DEVICE_CONNECTED,
    device: device,
    aptHandle : apt
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

const createDeviceDisconnected = (statusMessage)=> {
  return {
    type: types.DEVICE_DISCONNECTED,
    statusMessage:statusMessage
  }
}

/*BUSINESS LOGIC RELATING TO STATE CHANGES HERE*/


export const refreshDeviceInfoList = () => {
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

//
export const onSendToDevice = () => {
  return async ( dispatch, getState ) => {
    dispatch(createSendToDevice())
    const apt = getState().deviceReducer.aptHandle
    const targetPosition = getState().deviceReducer.device.targetPosition
    const ftStatus = await apt.setMoveAbsolutePzMot(targetPosition)
    //console.log('set position status returned' + ftStatus)
  }

}


//TODO services openDevice, getDeviceInfoList
//TOD0 handle errors add new opendeviceerror action type
export const onDeviceInfoListItemClicked = (serialNo) => {
  return dispatch => {
    dispatch(createSelectingDevice(serialNo))
    openDevice(serialNo)
    .then(obj => {dispatch(createDeviceConnected(obj.device, obj.apt))
                    onOpenDeviceSuccesfull(obj.apt, dispatch)} , obj => {/*todo open device error*/} )
  }
}

const onOpenDeviceSuccesfull = (apt, dispatch) => {
    requestStatusTimer = setInterval(() => {apt.requestStatusPzMot()},250)
    getStatusTimer = setInterval(()=>{getDeviceStatus(apt, dispatch)},250)
}
//These functions have a dependency on being connected to the store (i.e. being enlisted in the connect method)
//Redux thunk populates the returned function with the dispatch and getstate
export const onDisconnect =  () => {
  if (requestStatusTimer)
    clearInterval(requestStatusTimer)
  if (getStatusTimer)
    clearInterval(getStatusTimer)
  return async (dispatch, getState) => {
    const apt = getState().deviceReducer.aptHandle
    if (apt)
    {
      const ftStatus = await apt.close()
      console.log('close status is' + ftStatus)
      //TODO get rid of magic number import FT_STATUS
      if (ftStatus === 0)
      {
        dispatch(createDeviceDisconnected('Disconnected succesfully'))
        return 0
      }
    }
    dispatch(createDeviceDisconnected('There was a problem disconnecting'))
  }

}





export const getDeviceStatus = async (ftdi, dispatch) => {
  const messageResult = await ftdi.getMessage()
  console.log('getdevicestatus called')
  if (messageResult.messageType === apttypes.APT_PZMOT_GET_STATUS_UPDATE)
  {
    if (messageResult.data.isUpdate)
    {
        dispatch(createReceivedDeviceStatus(messageResult.data.position))
    }
  }

}
