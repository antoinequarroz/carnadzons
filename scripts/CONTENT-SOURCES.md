# Carna’dzons content migration

Verified from https://www.carnadzons.ch/ and its registered routes on 27 October 2026.

## Routes

- `/histoire/`: history of the name change in 2013 after 42 years; five member societies.
- `/edition/`: original posters 2025, 2024, 2023; externally linked 2026 PDF explicitly archived.
- `/carna_enfant/`: archive 2023; upcoming edition details not confirmed.
- `/faqs/`: only confirmed 2027 facts; no transfer of old times, prices, transport or invited bands.
- `/contact/`: published address, email and telephone. Address is an administrative contact, not the event entrance. No backend form migrated.
- `/char/`: previously an official homepage section; 2027 calendar awaiting confirmation.
- `/comite/`: previously an official homepage section; 12 published members and roles confirmed unchanged by the user on 27 October 2026.

## User-confirmed event

30 January 2027, salle de gym de Saint-Martin (Valais), Egypt theme.

## Original image sources

Copied byte-for-byte into `dist/assets/archives/`:

- histoire.jpg: https://www.carnadzons.ch/static/media/histoire.9bc692a22cb1bcd917bd.jpg
- edition-2025.png: https://www.carnadzons.ch/static/media/carnadzons2025Affiche.898075abf3427a5d040c.png
- edition-2024.png: https://www.carnadzons.ch/static/media/AfficheCarna2024.81472c23002842d847b4.png
- edition-2023.png: https://www.carnadzons.ch/static/media/afficheFinal2023.b1d97945b0799f5d72f9.png
- enfants-2023.png: https://www.carnadzons.ch/static/media/carnaEnfant2023.637feda80d082b38a263.png

The old footer's broken `/team_details` route and `/#feature` anchor were not copied. No gallery, registration or ticketing route was present. Conflicting archive text (2025/2020 paragraphs copied from 2024) was not reused.

Regenerate all pages and shared menus with `node scripts/build-pages.mjs`. It preserves the homepage main and its animation assets.
