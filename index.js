
const cover = document.querySelector("#centerlogo")
const center = document.querySelector('#center')
const logotype = document.querySelector("#logotype")
const filter = document.querySelector("#blob")
const songlist = document.querySelector("#songlist")
const about = document.querySelector(".logo img")
const songs = document.querySelector("#songs")

let songsUrls
let currentIndex


// analyzer
const AudioContext = window.AudioContext || window.webkitAudioContext;
let actx = new AudioContext();
const analyser = actx.createAnalyser();

let bufferLength = analyser.frequencyBinCount;
let dataArray = new Uint8Array(bufferLength);

let audio = new Audio()
let src = actx.createMediaElementSource(audio)
src.connect(analyser);
analyser.connect(actx.destination);


initializeSongsList()




audio.addEventListener('timeupdate', () => {

    let percentage = Math.trunc(audio.currentTime * 100 / audio.duration)
    logotype.style.backgroundPositionX = `${percentage}%`

    analyser.getByteFrequencyData(dataArray)

    let sum = dataArray.reduce((accumulator, currentValue) => accumulator + currentValue)

    let magnitude = Math.trunc(sum / bufferLength)

    filter.querySelector('fedisplacementmap').setAttribute('scale', magnitude)

    if (magnitude > 50) {
        filter.querySelector('feturbulence').setAttribute('seed', percentage)

    }

    center.style.transform = `scale(1.${magnitude / 256})`

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
            let index = currentIndex === 0 ? 1 : 0
            updateEverything(index)
        })
        songlist.prepend(li)

    })


}
function updateCover(index) {

    switch (index) {
        case 0:
            cover.src = './assets/kennedy.jpg'
            center.classList.remove('about')
            break;
        case 1:
            cover.src = './assets/composizione.png'
            center.classList.remove('about')
            break;
        case undefined:
            cover.src = './assets/l.png'
            center.classList.remove('about')
            break;
        case 'about':
            cover.src = './assets/group.jpg'
            center.classList.add('about')
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


    audio.src = index === 1 ? './assets/composizione.mp3' : './assets/parco.mp3'
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


function* nameGenerator() {
    yield 'prospekt';
    yield 'leo:vocals';
    yield 'dan:guitar';
    yield 'mavi:vocals';
    yield 'guc:bass';
    yield 'gioele:drums';
    yield 'simone:keys';
    yield 'prospekt';
}

const gen = nameGenerator();
