// Описаний в документації
import flatpickr from "flatpickr";
// Додатковий імпорт стилів
import "flatpickr/dist/flatpickr.min.css";
// Описаний у документації
import iziToast from "izitoast";
// Додатковий імпорт стилів
import "izitoast/dist/css/iziToast.min.css";


const startTimerBtn = document.querySelector('button[data-start]');
const dataTimePicker = document.querySelector('#datetime-picker');
const daysCounter = document.querySelector('.value[data-days]');
const hoursCounter = document.querySelector('.value[data-hours]');
const minutesCounter = document.querySelector('.value[data-minutes]');
const secondsCounter = document.querySelector('.value[data-seconds]');

// змінна для збереження дати 
let userSelectedDate = 0;

// Налаштування для Flatpickr
const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        const dateDifference = selectedDates[0] - Date.now();
        if (dateDifference > 0) {
            startTimerBtn.disabled = false;
            userSelectedDate = selectedDates[0];
        } else {
            startTimerBtn.disabled = true;
            iziToast.error({
                title: 'Error',
                message: 'Please choose a date in the future',
                position: 'topRight',
                closeOnEscape: true,
            });
        }
    },
};

flatpickr('#datetime-picker', options);

startTimerBtn.addEventListener('click', timerInit);

function timerInit() {
    startTimerBtn.disabled = true;
    dataTimePicker.disabled = true;

    const intervalId = setInterval(() => {
        const dateDifference = userSelectedDate - Date.now();

        if (dateDifference <= 0) {
            clearInterval(intervalId);
            dataTimePicker.disabled = false;
            iziToast.info({
                title: 'Notification',
                message: 'The timer has expired',
                position: 'topRight',
                theme: 'dark',
                closeOnEscape: true,
            });
            return;
        }

        const timerValues = convertMs(dateDifference);

        secondsCounter.textContent = addLeadingZero(timerValues.seconds);
        minutesCounter.textContent = addLeadingZero(timerValues.minutes);
        hoursCounter.textContent = addLeadingZero(timerValues.hours);
        daysCounter.textContent = addLeadingZero(timerValues.days)
    }, 1000);
}

function addLeadingZero(value) {
    return value.toString().padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
