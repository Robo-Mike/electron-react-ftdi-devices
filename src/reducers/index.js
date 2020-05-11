import { combineReducers } from 'redux'
import * as types from "../constants/actiontypes.js"
import {Data as DeviceInfoListData}  from '../services/deviceinfolistdata.js'


const initialDeviceState = {statusMessage:'not connected',device:{serialNo: 0, description: '', productCode: '', currentPosition: 0, connected: false, targetPosition:0}, ftdiHandle: null}
//DEVICE STATE reducer

const deviceReducer = (state = initialDeviceState, action) => {
  //console.log('device reducer received action ' + action.type)
  switch(action.type)
  {

    case types.DEVICE_CONNECTED:
        //console.log('device reducer action device serial no is ' + action.device.serialNo)
        return { statusMessage: 'connected' , device:action.device, ftdiHandle: action.ftdiHandle}
    case types.RECEIVED_DEVICE_STATUS:
        return { statusMessage: state.statusMessage ,device: {...state.device, currentPosition : action.currentPosition }, ftdiHandle: state.ftdiHandle}
    case types.SET_DEVICE_POSITION:
      return { statusMessage: state.statusMessage ,device: {...state.device, targetPosition : action.targetPosition  }, ftdiHandle: state.ftdiHandle}
    case types.SELECTING_DEVICE:
        return {  ...initialDeviceState,statusMessage: 'connecting', ftdiHandle: state.ftdiHandle}
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
