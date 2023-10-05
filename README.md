# WikiHooku

**Wiki** from hawaian Wikiwiki - Quick  
**Hooku** from hawaian Hookuku - Compare  

WikiHooku aims to compare data from diferents entities in the Wikipedia  
First one is Lifetime & Age of Persons  

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/f7daf12a06e4424f93b171d30f301821)](https://app.codacy.com/gh/xcarol/wikihooku/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)

## Project setup

`npm install`

### Environment variables

Stored in `.env` or `.env.test.local` file for development and test respectively  

**VITE_I18N_LOCALE** - Default application's locale  

- en  

**VITE_I18N_FALLBACK_LOCALE** - Default application's locale fallback  

- en  

**VITE_API_URL** - Wikihooku API url  

- development: *<http://localhost:3000/api/>*
- production: *<https://wikihooku-api.herokuapp.com/api/>*  

**VITE_RECAPTCHA_KEY** - Recaptcha key create at *<https://www.google.com/recaptcha/admin/site/349368012>* use the *WEB SITE* key  

### Compiles and hot-reloads for development

`npm run dev`

### Compiles and minifies for production

`npm run build`

### Lints and fixes files

`npm run lint`

## Backend

The [WikiHooku API](https://github.com/xcarol/wikihooku-api) provides the infrastructure for the project.
