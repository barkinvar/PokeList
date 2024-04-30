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

async function fetchKantoPokemon() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=905');
        const allpokemon = await response.json();
        console.log(allpokemon);
        
        for (const pokemon of allpokemon.results) {
            await fetchPokemonData(pokemon);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function fetchPokemonData(pokemon) {
    try {
        let url = pokemon.url;
        const response = await fetch(url);
        const pokeData = await response.json();
        renderPokemon(pokeData);
    } catch (error) {
        console.error('Error fetching pokemon data:', error);
    }
}

function renderPokemon(pokeData) {
    let allPokemonContainer = document.getElementById('poke-container');
    let pokeContainer = document.createElement("div")
    pokeContainer.classList.add('ui', 'card');

    pokeContainer.addEventListener("click", function() {
        window.open("https://pokemondb.net/pokedex/" + pokeData.id);
    });

    createPokeImage(pokeData.id, pokeContainer);

    let pokeName = document.createElement('h4')
    pokeName.innerText = pokeData.name
    pokeName.innerText = pokeName.innerText.charAt(0).toUpperCase() + pokeName.innerText.slice(1);

    let pokeNumber = document.createElement('p')
    pokeNumber.innerText = `#${pokeData.id}`

    pokeContainer.append(pokeName, pokeNumber);
    createTypes(pokeData.types, pokeContainer)
    allPokemonContainer.appendChild(pokeContainer);
}

function createTypes(types, ul) {
    types.forEach(function (type) {
        let typeLi = document.createElement('li');
        typeLi.innerText = type['type']['name'];
        ul.append(typeLi)
    })
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
