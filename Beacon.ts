function BeaconSender() {
    const groupCodes = [nData(7, 1), nData(21, 3), nData(48, 21), nData(89, 14)]
    let currentCode = 0
    console.logValue("Serial number", mySerial + "\n\r")

    radio.onReceivedNumber((recNum: number) => {
        if (recNum == groupCodes[currentCode].code) { currentCode++; BeaconSend(groupCodes, currentCode); }
        else { basic.showString("F", 200); basic.clearScreen(); }
    })

    basic.forever(function () {
        basic.pause(500);
        radio.sendValue(Utility.encodeSerial(randint(10, 9999999999)), 81);
        radio.sendNumber(7);
    })
}

function BeaconSend(groupCodes: Data[], currentCode: number) {
    if (currentCode == groupCodes.length) {
        radio.sendValue(Utility.encodeSerial(radio.receivedPacket(RadioPacketProperty.SerialNumber)), 1)
    } else {
        radio.sendValue(Utility.encodeSerial(radio.receivedPacket(RadioPacketProperty.SerialNumber)), groupCodes[currentCode].code)
        radio.sendValue("grp", groupCodes[currentCode].grp)
        basic.showString("T", 200)
        basic.clearScreen()
        radio.setGroup(groupCodes[currentCode].grp)
    }
}