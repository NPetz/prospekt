
const player = document.querySelector("#player")
const cover = document.querySelector(".background img")
const logotype = document.querySelector("#logotype")
const filter = document.querySelector("#blob")
const songlist = document.querySelector("#songlist")
let songsUrls

window.addEventListener("DOMContentLoaded", async () => {

    await initializeSongs()

    // await loadSong(0)

    // unloadSong()

})







async function getYoutubeAudioStreamUrl(videoId) {

    let corsProxy = 'https://api.allorigins.win/get?url='
    let youtubeUrl = "https://youtube.com/get_video_info?video_id="
    let url = corsProxy + youtubeUrl + videoId



    try {

        let res = await fetch(url)
        let data = await res.text()
        data = parseYtData(data)
        let formats = JSON.parse(data.player_response).streamingData.adaptiveFormats;
        let findAudioInfo = formats.findIndex(obj => obj.audioQuality);
        let audioURL = formats[findAudioInfo].url;

        return audioURL



    } catch (error) {
        console.log(error)
    }

    function parseYtData(str) {
        return str.split('&').reduce(function (params, param) {
            var paramSplit = param.split('=').map(function (value) {
                return decodeURIComponent(value.replace('+', ' '));
            });
            params[paramSplit[0]] = paramSplit[1];
            return params;
        }, {});
    }



}
function getVideoId(youtubeUrl) {

    return youtubeUrl.replace("https://www.youtube.com/watch?v=", "")

}
async function initializeSongs() {

    let res = await fetch("./data.json")
    let data = await res.json()

    if (data) {
        songsUrls = data.singles
    }

    data.singles.forEach((el, ix) => {

        let li = document.createElement("li")
        li.innerText = el.title
        li.setAttribute('data-order', ix)
        li.addEventListener("click", () => {
            loadSong(ix)
        })
        songlist.prepend(li)

    })


}
async function loadSong(index) {

    let song = songsUrls[index]

    let url = song.streaming.youtube
    url = getVideoId(url)
    player.src = await getYoutubeAudioStreamUrl(url)

    cover.src = song.cover

    logotype.innerText = song.title

    filter.querySelector("fedisplacementmap").setAttribute('scale', '50')

}
function unloadSong() {
    cover.src = "/assets/l.png"
    logotype.innerText = "prospekt"

    filter.querySelector("fedisplacementmap").setAttribute('scale', '0')
}
