'use strict';
// ---- Functions ----

function getInitials(fullName) {
  return fullName
    .split(' ')
    .map((word) => word[0]?.toLowerCase())
    .join('');
}

// ---- Variables ----

const persons = [
  {
    fullName: 'Gustavo Dior',
    password: 1111,
    initialBalance: 180_000,
    interestRate: 4.5,
    movements: [900, -40, 5000],
    movementsDates: ['2019-01-25T14:18:46.235Z', '2023-02-08T07:25:23.114Z', '2024-10-05T12:29:53.131Z'],
    region: 'it',
    currency: 'EUR',
  },
  {
    fullName: 'Aurora Sever',
    password: 2222,
    initialBalance: 9_909_999.93,
    interestRate: 4.5,
    movements: [9000, 904, -5000],
    movementsDates: ['2024-09-24T14:18:46.330Z', '2024-10-12T07:45:23.294Z', '2025-01-04T04:20:53.194Z'],
    region: 'en-US',
    currency: 'USD',
  },
];

let isLogIn = Boolean(localStorage.getItem('isLogIn'));

// ---- DOM Variables----
const btnAuth = document.getElementById('-btn__auth');
const btnLogOut = document.getElementById('-btn__log-out');
const inputUsername = document.getElementById('-login__username');
const inputPassword = document.getElementById('-login__password');
const mainContent = document.getElementById('-main-content')

const inputNav = document.getElementsByClassName('nav__input');

// ---- Code ----

if (isLogIn) {
  mainContent.classList.remove('hidden');
}

btnAuth.addEventListener('click', () => {
  if (!inputUsername.checkValidity() || !inputPassword.checkValidity()) {
    for (const element of inputNav) {
      element.classList.add('nav__input_ani-color');

      element.addEventListener(
        'animationend',
        () => {
          element.classList.remove('nav__input_ani-color');
        },
        { once: true }
      );
    }
    return;
  }

  for (const person of persons) {
    // console.log(getInitials(person.fullName) === input);
    if (getInitials(person.fullName) === inputUsername.value && person.password === Number(inputPassword.value)) {
      mainContent.classList.remove('hidden');
      localStorage.setItem("isLogIn", "true")
    }
  }
});

btnLogOut.addEventListener('click', () => {
  mainContent.classList.add('hidden');
  localStorage.removeItem('isLogIn');
})
