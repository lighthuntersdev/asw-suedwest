# Projektbericht: Website-Relaunch ASW südwest

**Auftraggeber:** ASW südwest Assekuranz- und Finanzierungsvermittlungsservice GmbH  
**Auftragnehmer:** Light Hunters | Digital Solutions  
**Projektdauer:** Mai 2026  
**Live-URL:** https://asw-suedwest.pages.dev  
**Repository:** https://github.com/lighthuntersdev/asw-suedwest

---

## 1. Projektübersicht

Im Auftrag der ASW südwest wurde die bestehende Unternehmenswebsite vollständig neu aufgesetzt. Der Relaunch umfasst die Übernahme aller vom Kunden bereitgestellten Texte, ein modernes responsives Design, ein Blog-CMS für eigenständige Content-Pflege, ein digitales Schadenportal mit E-Mail-Benachrichtigung sowie die Einhaltung aller rechtlichen Anforderungen nach deutschem und EU-Recht.

---

## 2. Umfang der Leistungen

### 2.1 Seiten & Inhalte

| Seite | Beschreibung |
|-------|-------------|
| **Startseite** | Hero, Kennzahlen, Leistungsübersicht (3 Cards), Schadenbearbeitung, Risikoanalyse, Über-uns-Teaser, Netzwerk, Werteschutz, Prozess (4 Schritte), Team-Preview, Blog-Preview, FAQ (6 Einträge), Partner-Logos, Kontaktbereich |
| **Versicherungen** | 5 Versicherungsprodukte: Cyber, Vermögensschadenhaftpflicht, D&O, Vertrauensschaden, Strafrechtsschutz |
| **Finanzierungen** | NT ImmoConsult Partnerschaft, 4 Dienstleistungskarten (2×2 Grid) |
| **Benefits** | Betriebliche Altersversorgung, Versorgungswerk, Betriebliche Krankenversicherung, Dread Disease & BU |
| **Services** | Deckungsanalyse, Netzwerkpartner, Dienstleistungen, Naturgefahren |
| **Über uns** | Firmengeschichte, 10 Team-Mitglieder mit Fotos und Beschreibungen, Unternehmenswerte, Partnerschaften mit Logos, Zahlen & Fakten |
| **Blog** | 7 Fachbeiträge (CMS-verwaltet), automatische HTML-Generierung |
| **Schadenportal** | 3 Tab-Formulare (Sachversicherung, D&O, Cyber) mit E-Mail-Versand |
| **Herzenspartner** | Bärenherz Stiftung: 5 Content-Sections mit individuellen Bildern |
| **Impressum** | Vollständige Anbieterkennzeichnung gem. § 5 DDG |
| **Datenschutz** | DSGVO-konforme Datenschutzerklärung |
| **Erstinformation** | Pflichtangaben gem. § 15 VersVermV |
| **Transparenzverordnung** | Offenlegung gem. EU-Verordnung 2019/2088 (SFDR) |
| **Barrierefreiheit** | Barrierefreiheitserklärung gem. BFSG |

**Gesamt: 15 Hauptseiten + 7 Blog-Artikel**

### 2.2 Design & Technik

- Vollständig responsives Design (Desktop, Tablet, Mobile)
- Modernes UI mit Playfair Display / Inter Typografie
- Scroll-Reveal Animationen
- Dark-Mode CTA-Bereich mit Glasmorphism-Kontaktkarten
- Optimierte Ladezeiten (Lazy Loading, Preconnect)
- Schema.org Structured Data (Organization, FAQ, Blog, Breadcrumbs)
- Open Graph & Twitter Card Meta-Tags auf allen Seiten

### 2.3 Blog-CMS (Sveltia CMS)

- Admin-Oberfläche unter `/admin/` mit WYSIWYG-Editor
- Zugang über GitHub Access Token
- Blog-Beiträge als Markdown-Dateien in `content/blog/`
- Automatische HTML-Generierung bei jedem Deploy
- Kategorien: Versicherung, Cyberrisiken, Gebäudeschutz, D&O, Haftpflicht, Wohnungswirtschaft, Finanzierung, Recht, Datenschutz, Versicherungswissen
- Beitragsbild-Upload, Lesezeit, Kurzbeschreibung

### 2.4 Schadenportal

- 3 spezialisierte Formulare: Sachversicherung, D&O-Versicherung, Cyber-Versicherung
- Cloudflare Turnstile CAPTCHA (Spam-Schutz)
- E-Mail-Versand über Resend API (formatierte HTML-E-Mails)
- Datei-Anhänge als E-Mail-Attachments (PDF, JPG, PNG, DOC bis 10 MB)
- Erfolgsmeldung nach Absenden

### 2.5 Bilder & Medien

