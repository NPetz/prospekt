
const body = document.body
const cover = document.querySelector("#centerlogo")
const center = document.querySelector('#center')
const centerContent = document.querySelector('#center-content')
const logotype = document.querySelector("#logotype")
const filter = document.querySelector("#blob")
const songlist = document.querySelector("#songlist")
const about = document.querySelector(".logo img")
const songs = document.querySelector("#songs")
const pausePlay = document.querySelector('#pausePlay')

const displacementMap = filter.querySelector('fedisplacementmap')
const turbulence = filter.querySelector('feturbulence')

const gradients = ['linear-gradient(to bottom, #eb5757, #222)', 'linear-gradient(to bottom, #1247b8, #e01c36)', 'linear-gradient(to bottom, #fffb29, #7c04af)', 'linear-gradient(to bottom, #00467f, #2fb643)'


]

let songsUrls
let currentIndex

const logoUrl = "./assets/pictures/l.png"
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

    analyser.getByteTimeDomainData(dataArray)
    let sum = dataArray.reduce((accumulator, currentValue) => accumulator + currentValue)
    let average = sum / bufferLength


    turbulence.setAttribute('seed', sum), displacementMap.setAttribute('scale', sum / bufferLength)
    centerContent.style.transform = `scale(${mapValue(average, 0, 256, 0.5, 1.1)})`


    let percentage = Math.trunc(currentTime * 100 / audio.duration)
    logotype.style.backgroundPositionX = `${100 - percentage}%`

    previousTime = currentTime

})

pausePlay.addEventListener("click", playPause)
cover.addEventListener("click", playPause)


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
                let animation = cycleNames()

                const stopAnimation = () => clearInterval(animation)
                songs.addEventListener("click", stopAnimation, { once: true })
                about.addEventListener("click", stopAnimation, { once: true })
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
        // body.style.animation = 'none'
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

    logotype.style.backgroundPositionX = `100%`

    if (index === currentIndex) {

        return
    }

    updateCover(index)
    updateLogotype(index)
    updateAudio(index)
    updateSongList(index)

    currentIndex = index

    body.style.background = gradients[Math.trunc(Math.random() * gradients.length)]
    // to do: find a better way of having moving gradient without gpu frying 
    // body.style.backgroundSize = '400% 400%'
    // body.style.animation = 'moving-gradient 15s ease-in-out infinite alternate'

}

function cycleNames() {


    const gen = namesGenerator();

    logotype.innerText = gen.next().value

    let a = setInterval(() => {
        logotype.innerText = gen.next().value
    }, 3000)

    setTimeout(() => {
        clearInterval(a)
        console.log('cleared')
    }, 22000)

    return a

}


function* namesGenerator() {
    yield 'prospekt';
    yield 'leo - vocals';
    yield 'dan - guitar';
    yield 'mavi - vocals';
    yield 'guc - bass';
    yield 'gioele - drums';
    yield 'simone - keys';
    yield 'prospekt';
}


function displacementToZeroAnimation() {

    let scale = displacementMap.getAttribute("scale")

    let stepSize = 20


    let animation = setInterval(() => {


        let newScale = scale - stepSize

        if (newScale <= 0) {
            displacementMap.setAttribute("scale", `0`)
            clearInterval(animation)
            return
        }

        displacementMap.setAttribute("scale", `${newScale}`)

        scale = newScale

    }, 100);

}

function scaleToOneAnimation() {

    let scale = +centerContent.style.transform.match(/scale\((.*)\)/)[1]

    let stepSize = 0.05

    if (scale > 1) {
        let animation = setInterval(() => {


            let newScale = scale - stepSize

            if (newScale <= 1) {
                centerContent.style.transform = "scale(1.0)"
                clearInterval(animation)
                return
            }

            centerContent.style.transform = `scale(${newScale})`

            scale = newScale

        }, 100);
    } else if (scale < 1) {
        let animation = setInterval(() => {


            let newScale = scale + stepSize

            if (newScale >= 1) {
                centerContent.style.transform = "scale(1.0)"
                clearInterval(animation)
                return
            }

            centerContent.style.transform = `scale(${newScale})`

            console.log(newScale)

            scale = newScale

        }, 100);
    }



}



async function playPause() {


    if (audio.src) {

        // body.style.animation = 'none'

        if (audio.paused) {
            await actx.resume()
            await audio.play()
            center.classList.add('playing')
            center.classList.remove('paused')


        } else {
            audio.pause()
            displacementToZeroAnimation()
            scaleToOneAnimation()
            center.classList.add('paused')
            center.classList.remove('playing')
        }
    } else {
        console.log('no sources')
    }

}

function mapValue(num, in_min, in_max, out_min, out_max) {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min
}