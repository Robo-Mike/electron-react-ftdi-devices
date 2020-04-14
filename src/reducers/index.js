import { combineReducers } from 'redux'
import * as types from "../constants/actiontypes.js"

export default combineReducers({
  deviceReducer,
  deviceInfoListReducer
})

const initialDeviceState = {serialNo: 0, description: '0', productCode: '', currentPosition: '', connected: false, targetPosition:0}
//DEVICE STATE reducer

const deviceReducer = (state = initialDeviceState, action) => {
  switch(action.type)
  {
    case DEVICE_CONNECTED:
        return action.device
    case RECEIVED_DEVICE_STATUS:
        return {...state, currentPosition : action.currentPosition }
    case SET_DEVICE_POSITION:
        return {...state, targetPosition : action.targetPosition }
    case SELECTING_DEVICE:
        return initialDeviceState
    // undefined initializes state
    default:
            return state
  }
}

const initialDeviceInfoListState = { deviceInfos:[],selectedSerialNo:0 }

const deviceInfoListReducer = (state = { []}, action) => {
  switch(action.type)
  {
    case GETTING_DEVICES:
        return initialDeviceInfoListState
    case RECEIVED_DEVICES:
        return {...state, deviceInfos : action.deviceInfos}
    default:
            return state
  }

}





//DEVICELIST STATE reducer
