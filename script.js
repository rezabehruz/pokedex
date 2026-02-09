const contentRef = document.getElementById("content");
const btnBackwardRef = document.getElementById("btn-back");
const btnForwarddRef = document.getElementById("btn-next");
const countPaginationRef = document.getElementById("pagination-content");

let totalPagination;
let currentPagination = 1;

let renderStartID = 1;

async function renderPokemones() {
  if (pokemons.length == 0) await getPokemons(apiURL);
  else if (pokemons.length < renderStartID) await getPokemons(nextURL);
  else;

  contentRef.innerHTML = "";
  for (let i = renderStartID - 1; i < renderStartID + 19; i++) {
    let types = "";
    if (pokemons[i].types.length > 0)
      for (let j = 0; j < pokemons[i].types.length; j++) {
        types += `<p> ${pokemons[i].types[j].type.name} </p>`;
      }
    contentRef.innerHTML += pokemonTemplate(pokemons[i], i, types);
    changeBackground(pokemons[i].types[0].type.name, i);
  }

  renderPagination();
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
  let response = await fetch(url);
  response = await response.json();
  totalPagination = Math.ceil(response.count / 20);
  nextURL = response.next;
  previousURL = response.previous;

  for (let i = 0; i < response.results.length; i++) {
    const pokemon = response.results[i];
    const types = await getPokemonsTypes(response.results[i].url);
    const sprites = await getPokemonsImages(response.results[i].url);
    pokemon.types = types;
    pokemon.sprites = sprites;
    pokemons.push(pokemon);
  }
}

function showDialog() {
  document.getElementById("pokemon-dialog").showModal();
  document.getElementById("pokemon-dialog").classList.add("pokemon-dialog");
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
      btnForwarddRef.classList.add("v-none");
      break;
    case totalPagination - 1:
      btnForwarddRef.classList.remove("v-none");
      break;
    default:
      break;
  }
}

async function getPokemonsTypes(url) {
  let response = await fetch(url);
  response = await response.json();
  return response.types;
}

async function getPokemonsImages(url) {
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
