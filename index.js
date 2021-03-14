
const cover = document.querySelector("#centerlogo")
const center = document.querySelector('#center')
const logotype = document.querySelector("#logotype")
const filter = document.querySelector("#blob")
const songlist = document.querySelector("#songlist")
const about = document.querySelector(".logo img")
const songs = document.querySelector("#songs")



let songsUrls
let currentIndex
let player = new Audio()


// analyzer
const AudioContext = window.AudioContext || window.webkitAudioContext;
const actx = new AudioContext();
const analyser = actx.createAnalyser();

const fftSize = 128;
let bufferLength = null;
let dataArray = null;

let audio = new Audio()
let src = actx.createMediaElementSource(audio)

// 





window.addEventListener("DOMContentLoaded", async () => {

    // load songs data, create li elements
    await initializeSongsList()

})


audio.addEventListener('timeupdate', () => {

    let percentage = Math.trunc(player.currentTime * 100 / player.duration)
    logotype.style.backgroundPositionX = `${percentage}%`

    analyser.getByteFrequencyData(dataArray)

    let sum = dataArray.reduce((accumulator, currentValue) => accumulator + currentValue)

    let magnitude = Math.trunc(sum / bufferLength)

    console.log(magnitude)

    filter.querySelector('fedisplacementmap').setAttribute('scale', magnitude)

    if (magnitude > 50) {
        filter.querySelector('feturbulence').setAttribute('seed', percentage)

    }

    center.style.transform = `scale(1.${magnitude / 256})`

})
cover.addEventListener("click", () => {


    if (currentIndex !== undefined && currentIndex !== 'about') {

        if (audio.paused) {
            // player.play()
            audio.play()
        } else {
            // player.pause()
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




// async function getYoutubeAudioStreamUrl(videoId) {

//     let corsProxy = 'https://api.allorigins.win/get?url='
//     let youtubeUrl = "https://youtube.com/get_video_info?video_id="
//     let url = corsProxy + youtubeUrl + videoId



//     try {

//         let res = await fetch(url)
//         let data = await res.text()
//         data = parseYtData(data)
//         let formats = JSON.parse(data.player_response).streamingData.adaptiveFormats;
//         let findAudioInfo = formats.findIndex(obj => obj.audioQuality);
//         let audioURL = formats[findAudioInfo].url;

//         return audioURL



//     } catch (error) {
//         console.log(error)
//     }

//     function parseYtData(str) {
//         return str.split('&').reduce(function (params, param) {
//             var paramSplit = param.split('=').map(function (value) {
//                 return decodeURIComponent(value.replace('+', ' '));
//             });
//             params[paramSplit[0]] = paramSplit[1];
//             return params;
//         }, {});
//     }



// }
// function getVideoId(youtubeUrl) {

//     return youtubeUrl.replace("https://www.youtube.com/watch?v=", "")

// }
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
async function updatePlayer(index) {

    if (index === 'about' || index === undefined) {
        player.src = ''
        return
    }

    let song = songsUrls[index]


    let url = song.streaming.youtube
    url = getVideoId(url)
    url = await getYoutubeAudioStreamUrl(url)
    player.src = url
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
                console.log(currentIndex)
                cycleNames()
            }
            break;
    }
}
function updateAnalyzer(index) {

    if (index === 'about' || index === undefined) {
        audio.src = ''
        return
    }

    audio.src = index === 1 ? './assets/composizione.mp3' : './assets/parco.mp3'
    audio.load()

    src.connect(analyser);
    analyser.connect(actx.destination);
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

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

        console.log('same index')
        return
    }

    updateCover(index)
    updateLogotype(index)
    // updatePlayer(index)
    updateAnalyzer(index)
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
