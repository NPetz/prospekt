// imports
import { Gradient, normalizeColor } from './gradient.js'
// DOM Elements Memoing

const body = document.body
const centerimage = document.querySelector("#centerimage")
const centersection = document.querySelector('#centersection')
const centercontent = document.querySelector('#centercontent')
const centertext = document.querySelector("#centertext")
const filter = document.querySelector("#distortion")
const singleslist = document.querySelector("#singleslist")
const socialsection = document.querySelector('#socialsection')
const aboutwrapper = document.querySelector("#aboutwrapper")
const songsection = document.querySelector("#songsection")
const controller = document.querySelector('#controller')
const gradientCanvas = document.querySelector('#gradient-canvas')



const displacementMap = filter.querySelector('fedisplacementmap')
const turbulence = filter.querySelector('feturbulence')

// other useful memoing


let currentScreen = 'home'
let playerStatus = 'initial'
let currentSong = null

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

// initialise backgorund canvas

var gradient = new Gradient();
gradient.initGradient("#gradient-canvas");


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
                // li.classList.add('selectedsong')
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
    changeGradient()
}

// STATE MANAGEMENT

// ANIMATIONS

function changeGradient() {

    gradient.uniforms.u_waveLayers.value.forEach((v, ix) => {
        let hex = Please.make_color({ saturation: (Math.random() + 1) / 2, value: (Math.random() + 1) / 2 })[0]
        let normalCol = normalizeColor('0x' + hex.substring(1))
        v.value.color.value = normalCol

    })
    gradient.uniforms.u_baseColor.value = normalizeColor('0x' + Please.make_color({ saturation: 1.0 })[0].substring(1))

    gradient.uniforms.u_global.value.noiseSpeed.value = Math.random() / 70000
    gradient.uniforms.u_global.value.noiseFreq.value = [Math.random() / 2000, Math.random() / 2000]

}




// UTILS
