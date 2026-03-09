import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
import { appConfig } from './app/app.config';

async function main() {
  try {
    await bootstrapApplication(AppComponent, appConfig);
  } catch (e) {
    console.error(e);
  }
}


main(); //NOSONAR