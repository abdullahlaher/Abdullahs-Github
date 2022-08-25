import { getPaused } from '../gameLogic'

export function startTimer(
  duration: number,
  display: HTMLElement,
  onCountDownExpired: () => void,
) {
  var timer = duration,
    timerDisplay
  setInterval(function () {
    if (getPaused()) return

    if(timer < 10){
      timerDisplay = '0' + timer
    }
    else{
      timerDisplay = timer
    }

    display.innerHTML = '00' + ':' + timerDisplay

    if (--timer < 0) {
      duration = 0
      onCountDownExpired()
    }
  }, 1000)
}
