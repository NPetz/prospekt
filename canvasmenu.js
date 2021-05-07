

let t = setInterval(() => {

    let menu = window.glslCanvases
    if (menu) {
        menu = menu[0]

        window.addEventListener('mousemove', (e) => {
            menu.setUniform('m', e.x / window.innerWidth, e.y / window.innerHeight)
        })

        clearInterval(t)
    }

}, 100)