import React from 'react'
import './App.css'
import {Container,Row,Col} from 'react-bootstrap'
import {ConnectedDeviceForm} from './components/device/form.js'
import ConnectedDeviceList from './components/device/list.js'

function App() {
  console.log('App is using React version ' + React.version )
  return (
    <div className='App'>
      <div className='page-header'>
      <h1>FTDI Device Demo</h1>
      </div>
      <Container >
        <Row>
          <Col xs={3} ><ConnectedDeviceList   /></Col>
          <Col xs={9} ><ConnectedDeviceForm  /></Col>

        </Row>
      </Container>
    </div>
  )
}


export default App
