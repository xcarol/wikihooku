<template>
  <v-card>
    <v-card-title>Ayuda - WikiHooku</v-card-title>

    <v-card-text>
      WikiHooku es una herramienta que le permite ver, gráficamente en el tiempo, personas
      que tengan una entrada en la Wikipedia. El objetivo es poder ver de forma gráfica a personas relacionadas entre sí.<br /> <br />
      Aquí le explicamos cómo funciona la aplicación y sus características.<br />
      <ul>
        <li class="ml-4">En la barra de búsqueda central buscar a alguien que exista en la Wikipedia.</li>
        <li class="ml-4">Al seleccionar a una persona, se muestra una sola línea de tiempo con la fecha de nacimiento y la fecha de muerte (si no está viva) de esa persona.</li>
        <li class="ml-4">Buscar otra persona en la Wikipedia igual que hemos hecho antes.</li>
        <li class="ml-4">Ahora se muestra otra línea de tiempo, con los datos de esta nueva persona, en relación con la línea de tiempo de la persona anterior.</li>
        <li class="ml-4">Se pueden añadir más personas y nos mostrará gráficamente la contemporaneidad de las personas representadas.</li>
      </ul>
    </v-card-text>

    <v-card-subtitle>Opciones principales</v-card-subtitle>
    <v-card-text>
      <v-icon icon="$home" /> <b>WIKIHOOKU</b> - Le lleva a la página principal.<br />
      <v-icon icon="$feedback" /> <b>FEEDBACK</b> - Muestra un diálogo para que pueda enviarnos sus opiniones y dudas.<br />
      <v-icon icon="$help" /> <b>AYUDA</b> - Muestra esta pantalla.<br />
      <b>TÍTULO</b> - Muestra el título de la colección activa si le ha dado un nombre o '<b>COLECCIÓN SIN NOMBRE</b>' si aún no lo ha guardado.<br />
      <v-icon icon="$accountOut" /> Muestra las opciones de usuario. Se muestra así <v-icon icon="$accountIn" /> cuando ha iniciado sesión.<br />
    </v-card-text>

    <v-card-subtitle>Opciones de colección</v-card-subtitle>
    <v-card-text>
      <v-icon icon="$menu" /> <b>COLECCIONES</b> - Muestra la lista de colecciones.<br />
      <v-icon icon="$timeline" /> <b>LÍNEA DE TIEMPO</b> - Vista de las personas en la línea del tiempo.<br />
      <v-icon icon="$age" /> <b>EDAD</b> - Vista de las personas según su edad.<br />
      <b>SEARCH</b> - Busca personas en la Wikipedia.<br />
      <v-icon icon="$save" /> <b>GUARDAR</b> - Permite guardar una nueva colección. <i><b>AVISO</b></i>: Sólo puedes guardar colecciones si has iniciado sesión.<br />
      <v-icon icon="$deleteForever" /> <b>BORRAR</b> - Limpia la pantalla, eliminando a todas las personas.<br />
      <v-icon icon="$add" /> <b>AÑADIR</b> - Muestra un diálogo para añadir una persona que no está en la Wikipedia.<br />
    </v-card-text>
  </v-card>
</template>
