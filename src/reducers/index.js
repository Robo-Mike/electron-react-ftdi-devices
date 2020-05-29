import { combineReducers } from 'redux'
import * as types from "../constants/actiontypes.js"
import {Data as DeviceInfoListData}  from '../services/deviceinfolistdata.js'


const initialDeviceState = {statusMessage:'No device connected',device:{serialNo: 0, description: '', productCode: '', currentPosition: 0, connected: false, targetPosition:0}, aptHandle: null}
//DEVICE STATE reducer

const deviceReducer = (state = initialDeviceState, action) => {
  //console.log('device reducer received action ' + action.type)
  switch(action.type)
  {

    case types.DEVICE_CONNECTED:
        //console.log('device reducer action device serial no is ' + action.device.serialNo)
        return { statusMessage: 'connected' , device:action.device, aptHandle: action.aptHandle}
    case types.RECEIVED_DEVICE_STATUS:
        return { statusMessage: state.statusMessage ,device: {...state.device, currentPosition : action.currentPosition }, aptHandle: state.aptHandle}
    case types.SET_DEVICE_POSITION:
      return { statusMessage: state.statusMessage ,device: {...state.device, targetPosition : action.targetPosition  }, aptHandle: state.aptHandle}
    case types.SELECTING_DEVICE:
        return {  ...initialDeviceState,statusMessage: 'connecting', aptHandle: state.aptHandle}
    case types.DEVICE_DISCONNECTED:
        return {  ...initialDeviceState,statusMessage: action.statusMessage, aptHandle: null}
    // undefined initializes state
    default:
        return state
  }
}

const initialDeviceInfoListState = { deviceInfos:[],selectedSerialNo:0 }

const deviceInfoListReducer = (state = initialDeviceInfoListState, action ) => {
  // console.log('in deviceinfolist  reducer')
  // var devinfos =  DeviceInfoListData
  // console.log('deviceinfos length is ' + devinfos.length  )
  // return {deviceInfos:devinfos}
  //console.log('device info reducer received action' + action.type)
  switch(action.type)
  {
    case types.GETTING_DEVICE_INFOS:
        return {...state}
    case types.RECEIVED_DEVICE_INFOS:
        return {...state, deviceInfos : action.deviceInfos}
    default:
            return state
  }

}
export default combineReducers({
  deviceReducer,
  deviceInfoListReducer
})




//DEVICELIST STATE reducer
