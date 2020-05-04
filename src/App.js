import React from 'react'
import './App.css'
import {Container,Row,Col} from 'react-bootstrap'
import {ConnectedDeviceForm} from './components/device/form.js'
import ConnectedDeviceList from './components/device/list.js'

function App() {
  console.log('App is using React version ' + React.version )
  return (
    <div className='App bg-dark '>

      <div className='navbar text-light bg-dark'>
      <h1>FTDI Device Demo</h1>
      </div>
      <Container  fluid >
        <Row>
          <Col xs={3} className='p-2'><ConnectedDeviceList   /></Col>
          <Col xs={9} className='p-2' ><ConnectedDeviceForm  /></Col>

        </Row>
      </Container>
    </div>
  )
}


export default App
