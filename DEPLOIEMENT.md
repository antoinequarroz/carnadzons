# 🚀 Guide de déploiement Carnadzons

## ⚠️ Problème résolu

**Erreur corrigée :**
```
Refused to apply style from 'https://www.carnadzons.ch/assets/style.css' 
because its MIME type ('text/html') is not a supported stylesheet MIME type
```

**Cause :** Le serveur retournait du HTML (page 404) au lieu des fichiers CSS/JS pour les routes React Router.

**Solution :** Configuration améliorée du `.htaccess` pour mieux gérer les fichiers statiques.

---

## 📋 Checklist de déploiement

### 1. Build du projet

```bash
# Dans le dossier du projet
npm run build
```

Cela crée un dossier `build/` avec tous les fichiers optimisés.

### 2. Vérifier les fichiers générés

Le dossier `build/` doit contenir :
```
build/
├── index.html
├── manifest.json
├── robots.txt
├── sitemap.xml
├── .htaccess          ← IMPORTANT !
├── assets/
│   ├── style.css
│   ├── animate.css
│   ├── fonts/
│   └── images/
├── static/
│   ├── css/
│   ├── js/
│   └── media/
└── contact/
    ├── contact-process.php
    └── .htaccess
```

### 3. Upload sur le serveur

**Via FTP/cPanel :**
1. Connecte-toi à ton serveur
2. Va dans le dossier `public_html` (ou `www` ou `htdocs`)
3. **Supprime l'ancien contenu** (sauf bases de données si tu en as)
4. **Upload TOUT le contenu du dossier `build/`**
   - ⚠️ **Important :** Assure-toi que le `.htaccess` est bien uploadé
   - Sur certains FTP, les fichiers cachés (commençant par `.`) ne sont pas visibles par défaut

### 4. Vérifier les permissions

Sur le serveur, vérifie les permissions :
```bash
# Fichiers PHP
chmod 644 contact/contact-process.php

# .htaccess
chmod 644 .htaccess
chmod 644 contact/.htaccess

# Dossiers
chmod 755 contact/
```

### 5. Configuration email (important pour le formulaire)

**Pour que les emails du formulaire fonctionnent :**

Édite `build/contact/contact-process.php` et vérifie :
```php
// L'email où tu reçois les messages
$to = "contact@carnadzons.ch";

// L'email qui apparaît comme expéditeur
$from = "noreply@carnadzons.ch";
```

⚠️ **Important :** Ces emails doivent exister sur ton hébergement, sinon les emails seront bloqués.

---

## 🔍 Tests après déploiement

### Test 1 : Page d'accueil
```
✓ https://carnadzons.ch/
```
→ Doit charger correctement avec les images et le style

### Test 2 : Routes React
```
✓ https://carnadzons.ch/histoire
✓ https://carnadzons.ch/editions
✓ https://carnadzons.ch/contact
```
→ Ne doivent PAS afficher d'erreur 404

### Test 3 : Fichiers statiques
```
✓ https://carnadzons.ch/assets/style.css
✓ https://carnadzons.ch/manifest.json
✓ https://carnadzons.ch/robots.txt
```
→ Doivent charger les fichiers, pas du HTML

### Test 4 : Formulaire de contact
1. Remplis le formulaire sur https://carnadzons.ch/contact
2. Envoie un message test
3. Vérifie ta boîte email (contact@carnadzons.ch)

### Test 5 : Console du navigateur
1. Ouvre https://carnadzons.ch/
2. Appuie sur F12 → Console
3. **Ne doit PAS avoir d'erreurs** MIME type ou SyntaxError

---

## 🛠️ Dépannage

### Problème : "MIME type error" persiste

**Solution :**
1. Vérifie que le `.htaccess` a bien été uploadé à la racine
2. Sur certains serveurs, renomme `.htaccess` en `htaccess.txt`, upload, puis renomme sur le serveur
3. Vide le cache de ton navigateur (Ctrl+F5)
4. Contacte ton hébergeur pour vérifier que `mod_rewrite` est activé

### Problème : Page blanche

**Solution :**
1. Ouvre la console (F12) et regarde les erreurs
2. Vérifie que tous les fichiers du dossier `build/` ont bien été uploadés
3. Vérifie que le fichier `index.html` est à la racine du site

### Problème : Routes 404

**Solution :**
1. Vérifie que le `.htaccess` est à la racine
2. Vérifie que `mod_rewrite` est activé sur ton serveur
3. Teste : `https://carnadzons.ch/index.html` (si ça marche, c'est le .htaccess)

### Problème : Formulaire ne fonctionne pas

**Solution :**
1. Vérifie que PHP est installé sur le serveur
2. Vérifie les permissions du fichier PHP (644)
3. Vérifie que les emails existent dans ton hébergement
4. Regarde les logs d'erreur PHP sur ton serveur

### Problème : Images ne chargent pas

**Solution :**
1. Vérifie que le dossier `assets/images/` a bien été uploadé
2. Vérifie les permissions (755 pour dossiers, 644 pour fichiers)
3. Vérifie les chemins dans le code (doivent être relatifs)

---

## 📊 Performance après déploiement

### Test avec Google Lighthouse

1. Ouvre https://carnadzons.ch/
2. F12 → Onglet "Lighthouse"
3. Clique sur "Generate Report"

**Scores attendus :**
- Performance : **85-95**
- SEO : **95-100**
- Best Practices : **90+**
- Accessibility : **85+**

### Test de vitesse

- **GTmetrix :** https://gtmetrix.com/
- **PageSpeed Insights :** https://pagespeed.web.dev/

---

## ✅ Checklist finale

Après déploiement, vérifie :

- [ ] Page d'accueil charge correctement
- [ ] Toutes les routes fonctionnent (histoire, contact, etc.)
- [ ] Images s'affichent correctement
- [ ] CSS et design sont corrects
- [ ] Formulaire de contact fonctionne
- [ ] Pas d'erreurs dans la console F12
- [ ] Site accessible sur mobile
- [ ] Emails du formulaire arrivent bien
- [ ] Sitemap accessible : https://carnadzons.ch/sitemap.xml
- [ ] Robots.txt accessible : https://carnadzons.ch/robots.txt
- [ ] Manifest.json accessible : https://carnadzons.ch/manifest.json

---

## 🎯 Prochaines étapes (optionnel)

### 1. SSL/HTTPS
Si pas encore fait, active le SSL dans cPanel ou contact ton hébergeur.
Puis décommente dans `.htaccess` :
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>
```

### 2. Google Search Console
1. Va sur https://search.google.com/search-console
2. Ajoute ta propriété : carnadzons.ch
3. Soumets le sitemap : https://carnadzons.ch/sitemap.xml

### 3. Analytics (optionnel)
Si tu veux suivre les visiteurs, ajoute Google Analytics dans `public/index.html`

---

## 🆘 Support

Si tu as des erreurs après le déploiement :

1. **Note l'erreur exacte** (copie depuis la console F12)
2. **Vérifie les logs du serveur** (dans cPanel → Logs d'erreur)
3. **Teste localement** : `npm start` doit marcher sans erreur
4. **Compare** : ce qui marche en local doit marcher en prod

---

_Guide créé le 2 décembre 2024_
_Version React déployée avec succès_ ✅
