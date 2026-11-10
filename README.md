# 🎩 Il Barone Barux e la maledizione di Anlaucer

Un platform 2D in pixel art ambientato in un regno medievale, giocabile direttamente nel browser: niente da installare, niente da scaricare.

**▶ Gioca ora:** https://marcoladuu.github.io/theBaronPlatform/

---

## La storia

Nel borgo di Castelbarux viveva il **Barone Barux**, nobile elegantissimo dal cilindro più alto del reame.
Ma un brutto giorno il Barone fu *anlaciato* troppo… e tutto quell'anlaciamento risvegliò il demone **Anlaucer**, che arrivò con cinque scagnozzi a seminare il caos.

Riprenditi il regno, Barone. A colpi di bastone.

## Comandi

| Azione | Tastiera | Controller | Telefono / tablet |
|---|---|---|---|
| Muoversi | `←` `→` oppure `A` `D` | Croce direzionale o levetta sinistra | ◀ ▶ |
| Saltare | `Spazio`, `↑`, `W` o `Z` | A (Xbox) / ✕ (PlayStation) | A |
| Bastonata | `X`, `J` o `K` | X, B, Y / □, ○, △ | B |
| Pausa | `P` o `Esc` | Start / Options | II |
| Indietro nei menu | `Esc` | B / ○ | pulsante "Indietro" |
| Audio on/off | `M`, oppure l'icona 🔊 in basso a destra (menu principale e pausa) | icona 🔊 nei menu | tocca l'icona 🔊 nei menu |

La prima volta che giochi il Livello 1 compare la finestra **Come si gioca** con tutti i comandi, che si adatta a tastiera, touch o controller collegato; puoi riaprirla dal menu di pausa alla voce **Comandi**.

Il gioco riconosce automaticamente i controller Xbox, PlayStation, Switch Pro e la maggior parte dei joypad USB o Bluetooth: basta collegarlo e premere un tasto. Quando subisci danni, il controller vibra (se lo supporta).

- **A terra** il bastone traccia una mezzaluna davanti al Barone, dalla testa ai piedi.
- **In aria** il bastone traccia una mezzaluna che colpisce davanti, sopra e sotto.
- Puoi anche **saltare in testa** ai nemici, tranne a quelli pieni di spine.
- Il bastone distrugge anche alcuni proiettili nemici.

## I livelli

| # | Livello | Boss |
|---|---|---|
| 1 | La Città Vecchia | Pushing l'Esattore |
| 2 | Il Bosco Oscuro | Gankàla la Strega dei Rovi |
| 3 | La Palude delle Nebbie | Pushatomìdir il Rospo Mannaro |
| 4 | Le Miniere Abbandonate | Ser Rekter |
| 5 | La Torre del Campanaro | Griefilla |
| 6 | La Fortezza di Anlaucer | Anlaucer |

Ogni livello ha due checkpoint, piattaforme mobili, fosse, spuntoni e scagnozzi ispirati al boss di quella zona. Ogni 100 monete raccolte guadagni una vita.

## Funzionalità

- **6 livelli** con ambientazioni, nemici e musiche diverse
- **6 boss**, ognuno con il suo schema d'attacco; Anlaucer ha una seconda fase in cui si trasforma, incendia il pavimento e lancia il raggio anlacioso
- **Scegli da dove partire**: dopo aver sconfitto il boss di un livello puoi rigiocarlo dall'inizio o andare subito al boss
- **Pixel art con luci e ombre**: Barone, boss, scagnozzi e scenari ridisegnati con più tonalità
- **Personaggi animati**:
  - il Barone respira, sbatte le palpebre, corre con 4 passi, si raccoglie in salto, si schiaccia atterrando, si sbilancia quando colpisce, si piega quando viene colpito e alla sconfitta perde il cilindro;
  - i boss battono le ali, aprono la bocca quando attaccano, muovono gambe, code e pennacchi e sbattono le palpebre;
  - gli scagnozzi saltellano camminando, lampeggiano di bianco quando vengono colpiti e alla sconfitta si appiattiscono (se schiacciati) o volano via girando (se bastonati)
