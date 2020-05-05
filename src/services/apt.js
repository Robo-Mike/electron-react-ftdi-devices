let FTD2XX = window.require('n-ftdi')

//stateful component
let ConnectedDevice

const NON_CARD_DESTINATION = 0x50
const NON_CARD_SOURCE = 0x01
const CHANNEL_ONE_IDENT = 0x00


export const openDevice = async (serialNo) => {
  console.log('Opening device with serial no !'+ serialNo + '!')
  //think we need to move scope of this up so we can keep hold of handle x
  ConnectedDevice = new FTD2XX.FTDI()
  const status =  await ConnectedDevice.openBySerialNumber(serialNo)
  console.log ('status =' + status + 'ftstatus ok = ' + FTD2XX.FT_STATUS.FT_OK )
  if (status === FTD2XX.FT_STATUS.FT_OK )
  {

    //TODO wrap write and get status + read with APT function to get position
    const deviceInfo = await  ConnectedDevice.getDeviceInfo()

    console.log ('setting device baud rate' )

    const identifyStatus = await identifyDevice()
    console.log(' identify status = ' + identifyStatus)
    return {serialNo: deviceInfo.serialNumber, description: deviceInfo.description, productCode: 'XYZ',currentPosition : 5.0, connected : true, targetPosition : 0 }
  }
  else {
    //TODO cant connect message

    return {}
  }
}


export const identifyDevice = async() => {
    const txBuffer = Buffer.from([0x23, 0x02, CHANNEL_ONE_IDENT, 0x00, NON_CARD_DESTINATION, NON_CARD_SOURCE])
    const numBytesToWrite = txBuffer.length
    console.log(' bytes length is ' + numBytesToWrite)
    const ftStatus = await ConnectedDevice.write(txBuffer)
    return ftStatus.ftStatus
}
