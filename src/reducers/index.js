import { combineReducers } from 'redux'
import * as types from "../constants/actiontypes.js"



const initialDeviceState = {serialNo: 0, description: '0', productCode: '', currentPosition: '', connected: false, targetPosition:0}
//DEVICE STATE reducer

const deviceReducer = (state = initialDeviceState, action) => {
  switch(action.type)
  {
    case types.DEVICE_CONNECTED:
        return action.device
    case types.RECEIVED_DEVICE_STATUS:
        return {...state, currentPosition : action.currentPosition }
    case types.SET_DEVICE_POSITION:
        return {...state, targetPosition : action.targetPosition }
    case types.SELECTING_DEVICE:
        return initialDeviceState
    // undefined initializes state
    default:
            return state
  }
}

const initialDeviceInfoListState = { deviceInfos:[],selectedSerialNo:0 }

const deviceInfoListReducer = (state = initialDeviceInfoListState, action ) => {
  switch(action.type)
  {
    case types.GETTING_DEVICE_INFOS:
        return initialDeviceInfoListState
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
