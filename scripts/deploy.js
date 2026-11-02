// Deploy su GitHub Pages: build in docs/, commit e push.
// Uso:  npm run deploy                     -> messaggio automatico con data e ora
//       npm run deploy -- "nuovo livello"  -> messaggio personalizzato
// Se non c'è nessuna modifica da pubblicare, si ferma subito senza fare build, commit o push.
import { execSync } from 'node:child_process';

const run = (cmd) => {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
};
const changes = () => execSync('git status --porcelain').toString().trim();
const stop = (msg) => {
  console.log(`\n${msg}`);
  process.exit(0);
};

const now = new Date().toLocaleString('it-IT', { dateStyle: 'short', timeStyle: 'short' });
const message = process.argv.slice(2).join(' ').trim() || `Deploy ${now}`;

try {
  // 1. Nessuna modifica nel progetto: niente da pubblicare.
  if (!changes()) stop('Nessuna modifica da pubblicare: deploy annullato.');

  run('npm run build');
  run('git add -A');

  // 2. Dopo la build non è cambiato nulla (per esempio solo file ignorati): ci si ferma qui.
  if (!changes()) stop('La build non ha prodotto modifiche: deploy annullato.');

  run(`git commit -m ${JSON.stringify(message)}`);
  run('git push');
  console.log('\nFatto! Tra circa un minuto il sito sarà aggiornato:');
  console.log('https://marcoladuu.github.io/theBaronPlatform/');
} catch {
  console.error('\nDeploy interrotto: controlla il messaggio di errore qui sopra.');
  process.exit(1);
}
