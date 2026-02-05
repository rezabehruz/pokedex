const contentRef = document.getElementById("content");

async function renderPokemones() {
  await getPokemons();

  for (let i = 0; i < pokemons.length; i++) {
    let types = "";
    if (pokemons[i].types.length > 0) {
      for (let j = 0; j < pokemons[i].types.length; j++) {
        types += `<p> ${pokemons[i].types[j].type.name} </p>`;
      }
    }
    contentRef.innerHTML += pokemonTemplate(pokemons[i], types);
  }
}

async function getPokemons() {
  const url = "https://pokeapi.co/api/v2/pokemon?limit=20&offset=0";
  let response = await fetch(url);
  response = await response.json();
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
