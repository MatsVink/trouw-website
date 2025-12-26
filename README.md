## Trouwsite Joy & Janick

Een eenvoudige, statische trouwwebsite voor Joy & Janick, gehost op Netlify.
link: bruiloftjoyenjanick.netlify.app

### Functionaliteit

- **Inlogscherm met codes**
  - `DAG2026` voor daggasten (zien volledig programma + feestlocatie + extra knoppen).
  - `KERK2026` voor kerkgasten (zien alleen kerkdienst + receptie).
  - De keuze wordt onthouden met `localStorage`, zodat je niet steeds opnieuw hoeft in te loggen.

- **Programma & locaties**
  - Overzicht van de dagplanning.
  - Foto naast de planning.
  - Locaties met link naar Google Maps en de site van In 't Groen.

- **RSVP-modal**
  - Knop: **“Laat weten of je komt (RSVP)”** opent een formulier in een modal.
  - Velden: naam, aanwezigheid, aantal personen, dieetwensen, opmerking.
  - Sluitknop (kruisje) rechtsboven om de modal weer te verbergen.

- **Netlify Forms**
  - Het RSVP-formulier is gekoppeld aan Netlify Forms via `data-netlify="true"`.
  - Inzendingen zijn te vinden in het Netlify-dashboard onder **Forms → rsvp**.
  - Vanuit Netlify kun je de data exporteren als CSV/Excel.

- **Cadeautips**
  - Losse pagina `cadeautips.html` met cadeau-ideeën en een link terug naar de hoofdpagina.

### Bestanden

- `index.html` – hoofdpagina met inlog, programma, locaties en RSVP-modal.
- `cadeautips.html` – pagina met cadeautips.
- `images/` – alle gebruikte foto’s en video.
- `.gitignore` – sluit o.a. `node_modules`, logs en lokale data-bestanden uit voor git.

### Lokale ontwikkeling

Omdat de site statisch is, kun je deze lokaal openen met een simpele webserver, bijvoorbeeld:

```bash
cd "trouw website"
python3 -m http.server 8000
```

Open daarna `http://localhost:8000` in je browser. Let op: Netlify Forms werkt lokaal niet volledig; de echte formulierverwerking zie je pas op de gedeployde Netlify-site.