- **Menu principale animato**: il Barone cammina mentre la città scorre e ogni tanto saluta togliendosi il cilindro, il titolo ondeggia, salgono le braci e passano gli scagnozzi
- **Selettore dei livelli**: ogni livello si sblocca quando lo raggiungi nella storia
- **Galleria dei personaggi**: le schede di Barux, dei boss e dei 12 tipi di scagnozzi si sbloccano quando li sconfiggi
- **25 obiettivi** divisi in Storia, Abilità, Combattimento, Collezione e Segreti, con notifica in gioco e barre di avanzamento
- **Menu dei trucchi**: 99 vite, invincibilità e uccisione istantanea. Con i trucchi attivi gli obiettivi sono in pausa.
  Avviando il gioco in locale con `npm run dev` compare anche **Sblocca tutto**, che rende visibili livelli, personaggi e obiettivi senza toccare i salvataggi veri. Nella versione pubblicata non esiste.
- **Salvataggio automatico** dei progressi nel browser
- Funziona su **computer, tablet e telefono**, con comandi touch e **supporto ai controller**
- Su **telefono e tablet** si gioca in orizzontale: in verticale il gioco va in pausa e chiede di ruotare il dispositivo. Su Android al primo tocco passa a schermo intero e blocca l'orientamento.

## Salvataggi

I progressi (livelli sbloccati, personaggi scoperti, obiettivi, trucchi) vengono salvati nel `localStorage` del browser. Non ci sono account né server, quindi:

- cambiando browser o dispositivo si riparte da zero;
- cancellando i dati di navigazione del sito si perdono i progressi.

## Struttura del progetto

Il progetto usa [Vite](https://vitejs.dev/) come server di sviluppo e per la build.

```
barone-barux/
├── index.html
├── src/
│   ├── main.js              ← punto di ingresso
│   ├── mobile.js            ← orientamento orizzontale e schermo intero su telefono
│   ├── config.js            ← costanti (risoluzione, tile)
│   ├── state.js             ← stato condiviso della partita
│   ├── canvas.js · utils.js · input.js · save.js
│   ├── core/                ← ciclo di gioco, particelle
│   ├── entities/            ← giocatore, scagnozzi, boss, proiettili
│   ├── world/               ← ambientazioni, generatore dei livelli, collisioni
│   ├── graphics/            ← sprite e icone
│   ├── render/              ← disegno del mondo, HUD e schermate
│   ├── data/                ← obiettivi e galleria dei personaggi
│   ├── ui/                  ← posizioni degli elementi nei menu
│   ├── audio/               ← musica ed effetti sonori
│   ├── assets/danno_barone.mp3
│   └── style.css
├── public/                  ← icone del sito (favicon.svg, favicon-32.png, apple-touch-icon.png) e .nojekyll
├── scripts/deploy.js        ← build + commit + push
├── docs/                    ← versione compilata, pubblicata da GitHub Pages
├── vite.config.js
└── package.json
```

- Grafica in pixel art disegnata via codice su `<canvas>` (risoluzione interna 320×180)
- Musica ed effetti sonori generati con la Web Audio API
- Nessuna libreria a runtime; l'unica risorsa esterna è il font [Pixelify Sans](https://fonts.google.com/specimen/Pixelify+Sans) da Google Fonts

## Sviluppo

Serve [Node.js](https://nodejs.org/) 18 o superiore.

```bash
npm install       # installa Vite (solo la prima volta)
npm run dev       # avvia il gioco in locale con ricarica automatica
npm run build     # crea la versione da pubblicare nella cartella docs/
npm run preview   # prova in locale la versione di docs/
npm run deploy    # build + commit + push in un colpo solo
```

## Pubblicazione su GitHub Pages

La build viene generata nella cartella `docs/`, che GitHub Pages pubblica direttamente:

1. Lancia `npm run build`.
2. Fai commit e push del progetto, **inclusa la cartella `docs/`**.
3. La prima volta, nel repository apri **Settings → Pages** e imposta **Deploy from a branch** → branch **main** → cartella **/docs**.

Ogni volta che modifichi il gioco basta un solo comando, che fa build, commit e push:

```bash
npm run deploy                       # messaggio di commit automatico con data e ora
npm run deploy -- "Nuovo livello"     # messaggio personalizzato
```

Il sito si aggiorna in circa un minuto.

## Crediti

Ideato da [MarcoLaduu](https://github.com/MarcoLaduu).
Sviluppato con l'aiuto di Claude (Anthropic).
