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

## FAQ revision, 27 October 2026

The current official FAQ was checked at https://www.carnadzons.ch/faqs/ via its delivered bundle https://www.carnadzons.ch/static/js/main.3139f930.js. Its three questions refer to the 2026 Far West cortège (7 February, 16:26), a Lunbabus at 02:00 and free admission. The user then explicitly confirmed **free entry for 2027** and **a Lunbabus return shuttle, with times and route to be specified**. Only those newly confirmed conditions were carried into the 2027 FAQ. The old cortège time, bus departure and route were not copied. Six short questions cover date/venue, theme, programme, admission, shuttle and contact. They are generated on both the homepage and /faqs/ from scripts/faq-content.json; changing that file updates both. Contact email and telephone remain published on the official contact page.

## Village section and archival previews, 27 October 2026

The user requested more readable, visually developed access to history, previous editions and the children's carnival. Three full-card links now show the existing historical photo, the official 2026 poster and the 2023 children's archive. The dates are labelled as archives, without announcing the old events as upcoming. The official 2026 poster, already retrieved from the source site's PDF earlier in this task, is added to the editions gallery so it can be opened in full. Assets/archives/edition-2026.png is the retained 596×842 raster render of that poster.

## Cow hieroglyph, 27 October 2026

The user requested an original little cow carved among the decorative Egyptian motifs and on the poster. The motif is a new native SVG line drawing, with four legs, udder, short horns, ears and two spots. It is decorative and does not claim to translate historical Egyptian writing. It replaces a bird motif in the existing 720×720 engraved tile. The homepage entrance's inline incisions are now generated from that same asset, so the doors and page surfaces stay consistent. The poster reuses the motif and has a small distinct engraving beside the date. The existing wordmark remains text-only. The separately exported editable poster has also been updated while preserving all editable text and grouped vectors.

## Village emblems, 27 October 2026

The user rejected the photographic/poster previews in the village section and requested logos instead. They are replaced by three original monochrome SVG emblems: a papyrus for history, a carnival mask for editions and a festive little cow for the children's carnival. These are navigation symbols, not claims to be official society logos. The photo and historical posters remain available on their respective pages. The page links and body text are preserved; archival captions are removed from the homepage cards because those cards no longer display archives.

## Final rendezvous block, 27 October 2026

After approving the village emblems, the user asked to continue. The last homepage block keeps the accepted giant date and title, adds the user-confirmed free admission and planned Lunbabus return (time/route still to come), and improves the mobile agenda/route actions. The Google Maps link now uses the official directions URL with a destination search string for the known venue, without inventing a street address or a route origin: https://developers.google.com/maps/documentation/urls/get-started#directions . The calendar download keeps the same event UID, retains the all-day 30 January date because hours remain unknown, uses CRLF and UTF-8-safe line folding, and includes the current title and confirmed access information.

## Notre histoire, 27 October 2026

The user requested the history page using the current official site and the accepted black/gold design. The production React bundle https://www.carnadzons.ch/static/js/main.3139f930.js (component yc, route /histoire) was read as text on this date. It explicitly documents the 2013 renewal after 42 years and the adoption of the Carna’dzons name, the response from residents and member/invited societies, and the five current member societies. The stale invitation for 2024 is omitted. The page does not infer a founding year or assign a date or identities to the historical photograph. The existing original archive photo is retained unfiltered and shown in full. The existing papyrus emblem is a navigation illustration, not a historical artefact. Five society names are reproduced; no membership start dates are asserted. A scoped history22.css is loaded only on /histoire/, with shared fonts, carved background, shell and temple transitions preserved.

## Last editions page, 27 October 2026

The user requested the posters and historical information from the current official site in the accepted black/gold style. The official /edition route and current homepage/theme were audited via https://www.carnadzons.ch/static/js/main.3139f930.js as text, and all four posters inspected. The archives are: 7 February2026 (Destination Far West),22 February2025 (Retour au Moyen-Âge, édition spéciale),3 February2024 (Les modzons sur la lune),11 February2023 (À l’abor’dzons). Dates and2025 theme are directly legible on the original posters. The2025 archive paragraph incorrectly repeats2024; that error is not copied. The source's2020 block mixes2013 and2024 and supplies no2020 poster, so no edition is invented from it. The2025 text describes its verified poster rather than asserting an undocumented programme.

The existing full-colour originals are kept unfiltered and uncropped, each linked to its full image in a new tab. The2026 PNG (the current official poster, https://www.carnadzons.ch/static/media/AfficheCarna%202026.8c839501aa2a342c789a.png ) remains unchanged: the official PDF booklet's cover has a different historic start time, so its render was not substituted for the poster. The booklet remains a distinct2026 archive link. No old times, prices or transport conditions are used as2027 announcements. A scoped editions23.css supplies the chapter layout and native year-anchor navigation, while fonts, carved stone and shared page transitions remain the accepted ones.

## Children’s carnival page, 27 October 2026

The user requested the children’s carnival information and original poster from carnadzons.ch in the accepted black/gold style. The current /carna_enfant page still displays the21 February2023 poster. A more recent original was found on page22 of the official2026 booklet (https://www.carnadzons.ch/static/media/Carnadzons2026.473915d56c9c882bbf43.pdf#page=22): Tuesday17 February2026, Société de gym La Coccinelle, animation Les Chenegaudes, cortège from l’Évouettaz to the church, fête on the church square, Petites Coccinelles dance performance and mask competition/prizes. The native embedded image was extracted with pdfimages without resizing or added cropping and saved as assets/archives/enfants-2026.png (759×1120, SHA2567b19602e352a211fae6f6ef140c35ea36a08babd1606414c016f3df6bfa6c127). The poster contains both13h30 in its programme and a large “dès14h”; the summary therefore gives activities without selecting an inferred overall start time. The original remains unchanged and can be opened in full.

The previous2023 poster stays accessible in a compact archive block. The former “pirates” wording is removed: it was not supported by the children’s poster. No children’s2027 date, venue, programme or admission terms have been confirmed. The next edition is explicitly awaiting information. The organiser’s printed domain lacoccinelle1969.ch responds in HTTP but its HTTPS certificate fails; the page uses the existing internal contact instead. The small festive cow is the already accepted decorative emblem, not a society logo. Styling is scoped to children24.css and preserves all shared fonts, stone background and temple transitions.

## Isolated pyramid entrance test, 27 October2026

The user requested a non-final test replacing the temple entrance with a pyramid and doors. A new /test-pyramide/ route clones the accepted homepage content and shared navigation while replacing only its entrance scene/controller. The accepted homepage and its alias are retained byte-for-byte. The original SVG construction has two stone faces, a golden summit, separate30/01 door panels, steps, dunes and small decorative reed/cow glyphs; it does not claim historical architectural or epigraphic accuracy. There are no new third-party assets or runtime dependencies. A comparison link returns to the accepted temple. Camera, door rotations and content handoff are scroll-driven and reversible; the controller retains the existing55ms convergence, idle stop and orientation handling. Reduced motion shows the static pyramid and an explicit Enter link before the arrival content. The experiment is marked noindex and is not added to primary navigation.
