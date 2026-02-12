function pokemonTemplate(i, types) {
  return /*html*/ `          
         <article id="pokemon-${i}" class="card card1" onclick="showDialog(${i}, '${types}')">
            <h2 class="roboto-bold">${renderPokemonsArr[i].name}</h2>
            <div class="card-details">
              <div class="type-details roboto-semi-bold">
                ${types}
              </div>
              <img src="${renderPokemonsArr[i].sprites.front_default}" alt="${renderPokemonsArr[i].name}" />
            </div>
          </article>`;
}

function dialogContentTemplate(i, types, about, stats, sprites) {
  return /*html*/ `
         <div class="content">
            <div class="head-content">
              <div class="header-close-btn">
              <h2 class="roboto-bold">${renderPokemonsArr[i].name}</h2>
              <button onclick="closeDialog()" class="roboto-semi-bold">close</button>
              </div>
              <div class="types-img">
                <div class="types">
                  ${types}
                </div>
                <img src="${renderPokemonsArr[i].sprites.front_default}" alt="${renderPokemonsArr[i].name}" />
              </div>
            </div>
            <div class="main-content">
              <div class="menu roboto-bold">
                <a href="#"> <button id="btn-about" class="active-details" onclick="displayAbout()">About</button></a>
                <a href="#"> <button id="btn-stat" onclick="displayStats()">Base Stats</button></a>
                <a href="#"> <button id="btn-sprite" onclick="displaySprites()">Sprites</button></a>
              </div>
              <div class="details-content">
                <section id="about-content" class="about-content ">
                    <p>ID: ${about.id}</p>
                    <p>Height: ${about.height}</p>
                    <p>weight: ${about.weight}</p>
                    <p>abilities: ${about.abilities}</p>
                </section>
                <section id="state-content" class="d-none">${stats}</section>
                <section id="sprite-content" class="d-none">
                  <img src="${sprites.back_default}" alt="${renderPokemonsArr[i]}">
                  <img src="${sprites.back_shiny}" alt="${renderPokemonsArr[i]}">
                  <img src="${sprites.front_shiny}" alt="${renderPokemonsArr[i]}">
                </section>  
              </div>
            </div>
            <div class="footer-content">
              <button id="btn-back-dialog" onclick="previousPokemon(${i-1})">Previous</button>
              <button id="btn-next-dialog" onclick="nextPokemon(${i+1})">Next</button>
            </div>
          </div>
  `;
}
