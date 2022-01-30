# WikiHooku

**Wiki** from hawaian Wikiwiki - Quick  
**Hooku** from hawaian Hookuku - Compare  

WikiHooku aims to compare data from diferents entries in the Wikipedia  
First one is Lifetime & Age of Characters  

## Project setup

`yarn install`

### Environment variables

Stored in `.env` or `.env.test.local` file for development and test respectively  

**VUE_APP_I18N_LOCALE** - Default application's locale  

- en  

**VUE_APP_I18N_FALLBACK_LOCALE** - Default application's locale fallback  

- en  

**VUE_APP_API_URL** - Wikihooku API url  

- development: *<http://localhost:3000/api/>*
- production: *<https://wikihooku-api.herokuapp.com/api/>*  

**VUE_APP_RECAPTCHA_KEY** - Recaptcha key create at *<https://www.google.com/recaptcha/admin/site/349368012>*  

### Compiles and hot-reloads for development

`yarn dev`

### Compiles and minifies for production

`yarn build`

### Lints and fixes files

`yarn lint`

## Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
