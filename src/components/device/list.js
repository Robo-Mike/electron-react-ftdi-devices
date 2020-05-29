import React, {useEffect} from 'react'
import { ListGroup} from 'react-bootstrap'
import {onDeviceInfoListItemClicked, refreshDeviceInfoList} from '../../actions/index.js'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

//NOTE using Destructuring curly brackets to extract releveant properties from parent object
//connect and mapstatetoprops as written wouldnt work without this (or alternatively replacing arguments with  redundant top level props object)
const DeviceList = ({deviceInfos, selectedSerialNo, refreshDeviceInfoList, onItemClicked}) =>
{
    // useEffect is pure function equivalent to  componentDidMount second argument is an array of  watched objects that if changed ANDED with the didmount
    // in  this case an empty array so it is not fired on each mounted event (which happens frequently)
    // set interval is used to do a timed fire of the refreshDeviceInfoList action
    // note the callback passed to useEffect actually returns a function this is called by React at unmont time (doesnt happen in this app)
    useEffect(()=>
    {const refreshInterval = setInterval(refreshDeviceInfoList,5000)
    return () => {
      console.log('un mounting list component')
      clearInterval(refreshInterval)
    }
   }
    , [])
    //TODO Add a status message to state
    return <ListGroup title={'List contains ' + deviceInfos.length + ' items'} >
          { (deviceInfos.length === 0) &&
            <ListGroup.Item className='bg-secondary text-light' >No devices Found (if you have device connected and are in dev/debugging please try a reload)</ListGroup.Item>}
            {
              deviceInfos.map((item,key)=>
              <ListGroup.Item className='bg-secondary text-light' active={selectedSerialNo===item.serialNo} key={item.serialNo} ><DeviceInfoItem deviceInfo={item} onItemClicked={onItemClicked} /></ListGroup.Item>
             )
            }
      </ListGroup>
}

//Some type checking error is loged to console is property not supplied
DeviceList.propTypes = {
  deviceInfos:PropTypes.array.isRequired,
  refreshDeviceInfoList: PropTypes.func.isRequired
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
//NOTE refreshDeviceInfoList is not actually called by the UI, rather by a timer process

const ConnectedDeviceList = connect(
  mapStateToDeviceListProps ,
  {onItemClicked:onDeviceInfoListItemClicked, refreshDeviceInfoList:refreshDeviceInfoList}
)(DeviceList)




export default ConnectedDeviceList;
