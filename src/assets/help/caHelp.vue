<template>
  <v-card>
    <v-card-title>Ajuda - WikiHooku</v-card-title>

    <v-card-text>
      WikiHooku és una eina que us permet veure, graficament en el temps, persones
      que tinguin una entrada en la wikipedia. L'objectiu és poder veure de manera gràfica persones relacionades entre si.<br /> <br />
      Aquí us expliquem com funciona l'aplicació i les seves característiques.<br />
      <ul>
        <li class="ml-4">En la barra de cerca central buscar algú que existeixi a la Wikipedia.</li>
        <li class="ml-4">En sel·leccionar una persona, es mostra una sola línia de temps amb la data de neixement i la data de mort (si no és viva) d'aquesta persona.</li>
        <li class="ml-4">Buscar algú altre a la Wikipedia igual que em fet abans.</li>
        <li class="ml-4">Ara es mostra una altra línia de temps, amb les dades d'aquesta nova persona, en relació amb la línia de temps de la persona anterior.</li>
        <li class="ml-4">Es poden afegir més persones, ens mostra gràficament la contemporaneitat de les persones respresentades.</li>
      </ul>
    </v-card-text>

    <v-card-subtitle>Opcions principals</v-card-subtitle>
    <v-card-text>
      <v-icon icon="$home" /> <b>WIKIHOOKU</b> - Us porta a la pàgina principal.<br />
      <v-icon icon="$feedback" /> <b>FEEDBACK</b> - Mostra un diàleg per a que pugueu enviar-nos les vostres opinions i dubtes.<br />
      <v-icon icon="$help" /> <b>AJUDA</b> - Mostra aquesta pantalla.<br />
      <b>TÍTOL</b> - Mostra el títol de la col·lecció activa si li heu donat un nom o '<b>COL·LECCIÓ SENSE NOM</b>' si encara no l'heu desat.<br />
      <v-icon icon="$accountOut" /> Mostra les opcions d'usuari. Es mostra així <v-icon icon="$accountIn" /> quan heu iniciat sessió.<br />
    </v-card-text>

    <v-card-subtitle>Opcions de col·lecció</v-card-subtitle>
    <v-card-text>
      <v-icon icon="$menu" /> <b>COL·LECCIONS</b> - Mostra la llista de col·leccions.<br />
      <v-icon icon="$timeline" /> <b>LÍNIA DE TEMPS</b> - Vista de les persones en la línia del temps.<br />
      <v-icon icon="$age" /> <b>EDAT</b> - Vista de les persones segons la seva edat.<br />
      <b>SEARCH</b> - Cerca persones a la Wikipedia.<br />
      <v-icon icon="$save" /> <b>GUARDAR</b> - Permet guardar una nova col·lecció. <i>AVIS</i>: Només pots guardar col·leccions si has iniciat sessió.<br />
      <v-icon icon="$deleteForever" /> <b>ESBORRAR</b> - Neteja la pantalla, eliminant totes les persones.<br />
      <v-icon icon="$add" /> <b>AFEGIR</b> - Mostra un diàleg per afegir una persona que no hi és a la Wikipedia.<br />
    </v-card-text>
  </v-card>
</template>
