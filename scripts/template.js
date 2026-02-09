function pokemonTemplate(pokemon, i, types) {
  return /*html*/ `          
         <article id="pokemon-${i}" class="card card1" onclick="showDialog()">
            <h2 class="roboto-bold">${pokemon.name}</h2>
            <div class="card-details">
              <div class="type-details roboto-semi-bold">
                ${types}
              </div>
              <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
            </div>
          </article>`;
}
