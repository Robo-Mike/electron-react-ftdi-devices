import React from 'react'
import { shallow , mount } from 'enzyme'
import {DeviceForm} from './form.js'

const testProps = {serialNo:92000013, description:'Some Device',productCode:'XYZ', currentPosition:'87'}

const setup = props => {
  var component = mount(  <DeviceForm device={props} /> )
  return component
}

describe('device form ', () => { it('shows current position', ()=> {
  const component = setup(testProps)

  const element = component.find('h3')
  console.log(element.get(0))
  //expect(element.includes('X')).toBe(true)
  //const element = component.find('[data-testid="currentPosition"]') [0]
  //expect(element.text()).to.be.eql('87')
})})
