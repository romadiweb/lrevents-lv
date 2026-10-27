# Sacensību reģistrācija

## Pasākuma sagatavošana CMS

1. Izveido un publicē sezonu, sacensību klases un rezultātu posmu. Atsevišķām sacensībām izmanto sezonu ar vienu posmu.
2. Sadaļā **Pasākumi** izveido pasākumu un laukā **Reģistrācijas rezultātu posms** izvēlies šo posmu. Posms var piederēt tikai vienam pasākumam.
3. Pievieno konkrētajām sacensībām piemērojamo nolikuma saiti un dalības informāciju, tostarp maksājumu kārtību. Maksa netiek aprēķināta un maksājums netiek iekasēts automātiski.
4. Norādi dalībnieku limitu. Noklusējums ir 80 cilvēki, neatkarīgi no viņu izvēlēto klašu skaita. Organizators var limitu mainīt; to nevar samazināt zem apstiprināto dalībnieku skaita.
5. Izvēlies statusu **Atvērta** un publicē pasākumu. Ja datumi nav norādīti, pieteikšanās sākas 30 dienas pirms pasākuma plkst. 00.00 un beidzas divas dienas pirms pasākuma plkst. 18.00 Latvijas laikā. Datumus var pielāgot pasākuma nolikumam. **Slēgta** aptur pieteikumus uzreiz; **Visas vietas aizņemtas** ļauj to norādīt arī manuāli.

Publiskā izvēlne **Pasākumi → Reģistrācija sacensībām** ved uz `/registracija`. Katram publicētam pasākumam ir sava forma `/pasakumi/[adrese]/registracija` un apstiprināto dalībnieku saraksts pasākuma lapā. Vecā adrese `/dalibnieki` novirza uz reģistrāciju.

## Pieteikumu izskatīšana

- CMS atveras sadaļā **Pieteikumi**. Skaitlis izvēlnē rāda jaunos, vēl neizskatītos pieteikumus un atjaunojas ik pēc 30 sekundēm, kamēr lapa ir redzama, kā arī atgriežoties logā. Tā ir CMS norāde, nevis e-pasta vai pārlūka push paziņojums.
- Atver pieteikumu, pārbaudi kontaktus, klases un dalībnieka identitāti. Jau iepriekš apstiprināts vārda/uzvārda un e-pasta pāris piesaistās esošajam profilam. Vienāds vārds bez pārbaudītas saistības ir tikai ieteikums: organizatoram jāizvēlas esošā persona vai skaidri jāapstiprina, ka tas ir cits cilvēks ar tādu pašu vārdu.
- Pirms apstiprināšanas atzīmē **Saņemta** dalības maksa vai **Atbrīvots no maksas**. Apstiprināšana vienā datubāzes transakcijā pārbauda brīvās vietas, piesaista personu, izveido tikai trūkstošos sezonas startus izvēlētajās klasēs un publicē dalībnieku sarakstā.
- Pieteikumus var arī noraidīt vai ievietot gaidīšanas sarakstā. Tie neaizņem apstiprināto dalībnieku vietas un netiek publicēti. Gaidīšanas saraksts netiek automātiski apstiprināts.
- Apstiprinātas dalības atcelšana atbrīvo vietu un noņem cilvēku no konkrētā pasākuma publiskā saraksta. Dalībnieka profils, sezonas starti un rezultāti saglabājas.

## Dalībnieki un rezultāti

**Dalībnieki** ir kopējais cilvēku reģistrs visām sezonām. **Sezonas starti** savieno vienu cilvēku ar konkrētu sezonu un klasi. Tādēļ vairāki posmi un vairākas klases nerada vairākus cilvēku profilus.

Reģistrācija nerada rezultātu ierakstus vai punktus. Rezultātus ievada sadaļā **Rezultāti**, izvēloties sezonu, posmu un jau esošo dalībnieka startu; braucienu laikus ievada sadaļā **Braucienu laiki**. Atkārtota reģistrācija nepārraksta sezonas starta auto, komandu, numuru vai vēsturiskos rezultātus. Pasākuma pieteikumā auto un numurs saglabājas atsevišķi. Ja sezonas starta dati jāprecizē, to dara apzināti CMS.

Pēc pirmā pieteikuma saņemšanas pasākuma rezultātu posmu un tā sezonas/pasākuma saistību mainīt nevar. Tas pasargā reģistrācijas un rezultātu sasaisti.

## Dati un aizsardzība

Publiskais saraksts ir atsevišķa tabula ar vārdu, uzvārdu, auto, klasēm, komandu un numuru. E-pasts, tālrunis, licences numurs, maksājuma statuss un pieteikuma pārbaudes dati ir pieejami tikai aktīviem CMS lietotājiem. Formā ir paskaidrota datu izmantošana un nolikuma apstiprinājums. Tas neaizstāj dokumentu parakstīšanu un pārbaudes sacensību dienā.

Pieteikumu pieņemšanas un izskatīšanas datubāzes funkcijas var izsaukt tikai serveris. Publiskā iesniegšana pārbauda vienas izcelsmes pieprasījumu, lauku garumus, klases, nolikuma versiju, pieejamību un atkārtotus pieteikumus. Pieteikumu biežuma ierobežojumam saglabā HMAC nospiedumu, nevis IP adresi; vecie skaitītāji tiek dzēsti nākamās iesniegšanas laikā. Var iestatīt atsevišķu `REGISTRATION_RATE_LIMIT_SECRET`; citādi izmanto servera Supabase atslēgu.

Kapacitāti pārbauda apstiprināšanas brīdī ar datubāzes rindas bloķēšanu. Arī divi vienlaicīgi apstiprinājumi nevar aizņemt vienu pēdējo vietu. Publiskais statuss atjaunojas periodiski; iesniegšanas brīdī vienmēr pārbauda aktuālo datubāzes stāvokli.

## Pārbaudes

`npm run test:registration` pārbauda PostgreSQL shēmu, pieejas tiesības, datu privātumu, termiņus, limitu, identitātes sasaisti, vienādus vārdus, maksas pārbaudi un sezonas vēstures saglabāšanu.

`node scripts/test-registration-live.mjs --run` pret lokālu produkcijas priekšskatījumu (pēc noklusējuma `http://localhost:3002`) izveido skaidri marķētus pagaidu datus, pārbauda API, CMS paziņojumus un vienlaicīgu pēdējās vietas apstiprināšanu, tad tos dzēš. `CMS_TEST_ORIGIN` ļauj izvēlēties citu localhost portu. `--hold` patur testa pasākumu vizuālai pārbaudei līdz Enter nospiešanai.
