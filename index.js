window.addEventListener("DOMContentLoaded", () => {
    registerSW();
    addEvents();
});

async function registerSW() {
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('./sw.js')
        } catch (e) {
            console.log('SW registration failed.')
        }
    }
}

const toggleSection = (showEle, hideEle) => {
    showEle.classList.remove('hidden')
    hideEle.classList.add('hidden')
}

const getEle = selector => {
    return document.querySelector(selector)
}

const addEvents = () => {
    const home = getEle('#home')
    const aboutMe = getEle('#about-me')
    const aboutMeLink = getEle('.about-me-link')
    const homeLink = getEle('.home-link')

    aboutMeLink.addEventListener('click', () => {
        toggleSection(aboutMe, home)
    })

    homeLink.addEventListener('click', () => {
        toggleSection(home, aboutMe)
    })
}