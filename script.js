const contentRef = document.getElementById("content");
const btnBackwardRef = document.getElementById("btn-back");
const btnForwardRef = document.getElementById("btn-next");
const countPaginationRef = document.getElementById("pagination-content");

let totalPagination;
let currentPagination = 1;

let renderStartID = 1;

async function renderPokemones() {
  if (pokemons.length == 0) await getPokemons(apiURL);
  else if (pokemons.length < renderStartID) await getPokemons(nextURL);
  else;

  renderProgress("loaded");

  for (let i = renderStartID - 1; i < renderStartID + 19; i++) {
    let types = "";
    if (pokemons[i].types.length > 0)
      for (let j = 0; j < pokemons[i].types.length; j++) {
        types += `<p> ${pokemons[i].types[j].type.name} </p>`;
      }
    contentRef.innerHTML += pokemonTemplate(i, types);
    changeBackground(pokemons[i].types[0].type.name, i);
  }

  renderPagination();
}

function renderProgress(progress) {
  if (progress == "loading") {
    contentRef.innerHTML = "<h2> In Progress ... </h2>";
    btnBackwardRef.disabled = true;
    btnForwardRef.disabled = true;
  } else {
    contentRef.innerHTML = "";
    btnBackwardRef.disabled = false;
    btnForwardRef.disabled = false;
  }
}

function changeBackground(type, i) {
  const pokemonRef = document.getElementById("pokemon-" + i);

  switch (type) {
    case "fire":
      pokemonRef.classList.add("bg-fire");
      break;
    case "water":
      pokemonRef.classList.add("bg-water");
      break;
    case "grass":
      pokemonRef.classList.add("bg-grass");
      break;
    default:
      break;
  }
}

async function getPokemons(url) {
  renderProgress("loading");
  let response = await fetch(url);
  response = await response.json();
  totalPagination = Math.ceil(response.count / 20);
  nextURL = response.next;
  previousURL = response.previous;

  for (let i = 0; i < response.results.length; i++) {
    const pokemon = response.results[i];
    const types = await getPokemonTypes(pokemon.url);
    const sprites = await getPokemonImages(pokemon.url);
    pokemon.types = types;
    pokemon.sprites = sprites;
    pokemons.push(pokemon);
  }
}

function renderPagination() {
  countPaginationRef.innerText = currentPagination + " of " + totalPagination;

  switch (currentPagination) {
    case 1:
      btnBackwardRef.classList.add("v-none");
      break;
    case 2:
      btnBackwardRef.classList.remove("v-none");
      break;
    case totalPagination:
      btnForwardRef.classList.add("v-none");
      break;
    case totalPagination - 1:
      btnForwardRef.classList.remove("v-none");
      break;
    default:
      break;
  }
}

async function getPokemonTypes(url) {
  let response = await fetch(url);
  response = await response.json();
  return response.types;
}

async function getPokemonImages(url) {
  let response = await fetch(url);
  response = await response.json();
  return response.sprites;
}

function forward() {
  currentPagination++;
  renderStartID += 20;
  renderPokemones();
}

function backward() {
  currentPagination--;
  renderStartID -= 20;
  renderPokemones();
}

const pokemonDialogRef = document.getElementById("pokemon-dialog");

let aboutContentRef, stateContentRef, spriteContentRef;
let btnAboutRef, btnStatRef, btnSpriteRef;
let btnNextDialogRef, btnBackDialogRef;

async function showDialog(i, types) {
  pokemonDialogRef.showModal();

  const pokemonDetails = await getPokemonDetails(i);
  const about = getPokemonAbout(pokemonDetails);
  const states = getPokemonStates(pokemonDetails);
  const sprites = pokemonDetails.sprites;

  pokemonDialogRef.innerHTML = dialogContentTemplate(i, types, about, states, sprites);

  btnAboutRef = document.getElementById("btn-about");
  btnStatRef = document.getElementById("btn-stat");
  btnSpriteRef = document.getElementById("btn-sprite");
  aboutContentRef = document.getElementById("about-content");
  stateContentRef = document.getElementById("state-content");
  spriteContentRef = document.getElementById("sprite-content");

  btnNextDialogRef = document.getElementById("btn-next-dialog");
  btnBackDialogRef = document.getElementById("btn-back-dialog");
}

function getPokemonAbout(pokemonDetails) {
  const about = {};
  about.id = pokemonDetails.id;
  about.height = pokemonDetails.height;
  about.weight = pokemonDetails.weight;
  about.abilities = "";
  for (let i = 0; i < pokemonDetails.abilities.length; i++) {
    if (i == 0) about.abilities += pokemonDetails.abilities[i].ability.name;
    else about.abilities += ", " + pokemonDetails.abilities[i].ability.name;
  }

  return about;
}

function getPokemonStates(pokemonDetails) {
  let stats = "";
  for (let i = 0; i < pokemonDetails.stats.length; i++) {
    stats += `<p> ${pokemonDetails.stats[i].stat.name} </p>`;
  }

  return stats;
}

async function getPokemonDetails(i) {
  const response = await fetch(pokemons[i].url);
  const responseResult = await response.json();
  return responseResult;
}

function displayAbout() {
  btnAboutRef.setAttribute("class", "active-details");
  btnStatRef.classList.remove("active-details");
  btnSpriteRef.classList.remove("active-details");

  aboutContentRef.setAttribute("class", "about-content");
  stateContentRef.setAttribute("class", "d-none");
  spriteContentRef.setAttribute("class", "d-none");
}

function displayStats() {
  btnStatRef.setAttribute("class", "active-details");
  btnAboutRef.classList.remove("active-details");
  btnSpriteRef.classList.remove("active-details");
  stateContentRef.setAttribute("class", "state-content");
  aboutContentRef.setAttribute("class", "d-none");
  spriteContentRef.setAttribute("class", "d-none");
}

function displaySprites() {
  btnSpriteRef.setAttribute("class", "active-details");
  btnAboutRef.classList.remove("active-details");
  btnStatRef.classList.remove("active-details");

  spriteContentRef.setAttribute("class", "sprite-content");
  aboutContentRef.setAttribute("class", "d-none");
  stateContentRef.setAttribute("class", "d-none");
}

function nextPokemon(i) {
  if (i < pokemons.length) {
    let types = "";
    if (pokemons[i].types.length > 0)
      for (let j = 0; j < pokemons[i].types.length; j++) {
        types += `<p> ${pokemons[i].types[j].type.name} </p>`;
      }

    showDialog(i, types);
  } else {
    btnNextDialogRef.setAttribute("class", "v-none");
  }
}

function previousPokemon(i) {
  if (i >= 0) {
    let types = "";
    if (pokemons[i].types.length > 0)
      for (let j = 0; j < pokemons[i].types.length; j++) {
        types += `<p> ${pokemons[i].types[j].type.name} </p>`;
      }

    showDialog(i, types);
  } else {
    btnBackDialogRef.setAttribute("class", "v-none");
  }
}
