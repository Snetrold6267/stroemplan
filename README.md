# StrømPlan v4

En dansk energiplanlægger til Android/iOS. Fokus er handling frem for rå elpris: hvad skal køre hvornår?

## Med i v4
- I dag / Planlæg / Priser / Husstand / Mere
- DK1/DK2
- 15-minutters planlægningsmotor
- vask, opvask, tørretumbler
- elbilmodel (batteri, SoC, mål, kW, deadline)
- plads til varmepumpe, spa/pool, solceller og hjemmebatteri
- individuelle notifikationstidspunkter
- Energinet-backend med cache og tydelig spotpris-mode
- EAS build-konfiguration til intern Android/iOS-test
- privacy-udkast og miljøvariabler

## Vigtigt om priser
Backend viser spotpris som spotpris. Appen må først kalde en pris “samlet”, når net-, afgift-, moms- og leverandørprofil faktisk er konfigureret. Det undgår falske priser.

## Start lokalt
Server:
```
cd server
npm install
npm start
```
App:
```
npm install
# sæt EXPO_PUBLIC_STROEMPLAN_API til serverens adresse
npm start
```

## Installerbar test
Installer Expo/EAS CLI, log ind på den udviklerkonto der skal eje appen, og kør `eas build -p android --profile preview`. Apple-build kræver Apple Developer-signering.

## Det der kræver ejerens eksterne konti før offentlig drift
1. Hosting/domæne til API.
2. Valgt login/database/push-tjeneste og produktionsnøgler.
3. Google Play Console-konto og signering.
4. Apple Developer-konto/signering for App Store.
5. Endelig privatlivspolitik med juridisk ejer/kontakt.

Kilde til energidata: Energinet / Energi Data Service (CC BY 4.0).
