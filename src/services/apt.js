'use strict'
const apttypes  = require('./aptconstants.js')
let FT_STATUS = window.require('n-ftdi').FT_STATUS

  //TODO APT funcs refactor to new module
  /**
   * APT functionality requires a connected ftdi device
   */
  class Controller {
    constructor (ftdi) {
      this._ftdi = ftdi
    }

  async identifyDevice() {
      const txBuffer = Buffer.from([0x23, 0x02, apttypes.APT_DONT_CARE_BYTE, apttypes.APT_DONT_CARE_BYTE, apttypes.APT_NON_CARD_DESTINATION, apttypes.APT_NON_CARD_SOURCE])
      const numBytesToWrite = txBuffer.length
      //console.log(' bytes length is ' + numBytesToWrite)
      const ftStatus = await this._ftdi.write(txBuffer)
      return ftStatus.ftStatus
  }


  async requestStatusPzMot() {
      console.log('request devicestatus called')
      const txBuffer = Buffer.from([0xE0, 0x08, apttypes.APT_CHANNEL_ONE_IDENT, 0x00, apttypes.APT_NON_CARD_DESTINATION, apttypes.APT_NON_CARD_SOURCE])
      const ftStatus = await this._ftdi.write(txBuffer)
      return ftStatus.ftStatus
  }

//TODO memory implications of returning buffer initialised elsewhere
//TODO REFACTOR this to read buffer then extract message
  async getMessage() {
      const ftStatusResult = await this._ftdi.getStatus()
      let rxBuffer = Buffer.alloc(0)
      let isUpdate = false
      let position = 0
      console.log( 'getmessage  status result is ' + ftStatusResult.ftStatus + 'rx queue is' + ftStatusResult.rxQueue)
      if ( ftStatusResult.ftStatus === FT_STATUS.FT_OK && ftStatusResult.rxQueue > 0)
      {
        isUpdate = false
        rxBuffer = Buffer.alloc(ftStatusResult.rxQueue)
        //console.log( rxBuffer.length +  ' bytes in read buffer')
        const ftStatus = await this._ftdi.read(rxBuffer)

        if ( rxBuffer.length >= 6 )
        {
          //if (rxBuffer[0] === 0xE1 && rxBuffer[1] === 0x08)
          if (rxBuffer[0] === (apttypes.APT_PZMOT_GET_STATUS_UPDATE & 0xFF ) & ( rxBuffer[1] ===  apttypes.APT_PZMOT_GET_STATUS_UPDATE >> 8) )
          {
            //0x08E1 = MGMSG_PZMOT_GET_STATUSUPDATE
            //TO Do any libraries for multibyte number?
            position = rxBuffer[8]  + (rxBuffer[9] << 8) +  (rxBuffer[10] << 16 ) + (rxBuffer[11] << 24 )
            isUpdate = true
          }
          else {
            console.log('Received unhandled message byte[0]=0x' +  rxBuffer[0].toString(16)  + ' byte[1]=0x' + rxBuffer[1].toString(16) )
          }
        }
        //console.log('get status position bytes are '+ rxBuffer[7] + '|'  + rxBuffer[8] + '|' + rxBuffer[9] + '|' + rxBuffer[10] + '|' + rxBuffer[11]  )

      }
      return { messageType: apttypes.APT_PZMOT_GET_STATUS_UPDATE, data:{ isUpdate : isUpdate , position : position}}
  }

  debugBuffer(buf) {
    //DEBUG
    for (let i = 0; i < buf.length; i++)
    {
      console.log('byte [' + i +'] value = ' + buf[i] )
    }
  }



  async setMoveAbsolutePzMot(targetPosition) {

      const header = Buffer.from([0xD4, 0x08, 0x06, 0x00, apttypes.APT_NON_CARD_PZ_MOV_DESTINATION, apttypes.APT_NON_CARD_SOURCE])
      const channelIdent = Buffer.from([apttypes.APT_CHANNEL_ONE_IDENT, 0x00])
      const posBytes = Buffer.alloc(4)
      //Get position bytes from decimal
      posBytes[0] = targetPosition & 0xFF
      posBytes[1] = (targetPosition >> 8) & 0xFF
      posBytes[2] = (targetPosition >> 16) & 0xFF
      posBytes[3] = (targetPosition >> 24) & 0xFF
      const arr = [header, channelIdent, posBytes]
      const txBuffer = Buffer.concat(arr)
      //this.debugBuffer(txBuffer)
      const ftStatus = await this._ftdi.write(txBuffer)
      //console.log('in  setMoveAbsolutePzMot status is ' + ftStatus)
      return ftStatus.ftStatus
  }

  async close() {
    return await this._ftdi.close()

  }

}//Class controller

export default Controller
