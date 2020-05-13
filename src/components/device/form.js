import React from 'react';
import {Container,Row,Col} from 'react-bootstrap';
import { connect } from 'react-redux'
import {onSendToDevice,onTargetPositionChanged, getDeviceStatus, onDisconnect} from '../../actions/index.js';

const FullDeviceForm = ({device, onGoClicked, onTargetPositionChanged, statusMessage, onDisconnectClicked}) =>
<div>
  <EmptyDeviceForm device={device} onGoClicked={onGoClicked} onTargetPositionChanged={onTargetPositionChanged} statusMessage={statusMessage} onDisconnectClicked={onDisconnectClicked} />
</div>

const  EmptyDeviceForm = ({device, onGoClicked, onTargetPositionChanged, statusMessage, onDisconnectClicked}) =>   {
  const noDeviceMarkup = <div className='bg-secondary text-light rounded '  >{statusMessage}</div>
  if (!device )
  {
  return noDeviceMarkup
  }
  else {
        if (!device.serialNo){
          return noDeviceMarkup
        }
        else{
            return <DeviceForm device={device} onGoClicked={onGoClicked} onTargetPositionChanged={onTargetPositionChanged} statusMessage={statusMessage} onDisconnectClicked={onDisconnectClicked}/>
        }
  }
}


export const  DeviceForm = ({device, onGoClicked, onTargetPositionChanged, statusMessage, onDisconnectClicked}) =>
<Container className='bg-secondary text-light rounded ' >
    <form>
    <Row  >
    <Col ><h3>{device.description} ({device.productCode}) - s/n {device.serialNo}</h3></Col>
  </Row>
    <Row>
      <Col  className='text-right' xs={5} >Current Position</Col>
      <Col className='text-left' xs={5} data-testid="currentPosition" >{device.currentPosition}</Col>
    </Row>
    <Row className='form-group '>
      {/*Had to put outside of form to prevent horizontal stacking*/}
        <Col className='text-right' xs={5}  ><label htmlFor='targetPosition'>Set Position</label></Col>
        <Col xs={5} >


          <div className='input-group'>
          <input type='text' className='form-control' onChange={(e) => onTargetPositionChanged(e.target.value)}   />
          <span className='input-group-btn' >
            <button className='btn btn-dark' onClick={(e)=>{e.preventDefault(); onGoClicked();}} >Go</button>
          </span>
          </div>
        </Col>
    </Row>
      <Row ><Col className='text-left' >Status:{statusMessage}</Col>
      </Row>
      <Row ><Col> <button className='btn btn-dark' onClick={(e)=>{e.preventDefault(); onDisconnectClicked();}} >Disconnect</button></Col>
      </Row>
      </form>
</Container>


const mapStateToProps = (state) => {
      //console.log ('mapstatetodeviceprops called')
      //Note object level introduced by combine reducers
      return { device: state.deviceReducer.device, statusMessage: state.deviceReducer.statusMessage}
}

export const ConnectedDeviceForm =  connect(
  mapStateToProps,
  {onGoClicked:onSendToDevice,onTargetPositionChanged:onTargetPositionChanged,onDisconnectClicked:onDisconnect}
)(FullDeviceForm)
//export default ConnectedDeviceForm
