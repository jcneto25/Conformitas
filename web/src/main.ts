import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

async function main() {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    const { worker } = await import('./mocks/browser');
    await worker.start({ onUnhandledRequest: 'bypass', serviceWorker: { url: 'assets/mockServiceWorker.js' } });
  }

  bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
}

main();

