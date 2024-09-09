document.addEventListener("DOMContentLoaded", () => {
    const footer = document.getElementById('creator');
    footer.addEventListener("click", () => {
        window.open("https://github.com/barkinvar");
    });

        const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', filterPokemons);
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
    const pokeContainer = createPokeContainer(pokeData);
    insertPokemonInOrder(pokeContainer, pokeData.id, document.getElementById('poke-container'));
}

function createPokeContainer(pokeData) {
    const container = document.createElement("div");
    container.classList.add('ui', 'card');
    container.dataset.pokeNumber = pokeData.id; // Store Pokémon number as a data attribute
    container.dataset.pokeName = pokeData.name.toLowerCase(); // Store Pokémon name in lowercase for easier searching

    container.addEventListener("click", () => {
        window.open(`https://pokemondb.net/pokedex/${pokeData.id}`);
    });

    container.appendChild(createPokeImage(pokeData.id));
    container.appendChild(createPokeName(pokeData.name));
    container.appendChild(createPokeNumber(pokeData.id));
    container.appendChild(createTypes(pokeData.types));

    return container;
}

function createPokeImage(pokeID) {
    const pokeImgContainer = document.createElement('div');
    pokeImgContainer.classList.add('image');

    const pokeImage = document.createElement('img');
    pokeImage.srcset = `https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${convertToPaddedString(pokeID, 3)}.png`;
    pokeImage.style.cssText = `
        height: 90%;
        padding-top: 20px;
    `;

    pokeImgContainer.appendChild(pokeImage);
    return pokeImgContainer;
}

function createPokeName(name) {
    const pokeName = document.createElement('h4');
    pokeName.innerText = capitalizeFirstLetter(name);
    return pokeName;
}

function createPokeNumber(id) {
    const pokeNumber = document.createElement('p');
    pokeNumber.innerText = `#${id}`;
    return pokeNumber;
}

function createTypes(types) {
    const typesContainer = document.createElement('div');
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
        typesContainer.appendChild(typeLi);
    });
    return typesContainer;
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

function filterPokemons() {
    const searchText = document.getElementById('search').value.trim().toLowerCase();

    const allPokemonContainer = document.getElementById('poke-container');
    const pokeContainers = allPokemonContainer.querySelectorAll('.ui.card');

    pokeContainers.forEach(container => {
        const pokeName = container.dataset.pokeName;
        const pokeNumber = container.dataset.pokeNumber;

        // Check if the search text matches the Pokémon name or number
        const nameMatches = pokeName.includes(searchText);
        const numberMatches = pokeNumber.startsWith(searchText);

        if (nameMatches || numberMatches) {
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
        }
    });
}