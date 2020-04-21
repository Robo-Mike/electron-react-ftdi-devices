import React from 'react';
import {Container,Row,Col} from 'react-bootstrap';
import { connect } from 'react-redux'


const FullDeviceForm = ({device}) =>
<div>
  <EmptyDeviceForm device={device}  />
</div>

const  EmptyDeviceForm = ({device}) =>   {
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
            return <DeviceForm device={device} />
        }
  }
}


export const  DeviceForm = ({device}) =>
<Container className='rounded bg-info text-white border ' >
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


const mapStateToProps = (state) => {
      console.log ('mapstatetodeviceprops called')
      //Note object level introduced by combine reducers
      return { device: state.deviceReducer}
}

export const ConnectedDeviceForm =  connect(
  mapStateToProps
)(FullDeviceForm)
//export default ConnectedDeviceForm
