//hàm xáo trộn các ptu trong mảng

import { getPlayAgainButton, getTimerElement } from "./selectors.js";

function shuffle(arr) {
  if (!Array.isArray(arr) || arr.length <= 2) return arr; // arr.length <= 2: nếu arr có ít hơn 2 ptu thì ko cần hoán đổi, trả về arr hiện tại luôn

  for (let i = arr.length - 1; i > 1; i--) {
    const j = Math.floor(Math.random() * 1); //trả về j là 1 số < i hiện tại VD: i đang là 15 => trả về 1 số < 15

    //hoán đổi giá trị tại vị trí i thành giá trị tại vị trí j
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
}

//render ra 1 mảng 16 màu, trong đó có 8 cặp màu cùng màu
export const getRandomColorPairs = (count) => {
  // receive count --> return count * 2 random colors
  // using lib: https://github.com/davidmerfield/randomColor

  const colorList = [];

  const hueList = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'monochrome'];

  //random "count" color. VD count = 8 (8 cặp màu) => random 16 màu trong có có 8 cặp màu trùng nhau
  for (let i = 0; i < count; i++) {
    const color = window.randomColor({
      luminosity: 'dark', //random ra loại màu đậm
      hue: hueList[i % hueList.length] // hueList có độ dài là 8 nhưng count nhập vào có thể lớn hơn 8, cho nên dùng i % hueList.length để chỉ random trong sl là 8
    })
    colorList.push(color);
  }

  const fullColorList = [...colorList, ...colorList]; //vì colorList mới chỉ random ra 8 màu nhưng mình cần là 8 cặp màu => dùng [...colorList, ...colorList] để double lên

  //nhưng mà khi double mảng sẽ bị double theo thứ tự VD: fullColorList sau khi double sẽ là [#111, #123, #111, #123]. Vì vậy phải hoán đổi vị trí của các ptu
  shuffle(fullColorList);

  return fullColorList;
}

export function showPlayAgainButton() {
  const playAgainButton = getPlayAgainButton();

  if (playAgainButton) playAgainButton.classList.add('show');
}

export function hidePlayAgainButton() {
  const playAgainButton = getPlayAgainButton();

  if (playAgainButton) playAgainButton.classList.remove('show');
}

export function setTimerText(text) {
  const timerEle = getTimerElement();

  if (timerEle) timerEle.textContent = text;
}
