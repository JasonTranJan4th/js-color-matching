import { GAME_STATUS, GAME_TIME, PAIRS_COUNT } from './constants.js'
import { getColorElementList, getColorListElement, getInactiveColorList, getPlayAgainButton } from './selectors.js';
import { createTimer, getRandomColorPairs, hidePlayAgainButton, setTimerText, showPlayAgainButton } from './utils.js';

// Global variables
let selections = []; // mảng lưu những ptu đã chọn
let gameStatus = GAME_STATUS.PLAYING;
let timer = createTimer({
    seconds: GAME_TIME,
    onChange: handleOnChange,
    onFinish: handleOnFinished
});

function handleOnChange(second) {
    console.log('change', second);

    //set timerText
    const fullSecond = `0${second}`.slice(-2);
    setTimerText(fullSecond);
}

function handleOnFinished() {
    console.log('finished');

    gameStatus = GAME_STATUS.FINISHED;
    setTimerText('GameOver');
}

// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click

function handleColorClick(liELe) {

    //check shouldBlocking vì khi click 3 ptu liên tiếp thì ptu 2 và 3 sẽ thực hiện đoạn setTimeout để check match nhưng vì setTimeout của ptu 2 chạy trc và clear mảng selection cho nên khi setTimeout của pt3 chạy thì trong mảng ko có ptu để so sánh => lỗi
    const shouldBlocking = [GAME_STATUS.BLOCKING, GAME_STATUS.FINISHED].includes(gameStatus);

    //isClicked để kiểm tra nếu thẻ li đó dc click r (dc thêm class active) thì khi click lại sẽ ko làm gì cả
    const isClicked = liELe.classList.contains('active');

    if (!liELe || shouldBlocking || isClicked) return; // nếu ko tìm thấy thẻ li hoặc đang có trạng thái là block hoặc finish thì ko làm gì cả
    liELe.classList.add('active');

    //save clicked cell to selection array
    selections.push(liELe);

    //kiểm tra mảng selection có đủ 2 ptu chưa (cần 2 ptu để so sánh có trùng màu jay ko). Nếu chưa thì ko làm gì
    if (selections.length < 2) return;

    //handle check match
    const firstColor = selections[0].dataset.color;
    const secondColor = selections[1].dataset.color;
    const isMatch = firstColor === secondColor;

    //if match 
    if (isMatch) {
        // kiem tra da win hay chua
        const isWin = getInactiveColorList().length === 0;

        if (isWin) {
            //show replay button 
            showPlayAgainButton();

            //show you win status
            setTimerText('You Win');

            //clear timer (win rồi thi ko cần đếm thời gian chơi nữa)
            timer.clear();

            //thay đổi giá trị của gameStatus để check (win rồi thì ko cho ấn vào các pt nữa)
            gameStatus = GAME_STATUS.FINISHED;
        }

        selections = [];
        return;
    }

    //if not match
    //remove active class for 2 li ele
    gameStatus = GAME_STATUS.BLOCKING; // handle việc ko cho click thằng thứ 3. đợi nó kiểm tra xong (setTimeOut bên dưới) thì mới dc click tiếp

    setTimeout(() => {
        selections[0].classList.remove('active');
        selections[1].classList.remove('active');

        //reset selections đẻ check cặp tiếp theo
        selections = [];

        if (gameStatus !== GAME_STATUS.FINISHED) {
            gameStatus = GAME_STATUS.PLAYING;
        } // kiểm tra 

    }, 500); // sd setTimeout vì khi click ptu t2, kiểm tra ko match thì sẽ xóa class active liền cho nên ptu thứ 2 ko hiện màu 
}

function initColors() {
    //random 8 cặp màu
    const colorList = getRandomColorPairs(PAIRS_COUNT);

    //bind vào thẻ li có div.overlay
    const liList = getColorElementList(); //get all li

    liList.forEach((liEle, index) => {
        const overlayEle = liEle.querySelector('.overlay');

        liEle.dataset.color = colorList[index];

        if (overlayEle) overlayEle.style.backgroundColor = colorList[index];
    })
}

function attachEventForColorList() {
    const ulEle = getColorListElement();

    if (!ulEle) return;

    ulEle.addEventListener('click', (event) => {

        if (event.target.tagName !== 'LI') return; //phải xử lý đoạn này vì khi click vào 1 ô để hiển thị màu thì sẽ thêm class active vào thẻ li đó, nhưng click lại lần nữa thì nó lại tự thêm class active vào thẻ div bên trong => xl để ko thêm class active vào div

        handleColorClick(event.target);
    })
}

function resetGame() {
    //reset các biến
    gameStatus = GAME_STATUS.PLAYING;
    selections = [];

    //reset DOm:
    //-remove all active class in li ele
    const colorEleList = getColorElementList();
    for (const colorEle of colorEleList) {
        colorEle.classList.remove('active');
    }

    //-hide replay button
    hidePlayAgainButton();

    //-clear you win and timer text
    setTimerText('');

    //re-generate mảng màu mới 
    initColors();

    //sau khi an reset thi cung restart lai timer
    startTimer();
}

function attachEventForReplayButton() {
    const playAgainButton = getPlayAgainButton();

    if (!playAgainButton) return;

    playAgainButton.addEventListener('click', resetGame);
}

function startTimer() {
    timer.start();
}

(() => {

    initColors();

    attachEventForColorList();


    attachEventForReplayButton();

    startTimer();
})();
