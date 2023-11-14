<template>
  <v-card>
    <v-card-title>Help - WikiHooku</v-card-title>

    <v-card-text>
      WikiHooku is a tool that allows you to see, graphically over time, people
      that have an entry in the Wikipedia. The goal is to be able to graphically see people related to each other.<br /> <br />
      Here we explain how the application works and its features.<br />
      <ul>
        <li class="ml-4">In the central search bar search for someone who exists in the Wikipedia.</li>
        <li class="ml-4">Selecting a person displays a single timeline with the birth date and death date (if not alive) of that person.</li>
        <li class="ml-4">Find someone else on the Wikipedia just like you did before.</li>
        <li class="ml-4">Another timeline is now displayed, with this new person's data, in relation to the previous person's timeline.</li>
        <li class="ml-4">More people can be added and it will show us graphically the contemporaneity of the people represented.</li>
      </ul>
    </v-card-text>

    <v-card-subtitle>Main options</v-card-subtitle>
    <v-card-text>
      <v-icon icon="$home" /> <b>WIKIHOOKU</b> - Takes you to the home page.<br />
      <v-icon icon="$feedback" /> <b>FEEDBACK</b> - Shows a dialog so you can send us your opinions and doubts.<br />
      <v-icon icon="$help" /> <b>HELP</b> - Shows this screen.<br />
      <b>TITLE</b> - Shows the title of the active collection if you have given it a name or '<b>UNNAMED COLLECTION</b>' if you have not saved it yet.<br />
      <v-icon icon="$accountOut" /> Show user options. It looks like this <v-icon icon="$accountIn" /> when you're signed in.<br />
    </v-card-text>

    <v-card-subtitle>Collection Options</v-card-subtitle>
    <v-card-text>
      <v-icon icon="$menu" /> <b>COLLECTIONS</b> - Show the list of collections.<br />
      <v-icon icon="$timeline" /> <b>TIMELINE</b> - View of people in the timeline.<br />
      <v-icon icon="$age" /> <b>AGE</b> - View people according to their age.<br />
      <b>SEARCH</b> - Search for people on Wikipedia.<br />
      <v-icon icon="$save" /> <b>SAVE</b> - Allows you to save a new collection. <i><b>NOTICE</b></i>: You can only save collections if you are logged in.<br />
      <v-icon icon="$deleteForever" /> <b>DELETE</b> - Clears the screen, removing all people.<br />
      <v-icon icon="$add" /> <b>ADD</b> - Shows a dialog to add a person who is not on the Wikipedia.<br />
    </v-card-text>
  </v-card>
</template>
