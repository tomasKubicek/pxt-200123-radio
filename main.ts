/*
Tlačítkem B nastav, jestli bude microbit beacon (vysílač) nebo normal (přijmač), tlačítkem AB potvď

Normal - Tlačítkem A pošli signál s kódem, Tlačítkem B se vrať o krok zpět - k minulému kódu - kdyby byl kód zfalšovaný

Beacon - reaguje na kód a posílá nové grp a codeArchive
*/

interface codeArchive {
    code?: number,
    grp?: number
}

radio.setTransmitPower(5)
radio.setFrequencyBand(7)
radio.setTransmitSerialNumber(true)
radio.setGroup(1)

let beacon = false
let beaconSet = false

const mySerial = Utility.encodeSerial(control.deviceSerialNumber())
console.log(mySerial)

//Switcher Beacon/Normal - jen pro testing - poté smazat a spustit pouze NormalSender()
input.onButtonPressed(Button.AB, () => {
    if (beaconSet)
    if (beacon) {
        BeaconSender()
    } else {
        NormalSender()
    }
    beaconSet = true
})

input.onButtonPressed(Button.B, () => {
    beacon = !beacon
    beacon ? basic.showString("B", 20) : basic.showString("N", 20)
    basic.clearScreen()
})
//Konec Switcheru */
//NormalSender()

//Normal

function NormalSender () {
    let codeArchive: codeArchive[] = []
    let nextCode = 7
    let nextGrp = 0
    let receiveGrpEnabled = false
    let jumpNext = false

    input.onButtonPressed(Button.A, () => {
        if (beacon) return
        radio.sendNumber(nextCode)
        whaleysans.showNumber(nextCode)
        basic.pause(1000)
        basic.clearScreen()
        /**/
    })

    input.onButtonPressed(Button.B, () => {
        codeArchive.pop()
        nextCode = codeArchive[codeArchive.length - 1].code
        nextGrp = codeArchive[codeArchive.length - 1].grp
        radio.setGroup(nextGrp)
    })
    /**/

    // beacon: 
    // <= "7" + serial
    //value = string { newgrp, newcode }, int = serial
    // => <encserial> : <newCode> & "grp" : <group>
    radio.onReceivedValue(function (recStr: string, recNum: number) {
        if (beacon) return
        if (recStr == mySerial) {
            if (recNum == 0) {
                basic.showString("W")
            } else {
                receiveGrpEnabled = true
                console.logValue("Received value", recStr + " : " + recNum + "\n\r")
                const remoteID = radio.receivedPacket(RadioPacketProperty.SerialNumber)
                console.logValue("Remote ID", remoteID + "\n\r")
                nextCode = recNum
                console.logValue("nextCode", nextCode)
                codeArchive.push({ code: recNum })
                whaleysans.showNumber(recNum)
            }

        } else if (recStr == "grp" && receiveGrpEnabled) {
            receiveGrpEnabled = false
            nextGrp = recNum
            console.logValue("Received grp", recNum + "\n\r")
            console.logValue("nextGrp", nextGrp)
            radio.setGroup(nextGrp)
            codeArchive[codeArchive.length - 1].grp = recNum
            codeArchive.forEach(code => console.log(code))
        }
    })
}


//Beacon 
function BeaconSender () {
    let groupCodes = [{ code: 7, grp: 1 }, { code: 21, grp: 3 }, { code: 48, grp: 21 }, { code: 89, grp: 14 }]
    let currentCode = 0
    console.logValue("Serial number", mySerial + "\n\r")

    radio.onReceivedNumber((recNum: number) => {
        if (recNum == groupCodes[currentCode].code) {
            currentCode++
            if(currentCode == 4) {
                radio.sendValue(Utility.encodeSerial(radio.receivedPacket(RadioPacketProperty.SerialNumber)), 0)
            } else {
                radio.sendValue(Utility.encodeSerial(radio.receivedPacket(RadioPacketProperty.SerialNumber)), groupCodes[currentCode].code)
                radio.sendValue("grp", groupCodes[currentCode].grp)
                basic.showString("T", 200)
                basic.clearScreen()
                radio.setGroup(groupCodes[currentCode].grp)
            }
        } else {
            basic.showString("F", 200)
            basic.clearScreen()
        }
    })

    basic.forever(function () {
        basic.pause(400)
        radio.sendValue(Utility.encodeSerial(randint(10, 9999999999)), 81)
        radio.sendValue("grp", 99)
        radio.sendNumber(7)

    })
}

