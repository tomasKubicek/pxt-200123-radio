/*
Tlačítkem B nastav, jestli bude microbit beacon (vysílač) nebo normal (přijmač), tlačítkem AB potvď
Normal - Tlačítkem A pošli signál s kódem, Tlačítkem B se vrať o krok zpět - k minulému kódu - kdyby byl kód zfalšovaný
Beacon - reaguje na kód a posílá nové grp a codeArchive
*/
//Switcher Beacon/Normal - jen pro testing - poté smazat a spustit pouze NormalSender()
let beacon = false
let beaconSet = false

input.onButtonPressed(Button.AB, () => {
    if (beaconSet) return;

    if (beacon) BeaconSender();
    else NormalSender();

    beaconSet = true
})

input.onButtonPressed(Button.B, () => {
    if (beaconSet) return;
    beacon = !beacon
    beacon ? basic.showString("B", 20) : basic.showString("N", 20)
    basic.clearScreen()
})
//Konec Switcheru */