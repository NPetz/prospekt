
const cover = document.querySelector("#centerlogo")
const center = document.querySelector('#center')
const centerContent = document.querySelector('#center-content')
const logotype = document.querySelector("#logotype")
const filter = document.querySelector("#blob")
const songlist = document.querySelector("#songlist")
const about = document.querySelector(".logo img")
const songs = document.querySelector("#songs")

const displacementMap = filter.querySelector('fedisplacementmap')
const turbulence = filter.querySelector('feturbulence')

let songsUrls
let currentIndex

const logoUrl = "./assets/pictures/l.jpg"
const groupPictureUrl = "./assets/pictures/group.jpg"

// 
let previousTime = 0
// 


// analyzer
const AudioContext = window.AudioContext || window.webkitAudioContext;
let actx = new AudioContext();
const analyser = actx.createAnalyser();
analyser.fftSize = 64;

let bufferLength = analyser.frequencyBinCount;
let dataArray = new Uint8Array(bufferLength);

let audio = new Audio()
let src = actx.createMediaElementSource(audio)
src.connect(analyser);
analyser.connect(actx.destination);


initializeSongsList()




audio.addEventListener('timeupdate', () => {

    let currentTime = audio.currentTime

    if (currentTime - previousTime > 0.01) {

        analyser.getByteTimeDomainData(dataArray)
        let sum = dataArray.reduce((accumulator, currentValue) => accumulator + currentValue)

        if (sum / bufferLength > 150) {

            turbulence.setAttribute('seed', sum)

        }



        previousTime = currentTime
    }



    // let percentage = Math.trunc(audio.currentTime * 100 / audio.duration)
    // logotype.style.backgroundPositionX = `${percentage}%`



    // 

    // let magnitude = Math.trunc(sum / bufferLength)

})
cover.addEventListener("click", async () => {


    if (currentIndex !== undefined && currentIndex !== 'about') {

        if (audio.paused) {

            await audio.play()
        } else {
            audio.pause()
        }

    } else {

        updateEverything()
    }

})
about.addEventListener('click', () => {

    if (currentIndex === 'about') {
        updateEverything()
    } else {
        updateEverything('about')
    }

})

songs.addEventListener('click', () => {
    updateEverything(0)
})

async function initializeSongsList() {

    let res = await fetch("./data.json")
    let data = await res.json()

    if (data) {
        songsUrls = data.singles
    }

    data.singles.forEach((el, ix) => {

        let li = document.createElement("li")
        li.innerText = el.title
        li.setAttribute('data-order', ix)
        li.addEventListener("click", (e) => {
            e.stopPropagation()
            updateEverything(+!ix)
        })
        songlist.prepend(li)

    })


}
function updateCover(index) {

    switch (index) {
        case undefined:
            cover.src = logoUrl
            center.classList.remove('about')
            break;
        case 'about':
            cover.src = groupPictureUrl
            center.classList.add('about')
            break;
        default:
            cover.src = songsUrls[index].cover
            console.log(songsUrls[index].cover)
            center.classList.remove('about')
            break;

    }

}
function updateLogotype(index) {

    switch (index) {
        case 0:
            logotype.innerText = songsUrls[index].title
            break;
        case 1:
            logotype.innerText = songsUrls[index].title
            break;
        case undefined:
            logotype.innerText = 'prospekt'
            break;
        case 'about':
            if (currentIndex !== 'about') {
                cycleNames()
            }
            break;
    }
}

async function updateAudio(index) {

    if (index === 'about' || index === undefined) {
        return
    }

    await actx.resume()


    audio.src = songsUrls[index].src
    audio.load()

    audio.addEventListener('canplay', () => {
        audio.play()
        console.log('can play');
    }, { once: true })


}
function updateSongList(index) {

    if (index === 'about' || index === undefined) {
        songs.querySelector(`h1`).style.display = 'flex'
        songs.querySelector(`ul`).style.display = 'none'
        songs.querySelector(`li.active`)?.classList.remove('active')
        return
    }

    songs.querySelector(`h1`).style.display = 'none'
    songs.querySelector(`ul`).style.display = 'flex'
    songs.querySelector(`li.active`)?.classList.remove('active')
    songs.querySelector(`li[data-order="${index}"]`).classList.add('active')


}
function updateEverything(index) {

    logotype.style.backgroundPositionX = `0%`

    if (index === currentIndex) {

        return
    }

    updateCover(index)
    updateLogotype(index)
    updateAudio(index)
    updateSongList(index)

    currentIndex = index
}

function cycleNames() {



    logotype.innerText = gen.next().value
    let a = setTimeout(() => {
        logotype.innerText = gen.next().value
    }, 5000)
    let b = setTimeout(() => {
        logotype.innerText = gen.next().value
    }, 12000)
    let c = setTimeout(() => {
        logotype.innerText = gen.next().value
    }, 19000)
    let d = setTimeout(() => {
        logotype.innerText = gen.next().value
    }, 26000)
    let e = setTimeout(() => {
        logotype.innerText = gen.next().value
    }, 33000)
    let f = setTimeout(() => {
        logotype.innerText = gen.next().value
    }, 40000)
    let g = setTimeout(() => {
        logotype.innerText = gen.next().value
    }, 47000)
}


function* namesGenerator() {
    yield 'prospekt';
    yield 'leo:vocals';
    yield 'dan:guitar';
    yield 'mavi:vocals';
    yield 'guc:bass';
    yield 'gioele:drums';
    yield 'simone:keys';
    yield 'prospekt';
}

const gen = namesGenerator();
