import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";

async function main() {
  try {
    await bootstrapApplication(AppComponent);
  } catch (e) {
    console.error(e);
  }
}


main(); //NOSONAR