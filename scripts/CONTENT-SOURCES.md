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

## Homepage design revision, 27 October 2026

The user requested the new homepage order and primary navigation, removal of the cow section and brand icon, a new post-entrance heading, and a body-font proposal. Cleopatra headings are retained; Manrope is self-hosted under its included OFL license from https://github.com/google/fonts/tree/main/ofl/manrope.

The user confirmed **Les Chenegaudes** and **Les Gugg’Dragons** for the 2027 evening and requested an original black/gold poster proposal. The SVG in assets/affiche-egypte-2027.svg is that proposal, not an approved official poster. No times, prices or char appearances were added.

## Theme invitation and poster revision, 27 October 2026

The user accepted the homepage design and requested an expanded 2027 theme invitation in the tone of their 2026 Far West text, a hieroglyph background on the poster, a new title and larger entrance-door dates. “Au royaume des pharaons” is the new creative title; the theme remains Egypt. The invitation describes costumes and imagination, without adding unconfirmed event décor, hours or logistics. The engraved poster uses the site's original native SVG motifs. Entrance numerals are enlarged from 60 to 68 SVG units, with the accepted door geometry and scroll motion preserved.

## Invited guggens, 27 October 2026

The user requested logos, photographs and descriptive histories for the confirmed 2027 guests. The Chenegaudes copy follows the supplied text. The shorter Gugg’Dragons copy is based on the user's supplied history (Chermignon, founded 2002, more than 40 musicians/accompanying members, 20th anniversary in 2022). These are histories of the societies, not new programme commitments. Their original logos are preserved; a native SVG viewport trims only transparent export margins around the Gugg’Dragons logo. Bitmaps are unchanged. Group photos use a light monochrome CSS treatment to match the site's palette.

- Chenegaudes group photograph: https://www.carnadzons.ch/static/media/Chenegaudes.1b21f499d14d0be497ff.png (existing Carna’dzons site's photoImage for Chenegaudes; 791×444). Local assets/guggens/chenegaudes-groupe.png.
- Chenegaudes official entrance logo: https://static.wixstatic.com/media/f75f87_cdfbe8c4747b4605a44e84f5253942ed~mv2.png from https://www.chenegaudes.ch/ (819×1212, alpha). Local assets/guggens/chenegaudes-logo.png.
- Gugg’Dragons official logo: https://guggdragons.ch/wp-content/uploads/2026/06/Logo_Guggen_draggons_Chermignon-removebg-preview.png from https://guggdragons.ch/ (666×375, alpha). Local assets/guggens/guggdragons-logo.png.
- Gugg’Dragons group photograph: https://guggdragons.ch/wp-content/uploads/2026/06/guggs-dragons.jpg from https://guggdragons.ch/ (2048×1330). Local assets/guggens/guggdragons-groupe.jpg.

## Char and committee correction, 27 October 2026

The user requested a quiet “Informations à suivre” placeholder for char appearances because dates and locations are not yet confirmed. Both homepage and char page now use that wording. The user replaced Charlotte with Xavier Pralong for La Coccinelle and added Mathis Pralong for the same society, then explicitly corrected the surname to Pralong. Xavier retains the replaced decoration role; Mathis is listed as a committee member without inventing a specific responsibility. The homepage and committee page both contain 13 members.
