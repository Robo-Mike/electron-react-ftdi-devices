import React, {useEffect} from 'react'
import { ListGroup} from 'react-bootstrap'
import {onDeviceInfoListItemClicked, onDeviceInfoListMounted} from '../../actions/index.js'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

//NOTE using Destructuring curly brackets to extract releveant properties from parent object
//connect and mapstatetoprops as written wouldnt work without this (or alternatively replacing arguments with  redundant top level props object)
const DeviceList = ({deviceInfos, selectedSerialNo, onListMounted, onItemClicked}) =>
{
    // Similar to componentDidMount second argument is a watched object that triggers a refire so currently only gets called once
    useEffect(onListMounted, [])
    //TODO Add a status message to state
    return <ListGroup title={'List contains ' + deviceInfos.length + ' items'} className='text-left'>
          { (deviceInfos.length === 0) &&
            <ListGroup.Item >No devices Found</ListGroup.Item>}
            {
              deviceInfos.map((item,key)=>
              <ListGroup.Item active={selectedSerialNo===item.serialNo} key={item.serialNo} ><DeviceInfoItem deviceInfo={item} onItemClicked={onItemClicked} /></ListGroup.Item>
             )
            }
      </ListGroup>
}

//Some type checking error is loged to console is property not supplied
DeviceList.propTypes = {
  deviceInfos:PropTypes.array.isRequired,
  onListMounted: PropTypes.func.isRequired
}





const DeviceInfoItem = ({deviceInfo, onItemClicked}) =>
      <span onClick={()=>{onItemClicked(deviceInfo.serialNo)}}  >Serial No : {deviceInfo.serialNo}<br/>
      Description : {deviceInfo.description}<br/>
      <br/><br/></span>


//todo seperate outin own file NOTE when binding ********** combine reducers adds level to object heirarchy
const mapStateToDeviceListProps = (state) => {
    //debug
    //console.log ('mapstatetodeviceinfolist called')
    //console.log ('state.deviceInfos length is ' + state.deviceInfoListReducer.deviceInfos.length)
    return {
          deviceInfos: state.deviceInfoListReducer.deviceInfos,
        selectedSerialNo: state.deviceInfoListReducer.selectedSerialNo,
      }
    }



//NOTE *******connected version of the component needs to be used in markup, not the original DeviceInfoList

const ConnectedDeviceList = connect(
  mapStateToDeviceListProps ,
  {onItemClicked:onDeviceInfoListItemClicked, onListMounted:onDeviceInfoListMounted}
)(DeviceList)




export default ConnectedDeviceList;
