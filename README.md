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
| Audio on/off | `M` | — | pulsante sotto il gioco |

Il gioco riconosce automaticamente i controller Xbox, PlayStation, Switch Pro e la maggior parte dei joypad USB o Bluetooth: basta collegarlo e premere un tasto. Quando subisci danni, il controller vibra (se lo supporta).

- **A terra** il bastone colpisce in avanti.
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
- **6 boss**, ognuno con il suo schema d'attacco
- **Selettore dei livelli**: ogni livello si sblocca quando lo raggiungi nella storia
- **Galleria dei personaggi**: le schede di Barux, dei boss e dei 12 tipi di scagnozzi si sbloccano quando li sconfiggi
- **25 obiettivi** divisi in Storia, Abilità, Combattimento, Collezione e Segreti, con notifica in gioco e barre di avanzamento
- **Menu dei trucchi**: 99 vite, invincibilità e uccisione istantanea. Con i trucchi attivi gli obiettivi sono in pausa.
- **Salvataggio automatico** dei progressi nel browser
- Funziona su **computer, tablet e telefono**, con comandi touch e **supporto ai controller**

## Salvataggi

I progressi (livelli sbloccati, personaggi scoperti, obiettivi, trucchi) vengono salvati nel `localStorage` del browser. Non ci sono account né server, quindi:

- cambiando browser o dispositivo si riparte da zero;
- cancellando i dati di navigazione del sito si perdono i progressi.

## Struttura del progetto

Il progetto usa [Vite](https://vitejs.dev/) come server di sviluppo e per la build.

```
barone-barux/
├── index.html                 ← pagina del gioco (canvas e comandi touch)
├── src/
│   ├── main.js                ← logica, grafica, livelli, musica
│   ├── style.css              ← stile della pagina
│   └── assets/
│       └── danno_barone.mp3   ← suono del danno
├── public/
│   └── favicon.svg
├── .github/workflows/deploy.yml  ← pubblicazione automatica su GitHub Pages
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
npm run build     # crea la versione da pubblicare nella cartella dist/
npm run preview   # prova in locale la versione di dist/
```

## Pubblicazione su GitHub Pages

La pubblicazione è automatica grazie a GitHub Actions:

1. Carica il progetto nel repository (la cartella `node_modules` e `dist` sono già escluse da `.gitignore`).
2. Nel repository apri **Settings → Pages** e in **Source** scegli **GitHub Actions**.
3. A ogni push sul branch `main` il gioco viene compilato e pubblicato in un paio di minuti. Puoi seguire l'avanzamento nella scheda **Actions**.

## Crediti

Ideato da [MarcoLaduu](https://github.com/MarcoLaduu).
Sviluppato con l'aiuto di Claude (Anthropic).
