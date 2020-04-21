import React from 'react'
import { shallow , mount , render} from 'enzyme'
import {DeviceForm} from './form.js'
import { expect} from 'chai';
const testProps = {device:{serialNo:92000013, description:'Some Device',productCode:'XYZ', currentPosition:'87'}}

const setup = (props) => {
  //Note weird syntax (i.e. no device=) anything passed is treated as top level props apparently
  const component = shallow(  <DeviceForm {...props} /> )
  return component
}

describe('device form ', () => { it('shows current position', ()=> {
  const component = setup(testProps)
  // console.log(component.props())
  // const element = component.find('h3')
  // console.log(element.get(0))
  // expect(element.includes(testProps.device.serialNo)).toBe(true)
  const element = component.find('[data-testid="currentPosition"]')
  console.log(element.text())
  expect(element.text()).to.equal('87')
})})
