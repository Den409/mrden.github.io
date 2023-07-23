var canvas = document.querySelector(".photo")
var cnvs = canvas.getBoundingClientRect()
var btn = document.querySelector(".btn")
var minRadius
var heartCount
var n = 0
var time = new Date().getTime()

canvas.insertAdjacentHTML("afterbegin", `<span class="particles" style="position: relative; top: ${cnvs.height / 2 - 17}px; left: ${cnvs.width / 2 - 15.5}px; z-index: -1;"></span>`)
var particles = document.querySelector(".particles")

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function setRadius() {
    if (window.innerWidth > 1000) {
        minRadius = 150
        heartCount = 50
    } else if (window.innerWidth > 800) {
        minRadius = 80
        heartCount = 40
    } else {
        minRadius = 50
        heartCount = 20
    }
}

function createHearts(className) {
    console.log("create", className)
    for (let i = 0; i < heartCount; i++) {
        particles.insertAdjacentHTML("afterbegin", `<img class="${className}" src="source/files/heart_${Math.ceil(Math.random() * 15)}.png" style="position: absolute; width: 30px;">`)
    }
}

function moveHearts(className, click) {
    console.log("move", className)
    var hearts = document.querySelectorAll(`.${className}`)
    for (var heart of hearts) {
        if (click) {
            heart.style.transition = `transform 5s ease-out, opacity 2.5s ease-out 2.5s, scale 2.5s ease-in 2.5s`
        } else {
            var delay = Math.random() * 10
            heart.style.transition = `transform 10s ease-out ${delay}s, opacity 5s ease-out ${delay + 5}s, scale 5s ease-in ${delay + 5}s`
        }
        var angle = Math.random() * 2 * Math.PI
        var radius = Math.random() * 100 + minRadius
        heart.style.transform = `translate(${Math.cos(angle) * radius}px, ${Math.sin(angle) * radius}px) rotate(${Math.random() * 360}deg) scale(0.2)`
        heart.style.opacity = '0'
    }
}

function deleteHearts(className) {
    console.log("delete", className)
    var hearts = document.querySelectorAll(`.${className}`)
    for (var heart of hearts) {
        heart.remove()
    }
}

async function particles_(className) {
    console.log("particles", className)
    createHearts(className)
    await sleep(50)
    moveHearts(className, false)
    await sleep(20000)
    deleteHearts(className)
}

setRadius()

window.addEventListener("resize", function () {
    cnvs = canvas.getBoundingClientRect()
    particles.style.top = `${cnvs.height / 2 - 17}px`
    particles.style.left = `${cnvs.width / 2 - 15.5}px`

    setRadius()
})

btn.onclick = async function () {
    lastClickTime = time
    if (new Date().getTime() - lastClickTime > 500) {
        time = new Date().getTime()
        var num = n
        n += 1
        createHearts(`heart-click${num}`)
        await sleep(50)
        moveHearts(`heart-click${num}`, true)
        await sleep(5000)
        deleteHearts(`heart-click${num}`)
    }
}

window.addEventListener("DOMContentLoaded", async function () {
    console.log("loaded")

    cnvs = canvas.getBoundingClientRect()
    particles.style.top = `${cnvs.height / 2 - 17}px`
    particles.style.left = `${cnvs.width / 2 - 15.5}px`

    particles_("heart-1")
    setInterval(particles_, 30000, 'heart-1')
    await sleep(10000)
    particles_('heart-2')
    setInterval(particles_, 30000, 'heart-2')
    await sleep(10000)
    particles_('heart-3')
    setInterval(particles_, 30000, 'heart-3')
})