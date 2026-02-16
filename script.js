// #region global variables
const mainContentRef = document.getElementById("main-content");
const contentLoadingRef = document.getElementById("content-loading");
const btnLoadMoreRef = document.getElementById("btn-load-more");
const pokemonDialogRef = document.getElementById("pokemon-dialog");

let renderPokemonsArr;
let searchResultPokemons;
let lastRendertIndex = 0;

let aboutContentRef, stateContentRef, spriteContentRef;
let btnAboutRef, btnStatRef, btnSpriteRef;
let btnNextDialogRef, btnBackDialogRef;

// endregion

//#region render Pokemons
async function renderPokemones() {
  if (pokemons.length == 0) await getPokemons(apiURL);

  for (let i = lastRendertIndex; i < renderPokemonsArr.length; i++) {
    let types = "";
    if (renderPokemonsArr[i].types.length > 0)
      for (let j = 0; j < renderPokemonsArr[i].types.length; j++) {
        types += typeTemplate(renderPokemonsArr[i].types[j].type.name);
      }
    mainContentRef.innerHTML += pokemonTemplate(i, types);
    changeBackground(renderPokemonsArr[i].types[0].type.name, i);
  }

  lastRendertIndex = renderPokemonsArr.length;
}

function renderAllPokemons() {
  lastRendertIndex = 0;
  mainContentRef.innerHTML = "";
  renderPokemonsArr = pokemons;

  renderPokemones();

  btnLoadMoreRef.classList.remove("d-none");
}

function renderProgress(progress) {
  if (progress == "loading") {
    contentLoadingRef.setAttribute("class", "content-loading");
    btnLoadMoreRef.disabled = true;
  } else {
    contentLoadingRef.setAttribute("class", "d-none");
    btnLoadMoreRef.disabled = false;
  }
}

async function getPokemons(url) {
  renderProgress("loading");
  let response = await fetch(url);
  response = await response.json();
  nextURL = response.next;
  for (let i = 0; i < response.results.length; i++) {
    const pokemon = response.results[i];
    const types = await getPokemonTypes(pokemon.url);
    const sprites = await getPokemonImages(pokemon.url);
    pokemon.types = types;
    pokemon.sprites = sprites;
    pokemons.push(pokemon);
  }

  renderPokemonsArr = pokemons;
  renderProgress("loaded");
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

//#endregion

//#region load More
async function loadMore() {
  await getPokemons(nextURL);
  renderPokemones();
}

//#endregion

//#region Dialog
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

  crtlRenderDialog(i);
}

function crtlRenderDialog(i) {
  if (i + 1 == renderPokemonsArr.length) btnNextDialogRef.setAttribute("class", "v-none");

  if (i == 0) btnBackDialogRef.setAttribute("class", "v-none");
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
    stats += `<p> ${pokemonDetails.stats[i].stat.name} : ${pokemonDetails.stats[i].base_stat}</p>`;
  }

  return stats;
}

async function getPokemonDetails(i) {
  const response = await fetch(renderPokemonsArr[i].url);
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
  if (i < renderPokemonsArr.length) {
    let types = "";
    if (renderPokemonsArr[i].types.length > 0)
      for (let j = 0; j < renderPokemonsArr[i].types.length; j++) {
        types += `<p> ${renderPokemonsArr[i].types[j].type.name} </p>`;
      }

    showDialog(i, types);
  }
}

function previousPokemon(i) {
  if (i >= 0) {
    let types = "";
    if (renderPokemonsArr[i].types.length > 0)
      for (let j = 0; j < renderPokemonsArr[i].types.length; j++) {
        types += `<p> ${renderPokemonsArr[i].types[j].type.name} </p>`;
      }

    showDialog(i, types);
  }
}

function closeDialog() {
  pokemonDialogRef.close();
}

//#endregion

//#region search
function search(event) {
  event.preventDefault();
  const searchValue = document.getElementById("input-search").value;
  mainContentRef.innerHTML = "";

  searchResultPokemons = pokemons.filter((pokemon) => pokemon.name.includes(searchValue));

  if (searchResultPokemons.length > 0) renderPokemonsArr = searchResultPokemons;
  else renderPokemonsArr = [];

  renderToHtml();
}

function renderToHtml() {
  if (renderPokemonsArr.length > 0) {
    for (let i = 0; i < renderPokemonsArr.length; i++) {
      let types = "";
      for (let j = 0; j < renderPokemonsArr[i].types.length; j++) {
        types += typeTemplate(renderPokemonsArr[i].types[j].type.name);
      }
      mainContentRef.innerHTML += pokemonTemplate(i, types);
      changeBackground(renderPokemonsArr[i].types[0].type.name, i);
    }
  } else mainContentRef.innerHTML = nothingFoundTemplate();

  btnLoadMoreRef.setAttribute("class", "d-none");
}

//#endregion
