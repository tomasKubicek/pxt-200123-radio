//% color="#2a9d8f" icon="\uf162" block="Utility" blockId="UtilityPslib"
namespace Utility {
    const ofset = 48;
    /*
    export enum Enum {
        //% block="comment"
        M1 = 0x3,
    }
    */

    /**
     * Get encoded serial number
    */
    //% blockId=encode_serial block="Get encoded serial number"
    export function encodeSerial(serialNumber?: number): string {
        let serialNo = serialNumber === undefined ? control.deviceSerialNumber() : serialNumber;
        if (serialNo < 0) {
            serialNo = (Math.pow(2, 31) - 1) + Math.abs(serialNo);
        }

        let output = "";
        for (let i = 0; serialNo > 0; i++) {
            let fraction = serialNo % Math.pow(64, i + 1);
            serialNo -= fraction;
            output = String.fromCharCode(fraction / Math.pow(64, i) + ofset) + output;
        }
        return output.length < 6 ? (String.fromCharCode(ofset) + output) : output;
    }

    /**
     * Decode serial number
    */
    //% blockId=decode_serial block="Decode serial number"
    export function decodeSerial(encodedSerial: string): number {
        const ofset = 48;
        let serialNumber = 0;
        if (encodedSerial.length === 0) return 0;
        for (let i = 0; i < encodedSerial.length; i++) {
            let charcode = encodedSerial.charCodeAt(i);
            if (charcode < ofset || charcode > ofset + 64) return 0;
            serialNumber += (charcode - ofset) * Math.pow(64, encodedSerial.length - (i + 1));
        }
        if (serialNumber > (Math.pow(2, 31) - 1)) {
            serialNumber = (Math.pow(2, 31) - 1) - Math.abs(serialNumber);
        }
        return serialNumber
    }
}