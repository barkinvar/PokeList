document.addEventListener("DOMContentLoaded", () => {
    let generateBtn = document.querySelector('#generate-pokemon');
    generateBtn.addEventListener('click', renderEverything)

    getDeleteBtn().addEventListener('click', deleteEverything);

    let footer = document.getElementById('creator');
    footer.addEventListener("click", function() {
        window.open("https://github.com/barkinvar");
    });
})

function renderEverything() {
    var bgAudio = document.getElementById("bgAudio");
    bgAudio.play();
    let allPokemonContainer = document.querySelector('#poke-container')
    allPokemonContainer.innerText = "";
    fetchKantoPokemon();

    getDeleteBtn().style.display = 'block'
}

function getDeleteBtn() {
    return document.querySelector('#delete-btn')
}

function fetchKantoPokemon() {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=905')
        .then(response => response.json())
        .then(function (allpokemon) {
            allpokemon.results.forEach(function (pokemon) {
                fetchPokemonData(pokemon);
            })
        })
}

function fetchPokemonData(pokemon) {
    let url = pokemon.url;
    fetch(url)
        .then(response => response.json())
        .then(function (pokeData) {
            renderPokemon(pokeData)
        })
}

function renderPokemon(pokeData) {
    let allPokemonContainer = document.getElementById('poke-container');
    let pokeContainer = document.createElement("div");
    pokeContainer.classList.add('ui', 'card');

    pokeContainer.addEventListener("click", function() {
        window.open("https://pokemondb.net/pokedex/" + pokeData.id);
    });

    createPokeImage(pokeData.id, pokeContainer);

    let pokeName = document.createElement('h4');
    pokeName.innerText = pokeData.name.charAt(0).toUpperCase() + pokeData.name.slice(1);

    let pokeNumber = document.createElement('p');
    pokeNumber.innerText = `#${pokeData.id}`;


    pokeContainer.append(pokeName, pokeNumber);
    createTypes(pokeData.types, pokeContainer);

    // Check the position based on ID
    let inserted = false;
    for (let i = 0; i < allPokemonContainer.children.length; i++) {
        let existingPokemon = allPokemonContainer.children[i];
        let existingPokemonID = parseInt(existingPokemon.querySelector('p').innerText.substring(1));
        if (pokeData.id < existingPokemonID) {
            allPokemonContainer.insertBefore(pokeContainer, existingPokemon);
            inserted = true;
            break;
        }
    }
    if (!inserted) {
        allPokemonContainer.appendChild(pokeContainer);
    }
}

function createTypes(types, ul) {
    types.forEach(function (type) {
        let typeLi = document.createElement('p');
        let typeName = type['type']['name'];
        typeLi.textContent = typeName.toUpperCase();
        typeLi.style.fontSize = '80%';
        typeLi.style.textShadow = '0px 2px 2px rgba(0, 0, 0, 0.5)';
        typeLi.style.width = '45%';
        typeLi.style.marginLeft = '27.5 %';
        typeLi.style.color = 'white';
        typeLi.style.backgroundColor = getTypeColor(typeName);
        typeLi.style.fontWeight = 'bold';
        typeLi.style.border = '1px solid black'; // Adding black border
        typeLi.style.borderRadius = '5px'; // Rounding the border
        ul.append(typeLi);
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
    let pokeImgContainer = document.createElement('div')
    pokeImgContainer.classList.add('image')


    let pokeImage = document.createElement('img')
    pokeImage.srcset = `https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/${convertToPaddedString(pokeID,3)}.png`

    pokeImage.style.width = '80%';
    pokeImage.style.height = '80%';
    pokeImage.style.paddingTop = '20px';

    pokeImgContainer.append(pokeImage);
    containerDiv.append(pokeImgContainer);
}

function convertToPaddedString(number, paddingLength) {
    let numString = number.toString();
    let zerosNeeded = Math.max(paddingLength - numString.length, 0);
    let paddedString = '0'.repeat(zerosNeeded) + numString;

    return paddedString;
}

function deleteEverything(event) {
    event.target.style = 'none';
    let allPokemonContainer = document.querySelector('#poke-container')
    allPokemonContainer.innerText = ""

    let generateBtn = document.createElement('button')
    generateBtn.innerText = "Generate Pokemon"
    generateBtn.id = 'generate-pokemon'
    generateBtn.classList.add('ui', 'secondary', 'button')
    generateBtn.addEventListener('click', renderEverything);

    allPokemonContainer.append(generateBtn)
}

var colorIndex = 0;

function changeColor() {
    var button = document.querySelector('#generate-pokemon');
    if (button != null) {
        if (colorIndex == 0) { button.style.transform = 'scale(1.0)'; }
        else { button.style.transform = 'scale(1.2)'; }
    }
    colorIndex = (colorIndex + 1) % 2;
}

setInterval(changeColor, 500);
