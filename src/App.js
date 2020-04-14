import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Container,Grid,Row,Col, ListGroup} from 'react-bootstrap';
import {onDeviceInfoListItemClicked, onDeviceInfoListMounted} from './actions/index.js';
import { connect } from 'react-redux'

function App() {
  return (
    <div className='App'>
      <div class='page-header'>
      <h1>FTDI Device Demo</h1>
      </div>
      <DeviceViewer />
    </div>
  );
}

const DeviceViewer = ({ deviceInfos, device, onDeviceInfoListMounted, onDeviceInfoListItemClicked}) =>
<Container >
  <Row>
    <Col xs={3} ><DeviceInfoList deviceInfos={deviceInfos,onDeviceInfoListMounted,onDeviceInfoListItemClicked} /></Col>
    <Col xs={9} ><DeviceView device={device} /></Col>
  </Row>
</Container>




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
        <Col className='text-right' xs={5}  ><label for='targetPosition'>Set Position</label></Col>
        <Col xs={5} >

        <form>
          <div class="input-group">
          <input type='text' class='form-control'  id='targetPosition'  />
          <span class="input-group-btn" >
            <button class='btn btn-secondary' type='submit'>Go</button>
          </span>
          </div>
        </form>

        </Col>
    </Row>
</Container>



const DeviceInfoList = ({deviceInfos, selectedSerialNo, onDeviceInfoListItemClicked, onDeviceInfoListMounted}) =>
      <ListGroup class='text-left'>
      {deviceInfos.map((item,key)=>
        <ListGroup.Item active={selectedSerialNo==item.serialNo} ><DeviceInfoItem deviceInfo={item}  /></ListGroup.Item>
       )}
      </ListGroup>


const DeviceInfoItem = ({deviceInfo}) =>
      <span>Serial No : {deviceInfo.serialNo}<br/>
      Description : {deviceInfo.description}<br/><br/></span>



//todo seperate outin own file
const mapStateToDeviceInfoListProps = state => ({
        deviceInfos: state.deviceInfos,
        selectedSerialNo: state.selectedSerialNo,
      })

const mapStateToDeviceProps = state => ({
        device: state.device
      })
//todo will need to add the

export default connect(
  mapStateToDeviceInfoListProps ,
  {onDeviceInfoListItemClicked:onDeviceInfoListItemClicked, onDeviceInfoListMounted:onDeviceInfoListMounted}
)(DeviceInfoList)

export default connect(
  mapStateToDeviceProps
)(DeviceView)

export default App;
