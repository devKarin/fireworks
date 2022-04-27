# javascript-fireworks
gotoAndPlay internship test assignment (April 2021).

## Assignment description summary (in English)
gotoAndPlay celebrates its 10th birthday this year.
Create a web application where on the foreground congratulations for gotoAndPlay are displayed and on the background is animated fireworks.
Use JavaScript or TypeScript and <canvas> or HTML/CSS.
You can personalize this assignment and add features as you like.

**Bonus 1:** gotoAndPlay logo, a number, text etc comes out from the fireworks.
**Bonus 2:** The firewors is interactive and reacts to the mouse move.

**NB! You can send us unfinished solutions and/or your assignment with unfinished features.**

As a response send us your repository link (it can be private if you prefer so) and write into the read.me how long did it take you to finish the test assignment and comment it.

## Setup
### 1. Git clone this repository
```bash
git clone https://github.com/karinjohanson/javascript-fireworks
```

### 2. Install dependencies
```bash
npm install
```
### 3. Start the server
```bash
npm run start
```

In order to start the server in ***development mode*** using `nodemon`
```bash
npm run start:dev
```

### 4. Open http://localhost:8080 in your browser and you should see my simple fireworks web application
You should see starry nightsky filled with colorful stars in different size, different moving speed, different moving direction.
See what happens when you move the mouse over the sky.

## Assignment description (in Estonian)
gotoAndPlay saab sel aastal 10 aastaseks.
Loo veebirakendus, kus esitaustal on õnnitlused gotoAndPlayle ja tagataustal on animeeritud ilutulestik.
Lahendus oleks soovitatav luua kasutades Javascripti (või eriti tublid võivad kasutada Typescripti) ja näiteks kas Canvase peale või HTML/CSS-iga.

Sul on vaba voli ise juurde mõelda, kuidas see kõik välja näeb, mis ja kuidas seal veel toimub, mismoodi täpsemalt lahendada jne.

**Boonus 1:** Ilutulestikust tuleb välja logo, number, tekst vms.
**Boonus 2:** Ilutulestik on interaktiivne ja hiire liigutusest võiks ilutulestiku käitumine muutuda. 

**NB! Vabalt võid saata ka poolikuid lahendusi, sh ka poolikult valminud boonuseid.** 

Soovime Sinult tagasi saada repo linki (soovi korral saad teha privaatse repo ja siis meiega jagada) ja read.me’sse info selle kohta, kuidas Sul läks ja kaua Sul läks aega ülesande lahendamiseks ehk siis palun lisa kommentaarid oma töö lahenduse kohta.

## Reflection (in Estonian)
Enne selle ülesandega alustamist, ei olnud ma HTML `<canvas>` elemendiga kokku puutunud, nii et minu jaoks oli tegu täiesti uue tehnoloogiaga.
Varasemalt olen ma paar väiksemat animatsiooni teinud, kasutades VanillaJS-i ja CSS-i.
Seekord otsustasin ma oma põhitööriistaks valida VanillaJS, aga ma arvan, et oleks huvitav proovida ka selliseid tööriistu nagu P5.js ja Fabric.js.
Kuigi ma alguses arvasin, et mõõdan täpselt, kui palju mul selle ülesandega tegelemiseks aega läheb, siis tegelikkuses ma vahel unustasin end sellega tegelema või tegelesin sellega muude tegevuste vahelt, nii et raske oli tagantjärele kulunud aega hinnata. See pani mind mõtlema sellele, et ma peaksin kasutusele võtma mõne vahendi, mis edaspidi võimaldaks mul arenduseks kulunud aega täpselt mõõta.

Kokku tegelesin ma selle ülesandega kahe nädala vältel umbes 8 päeva. Kõige vähem võttis aega koodi kirjutamine. Kõige rohkem võttis aega mõne spetsiifilise probleemi lahendamiseks lisainfo otsimine - ma teadsin, mida ma teha soovin ja teadsin umbmääraselt, mida ma selleks tegema pean, aga jäin hätta sobiva vahendi valimisega.
Kõige rohkem (umbes pool kulunud ajast) kulus mul tegelikult logoga seonduvatele teemadele - ma katsetasin erinevaid variante, kuidas ja kuhu logo kuvada, et see visuaalselt viisakas jääks. Viimaks otsustasin, et kuvan logo koos õnnitlustega ja muudan logo värvi vastavalt kirja värvile, kuid jäin hätta lahenduse leidmisega, mis ei pooks rakendust kinni ja samas muudaks dünaamiliselt logo värvi.
Seega võib minu lahenduse lugeda praegu päris lõpuni viimistlemata. Kui ma peaksin seda ülesannet tänaste teadmistega uuesti tegema, siis ma arvan, et mul kuluks selleks paar tundi.
Kõige huvitavam osa ülesandest oli osakeste (tähed, ilutulestiku alged, plahvatushetk, osakesed pärast plahvatust) liikumise kavandamine ja programmeerimine. Kuigi ma otsustasin tähtedele teha praegu lihtsustatud orbiidi (ringikujulise), siis minu jaoks oli see ikkagi põnev - ma ei ole varasemalt osakeste liikumist programeerinud.
Kokkuvõttes oli ülesanne väga arendav ja mul on hea meel, et ma selle lahendamise ette võtsin. 

## Reflection summary (in English)
Prior this test assignment I had no experience with HTML `<canvas>` tag - I had made only few animation fiddles with the help of VanillaJS and CSS. Using canvas technology was a completely new experience to me. I chose not to use any specific framework this time, but in the future I am interested in trying out other tools than just plain JS - P5.js and Fabric.js for example.
Since I didn't measure the time I spent for this test assignment, I can only estimate, that it took about 8 days within 2 weeks timeframe to create my application. Most of it I spent learning how to use new tools and to decide how should I display the logo. Finally I decided to display the logo alongside with the congratulations and to change the color of the logo along with the text color change. Unfortunately I ran out of time. I am aware that my application has a performance issue related to the unfinished part of the logo display. I consider my application unfinished.
The most interesting part of the assignment was to plan and code the movement of particles. Prior this assignment I had no experience in programming partical movement (including the logic behind the conditions), although I decided to go with the simplified circle-shaped orbit for the stars this time.
In summary, this was very interesting assignment and I am glad I took the challenge - it pushed me to develop my skills further. If I had to start the assignment all over again today, I think that it would took me few hours to finish.
