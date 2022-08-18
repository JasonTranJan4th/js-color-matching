import { GAME_STATUS, PAIRS_COUNT } from './constants.js'
import { getColorElementList, getColorListElement } from './selectors.js';
import { getRandomColorPairs } from './utils.js';

// Global variables
let selections = []
let gameState = GAME_STATUS.PLAYING

// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click

function handleColorClick(liELe) {
    if (!liELe) return;
    liELe.classList.add('active');
}

function initColors() {
    //random 8 cặp màu
    const colorList = getRandomColorPairs(PAIRS_COUNT);

    //bind vào thẻ li có div.overlay
    const liList = getColorElementList(); //get all li

    liList.forEach((liEle, index) => {
        const overlayEle = liEle.querySelector('.overlay');
        if (overlayEle) overlayEle.style.backgroundColor = colorList[index];
    })
}

function attachEventForColorList() {
    const ulEle = getColorListElement();

    if (!ulEle) return;

    ulEle.addEventListener('click', (event) => {
        handleColorClick(event.target);
    })
}

(() => {

    initColors();

    attachEventForColorList();
})();
