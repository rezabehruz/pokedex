const contentRef = document.getElementById("content");
const btnBackwardRef = document.getElementById("btn-back");
const btnForwarddRef = document.getElementById("btn-next");
const countPaginationRef = document.getElementById("pagination-content");

let totalPagination;
let currentPagination = 1;

async function renderPokemones(urlAPI) {
  await getPokemons(urlAPI);

  contentRef.innerHTML = "";
  for (let i = 0; i < pokemons.length; i++) {
    let types = "";
    if (pokemons[i].types.length > 0) {
      for (let j = 0; j < pokemons[i].types.length; j++) {
        types += `<p> ${pokemons[i].types[j].type.name} </p>`;
      }
    }
    contentRef.innerHTML += pokemonTemplate(pokemons[i], types);
  }

  renderPagination();
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

async function getPokemons(urlAPI) {
  let response = await fetch(urlAPI);
  response = await response.json();
  totalPagination = Math.ceil(response.count / 20);
  nextURL = response.next;
  previousURL = response.previous;

  pokemons.splice(0, 20);
  for (let i = 0; i < response.results.length; i++) {
    pokemons.push(response.results[i]);
    const types = await getPokemonsType(response.results[i].url);
    const sprites = await getPokemonsImages(response.results[i].url);
    pokemons[i].types = types;
    pokemons[i].sprites = sprites;
  }
}

async function getPokemonsType(url) {
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
  renderPokemones(nextURL);
  currentPagination++;
}

function backward() {
  renderPokemones(previousURL);
  currentPagination--;
}
