// DOM Elements Memoing

const body = document.body
const centerimage = document.querySelector("#centerimage")
const centersection = document.querySelector('#centersection')
const centercontent = document.querySelector('#centercontent')
const centertext = document.querySelector("#centertext")
const filter = document.querySelector("#blob")
const singleslist = document.querySelector("#singleslist")
const socialsection = document.querySelector('#socialsection')
const aboutwrapper = document.querySelector("#aboutwrapper")
const songsection = document.querySelector("#songsection")
const controller = document.querySelector('#controller')

const displacementMap = filter.querySelector('fedisplacementmap')
const turbulence = filter.querySelector('feturbulence')

// other useful memoing

const gradients = ['linear-gradient(to bottom, #43e97b , #38f9d7 );', 'linear-gradient(to bottom, #1247b8, #e01c36)', 'linear-gradient(to bottom, #fffb29, #7c04af)', 'linear-gradient(to bottom, #00467f, #2fb643)', 'linear-gradient(to top, #30cfd0 0%, #330867 100%);', 'linear-gradient(to bottom, #434343 0%, black 100%);']

let currentPage = 'home'
let playerStatus = 'initial'
let currentSong = ''

const logoUrl = "./assets/pictures/l.png"
const groupPictureUrl = "./assets/pictures/group.jpg"

// memoing for the custom player

let previousTime = 0

const AudioContext = window.AudioContext || window.webkitAudioContext;
let actx = new AudioContext();
const analyser = actx.createAnalyser();
analyser.fftSize = 64;
let bufferLength = analyser.frequencyBinCount;
let dataArray = new Uint8Array(bufferLength);
let player = new Audio()
let src = actx.createMediaElementSource(player)
src.connect(analyser);
analyser.connect(actx.destination);

// initialize DOM with songs

initializeSongsList()

//////////////////////////////





















// FUNCTIONS




// TO INITIALIZE DOM & FETCH DATA
// fetch data
async function fetchSongsData() {
    try {

        let res = await fetch("./data.json")
        let data = await res.json()
        return data

    } catch (error) {
        console.log(error)
        console.log('couldnt fetch songs data')
    }
}
// initalize DOM from Data
function createSongElementsFromData(data) {

    if (data) {

        data.singles.forEach((el, ix) => {



            let li = document.createElement("li")
            li.innerText = el.title
            li.setAttribute('data-order', ix)
            li.addEventListener("click", clickOnSongName)
            singleslist.prepend(li)

            if (!ix) {
                li.classList.add('selectedsong')
            }
        })

    } else {
        console.log('your data is non-existent')
    }

}
// put those things together 
async function initializeSongsList() {

    let songsData = await fetchSongsData()
    createSongElementsFromData(songsData)

}
/////////////////////////////////////////////



// EVENT HANDLERS

function clickOnSongName() {
    console.log('song')
}

// STATE MANAGEMENT

// ANIMATIONS



// UTILS
