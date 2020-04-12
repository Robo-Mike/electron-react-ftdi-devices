import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Container,Grid,Row,Col} from 'react-bootstrap';

const DEVICEINFOS = [{serialNo: 92000013, description: 'Integrated Precision Piezo Motor', productCode: 'CT1'}, {serialNo: 101000012, description: 'Integrated X Y Stage', productCode: 'MXY30'}]
const DEVICE = {serialNo: 92000013, description: 'Integrated Precision Piezo Motor', productCode: 'CT1', currentPosition: '0.5'}

function App() {
  return (
    <div className="App">
      <div class='page-header'>
      <h1>FTDI Device Demo</h1>
      </div>
      <Container >
        <Row>
          <Col xs={3} ><DeviceInfoList deviceInfos={DEVICEINFOS} /></Col>
          <Col xs={6} ><DeviceView device={DEVICE} /></Col>
        </Row>
      </Container>
    </div>
  );
}

//Es6 does an implicit return if no block statemnt
const  DeviceView = ({device}) =>
  <div class='img-rounded bg-info text-white' >
  <Container >
    <Row  >
    <Col>{device.description} ({device.productCode}) - s/n {device.serialNo}</Col>
  </Row>
    <Row>
      <Col>Current Position</Col>
      <Col>{device.currentPosition}</Col>
    </Row>
  </Container>
  </div>


const DeviceInfoList = ({deviceInfos}) =>
      <table class="text-left">
      {deviceInfos.map((item,key)=>
        <tr><td><DeviceInfoItem deviceInfo={item} /></td></tr>
       )}
      </table>


const DeviceInfoItem = ({deviceInfo}) =>
      <span>Serial No : {deviceInfo.serialNo}<br/>
      Description : {deviceInfo.description}<br/><br/></span>


export default App;
