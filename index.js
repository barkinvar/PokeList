document.addEventListener("DOMContentLoaded", () => {
    const footer = document.getElementById('creator');
    footer.addEventListener("click", () => {
        window.open("https://github.com/barkinvar");
    });
    renderEverything();
});

function renderEverything() {
    const bgAudio = document.getElementById("bgAudio");
    bgAudio.play();
    const allPokemonContainer = document.querySelector('#poke-container');
    allPokemonContainer.innerText = "";
    fetchPokemon().catch(error => console.error("Failed to fetch Kanto Pokémon:", error));
}

async function fetchPokemon() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=905');
        const data = await response.json();
        const pokemonPromises = data.results.map(pokemon => fetchPokemonData(pokemon));
        await Promise.all(pokemonPromises);
    } catch (error) {
        console.error("Error fetching Kanto Pokémon:", error);
    }
}

async function fetchPokemonData(pokemon) {
    try {
        const response = await fetch(pokemon.url);
        const pokeData = await response.json();
        renderPokemon(pokeData);
    } catch (error) {
        console.error(`Error fetching Pokémon data for ${pokemon.name}:`, error);
    }
}

function renderPokemon(pokeData) {
    const allPokemonContainer = document.getElementById('poke-container');
    const pokeContainer = document.createElement("div");
    pokeContainer.classList.add('ui', 'card');

    pokeContainer.addEventListener("click", () => {
        window.open(`https://pokemondb.net/pokedex/${pokeData.id}`);
    });

    createPokeImage(pokeData.id, pokeContainer);

    const pokeName = document.createElement('h4');
    pokeName.innerText = capitalizeFirstLetter(pokeData.name);

    const pokeNumber = document.createElement('p');
    pokeNumber.innerText = `#${pokeData.id}`;

    pokeContainer.append(pokeName, pokeNumber);
    createTypes(pokeData.types, pokeContainer);

    insertPokemonInOrder(pokeContainer, pokeData.id, allPokemonContainer);
}

function createTypes(types, container) {
    types.forEach(type => {
        const typeName = type.type.name;
        const typeLi = document.createElement('p');
        typeLi.textContent = typeName.toUpperCase();
        typeLi.style.cssText = `
            font-size: 80%;
            text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.5);
            width: 45%;
            margin-left: 27.5%;
            color: white;
            background-color: ${getTypeColor(typeName)};
            font-weight: bold;
            border: 1px solid black;
            border-radius: 5px;
        `;
        container.append(typeLi);
    });
}

function getTypeColor(typeName) {
    const typeColors = {
        normal: '#A8A77A',
        fire: '#EE8130',
        water: '#6390F0',
        electric: '#F7D02C',
        grass: '#7AC74C',
        ice: '#96D9D6',
        fighting: '#C22E28',
        poison: '#A33EA1',
        ground: '#E2BF65',
        flying: '#A98FF3',
        psychic: '#F95587',
        bug: '#A6B91A',
        rock: '#B6A136',
        ghost: '#735797',
        dragon: '#6F35FC',
        dark: '#705746',
        steel: '#B7B7CE',
        fairy: '#D685AD'
    };
    return typeColors[typeName] || '#000000';
}

function createPokeImage(pokeID, containerDiv) {
    const pokeImgContainer = document.createElement('div');
    pokeImgContainer.classList.add('image');

    const pokeImage = document.createElement('img');
    pokeImage.srcset = `https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${convertToPaddedString(pokeID, 3)}.png`;
    pokeImage.style.cssText = `
        width: 80%;
        height: 80%;
        padding-top: 20px;
    `;

    pokeImgContainer.append(pokeImage);
    containerDiv.append(pokeImgContainer);
}

function convertToPaddedString(number, paddingLength) {
    return number.toString().padStart(paddingLength, '0');
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function insertPokemonInOrder(pokeContainer, pokeID, allPokemonContainer) {
    const children = Array.from(allPokemonContainer.children);
    let inserted = false;

    for (const existingPokemon of children) {
        const existingPokemonID = parseInt(existingPokemon.querySelector('p').innerText.substring(1));
        if (pokeID < existingPokemonID) {
            allPokemonContainer.insertBefore(pokeContainer, existingPokemon);
            inserted = true;
            break;
        }
    }

    if (!inserted) {
        allPokemonContainer.appendChild(pokeContainer);
    }
}
