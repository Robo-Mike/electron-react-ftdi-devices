import React, {useEffect} from 'react';
import './App.css';
import {Container,Row,Col, ListGroup} from 'react-bootstrap';
import {onDeviceInfoListItemClicked, onDeviceInfoListMounted} from './actions/index.js';
import { connect } from 'react-redux'

function App() {
  return (
    <div className='App'>
      <div className='page-header'>
      <h1>FTDI Device Demo</h1>
      </div>
      <Container >
        <Row>
          <Col xs={3} ><ConnectedDeviceInfoList   /></Col>
          <Col xs={9} ><ConnectedDeviceView  /></Col>
        </Row>
      </Container>
    </div>
  );
}

const FullDeviceView = ({device}) =>
<div>
  <div>Selected seial no is {device.serialNo}</div>
  <EmptyDeviceView device={device}  />
</div>


const  EmptyDeviceView = ({device}) =>   {
  const noDeviceMarkup = <div >No device selected</div>
  if (!device )
  {
  return noDeviceMarkup
  }
  else {
        if (!device.serialNo){
          return noDeviceMarkup
        }
        else{
            return <DeviceView device={device} />
        }
  }
}

//Es6 does an implicit return if no block statemnt
const  DeviceView = ({device}) =>
<Container className='rounded bg-info text-white border ' >
    <Row  >
    <Col ><h3>{device.description} ({device.productCode}) - s/n {device.serialNo}</h3></Col>
  </Row>
    <Row>
      <Col className='text-right' xs={5} >Current Position</Col>
      <Col className='text-left' xs={5} >{device.currentPosition}</Col>
    </Row>
    <Row className='form-group '>
      {/*Had to put outside of form to prevent horizontal stacking*/}
        <Col className='text-right' xs={5}  ><label htmlFor='targetPosition'>Set Position</label></Col>
        <Col xs={5} >

        <form>
          <div className='input-group'>
          <input type='text' className='form-control'  id='targetPosition'  />
          <span className='input-group-btn' >
            <button className='btn btn-secondary' type='submit'>Go</button>
          </span>
          </div>
        </form>

        </Col>
    </Row>
</Container>



//NOTE using Destructuring curly brackets to extract releveant properties from parent object
//connect and mapstatetoprops as written wouldnt work without this (or alternatively replacing arguments with  redundant top level props object)
const DeviceInfoList = ({deviceInfos, selectedSerialNo, onListMounted, onItemClicked}) =>
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

const DeviceInfoItem = ({deviceInfo, onItemClicked}) =>
      <span onClick={()=>{onItemClicked(deviceInfo.serialNo)}}  >Serial No : {deviceInfo.serialNo}<br/>
      Description : {deviceInfo.description}<br/>
      <br/><br/></span>


//todo seperate outin own file NOTE when binding ********** combine reducers adds level to object heirarchy
const mapStateToDeviceInfoListProps = (state) => {
    //debug
    //console.log ('mapstatetodeviceinfolist called')
    //console.log ('state.deviceInfos length is ' + state.deviceInfoListReducer.deviceInfos.length)
    return {
          deviceInfos: state.deviceInfoListReducer.deviceInfos,
        selectedSerialNo: state.deviceInfoListReducer.selectedSerialNo,
      }
    }
const mapStateToDeviceProps = (state) => {
      console.log ('mapstatetodeviceprops called')
      return { device: state.deviceReducer}
}



//NOTE *******connected version of the component needs to be used in markup, not the original DeviceInfoList

const ConnectedDeviceInfoList = connect(
  mapStateToDeviceInfoListProps ,
  {onItemClicked:onDeviceInfoListItemClicked, onListMounted:onDeviceInfoListMounted}
)(DeviceInfoList)


const ConnectedDeviceView =  connect(
  mapStateToDeviceProps,{onItemClicked:onDeviceInfoListItemClicked}
)(FullDeviceView)

export default App;