- 7 individuell generierte Seitenbilder (Adobe Firefly)
- 5 Herzenspartner-Bilder (thematisch passend)
- 10 Team-Porträtfotos
- 5 Partner-Logos (VdW südwest, TDW, AWTS, NT Hannover, VDW Bayern)
- Bärenherz Stiftung Logo
- 3 Blog-Beitragsbilder

---

## 3. Barrierefreiheit (WCAG 2.1 AA)

| Maßnahme | Status |
|----------|--------|
| Skip-Navigation ("Zum Inhalt springen") | Auf allen 15 Seiten |
| Keyboard-Navigation (Focus-Styles) | Implementiert |
| Farbkontrast ≥ 4.5:1 (WCAG AA) | Geprüft und korrigiert |
| Alt-Texte auf allen Bildern | Vollständig |
| ARIA-Labels auf interaktiven Elementen | Vollständig |
| Formular-Accessibility (aria-required) | 32 Pflichtfelder markiert |
| Barrierefreiheitserklärung (BFSG) | Erstellt und verlinkt |

---

## 4. Rechtliche Compliance

| Anforderung | Rechtsgrundlage | Status |
|-------------|----------------|--------|
| Impressum | § 5 DDG, § 18 MStV | Vollständig |
| Datenschutzerklärung | Art. 13/14 DSGVO | Vollständig |
| Cookie-Banner mit "Alle ablehnen" | § 25 TDDDG, DSGVO | Implementiert |
| Erstinformation | § 15 VersVermV | Vollständig |
| Transparenzverordnung | EU 2019/2088 (SFDR) | Vollständig |
| Barrierefreiheitserklärung | BFSG (Pflicht ab 28.06.2025) | Vollständig |

---

## 5. Technische Infrastruktur

| Komponente | Lösung |
|-----------|--------|
| Hosting | Cloudflare Pages |
| Repository | GitHub (lighthuntersdev/asw-suedwest) |
| CI/CD | Automatischer Build & Deploy bei jedem Push |
| Build-System | Node.js (build.js) - Markdown zu HTML |
| CMS | Sveltia CMS (Git-basiert) |
| E-Mail-Versand | Resend API (Cloudflare Pages Function) |
| Spam-Schutz | Cloudflare Turnstile |
| DNS/Domain | Vorbereitet für asw-suedwest.de (Custom Domain) |

### Environment Variables (Cloudflare Pages)

| Variable | Zweck |
|----------|-------|
| RESEND_API_KEY | E-Mail-Versand API-Schlüssel |
| RESEND_FROM | Absender-Adresse |
| SCHADEN_EMAIL | Empfänger der Schadensmeldungen |
| TURNSTILE_SECRET | CAPTCHA Server-Validierung |

---

## 6. Offene Punkte / Nächste Schritte

| Punkt | Priorität | Beschreibung |
|-------|-----------|-------------|
| Domain-Umzug | Hoch | asw-suedwest.de auf Cloudflare Pages Custom Domain umziehen |
| Resend Domain-Verifizierung | Hoch | asw-suedwest.de bei Resend verifizieren für korrekte Absender-Adresse |
| Team-Fotos | Mittel | Neue Fotos für Andrea Born und Yannic Schaufler (derzeit Platzhalter) |
| FAQ-Inhalte | Mittel | Inhalte prüfen und ggf. ergänzen |
| Risikoanalyse-Formular | Mittel | Inhalte prüfen und ggf. ergänzen |
| Google Maps | Niedrig | Einbettung im Kontaktbereich (optional) |
| Blog-Inhalte | Laufend | Neue Fachartikel über das CMS erstellen |

---

## 7. Zugangsübersicht

| Zugang | URL / Methode |
|--------|--------------|
| Website (Dev) | https://asw-suedwest.pages.dev |
| CMS Admin | https://asw-suedwest.pages.dev/admin/ |
| CMS Login | GitHub Access Token (Classic, Scope: repo) |
| GitHub Repo | https://github.com/lighthuntersdev/asw-suedwest |
| Cloudflare Dashboard | dash.cloudflare.com → Workers & Pages → asw-suedwest |
| Resend Dashboard | resend.com (E-Mail-Versand Konfiguration) |

---

## 8. Übergabe

Die Website ist in vollem Umfang funktionsfähig und auf der Dev-URL aufrufbar. Alle Texte wurden gemäß den Vorgaben der ASW südwest eingepflegt. Das CMS ermöglicht dem Kunden die eigenständige Pflege von Blog-Beiträgen. Das Schadenportal sendet Schadensmeldungen per formatierter E-Mail an die konfigurierte Adresse.

Nach Bereitstellung der Domain-Zugangsdaten kann der Umzug auf asw-suedwest.de erfolgen.

---

*Erstellt von Light Hunters | Digital Solutions*  
*Frankfurt am Main, Mai 2026*
