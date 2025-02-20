'use strict';
// ---- Functions ----

function getInitials(fullName) {
  return fullName
    .split(' ')
    .map((word) => word[0]?.toLowerCase())
    .join('');
}

function getShortName(name) {
  const splittedName = name.split(' ');
  splittedName[splittedName.length - 1] = splittedName.at(-1)[0];
  return splittedName.join(' ');
}

function toIntlCurrency(value, region, currency) {
  return new Intl.NumberFormat(region, {
    style: 'currency',
    currency: currency,
  }).format(value);
}

function toIntlDate(date, region) {
  return new Intl.DateTimeFormat(region, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function manageAnimation(element, oldAnimationClass, newAnimationClass) {
  element.classList.remove(oldAnimationClass);
  void element.offsetWidth;
  element.classList.add(newAnimationClass);
}

function addTransfer(movement, movementDate, movementPerson, region, currency) {
  const transferWrap = document.createElement('a');
  transferWrap.classList.add('transfer', 'link_reset');
  transferWrap.href = '';

  const transferValueWrap = document.createElement('div');
  transferValueWrap.classList.add('transfer__value__wrap');

  const transferCircle = document.createElement('div');
  transferCircle.classList.add('transfer__circle');

  const transferValue = document.createElement('div');
  transferValue.classList.add('transfer__value');

  const transferPerson = document.createElement('div');
  transferPerson.classList.add('transfer__person');

  const transferDateWrap = document.createElement('div');
  transferDateWrap.classList.add('transfer__date');

  const transferDate = document.createElement('div');

  const transferDateHours = document.createElement('div');
  transferDateHours.classList.add('transfer__date__hours');

  const intlMovementDate = toIntlDate(movementDate, region).split(', ');

  transferCircle.classList.add(movement >= 0 ? 'transfer__in' : 'transfer__out');

  transferValue.textContent = toIntlCurrency(movement, region, currency);
  transferPerson.textContent = getShortName(movementPerson);
  transferDate.textContent = intlMovementDate[0];
  transferDateHours.textContent = intlMovementDate[1];

  transferWrap.appendChild(transferValueWrap);
  transferValueWrap.appendChild(transferCircle);
  transferValueWrap.appendChild(transferValue);
  transferWrap.appendChild(transferPerson);
  transferWrap.appendChild(transferDateWrap);
  transferDateWrap.appendChild(transferDate);
  transferDateWrap.appendChild(transferDateHours);

  transferList.appendChild(transferWrap);
}

// ---- Variables ----

function Person(
  fullName,
  password,
  initialBalance,
  interestRate,
  movements,
  movementsDates,
  movementsPerson,
  region,
  currency
) {
  this.fullName = fullName;
  this.password = password;
  this.initialBalance = initialBalance;
  this.interestRate = interestRate;
  this.movements = movements;
  this.movementsDates = movementsDates;
  this.movementsPerson = movementsPerson;
  this.region = region;
  this.currency = currency;

  this.getCurrentBalance = function () {
    return this.initialBalance + this.movements.reduce((acc, item) => acc + item, 0);
  };
}

const persons = [
  new Person(
    'Gustavo Dior',
    1111,
    180_000,
    4.5,
    [900, -40, 5000],
    [
      new Date('2019-01-25T14:18:46.235Z'),
      new Date('2023-02-08T07:25:23.114Z'),
      new Date('2024-10-05T12:29:53.131Z'),
    ],
    ['John Karnowel', 'Jane Cloude Damme', 'Laura Poe'],
    'it',
    'EUR'
  ),
  new Person(
    'Aurora Sever',
    2222,
    9_909_999.93,
    4.5,
    [9000, 904, -5000],
    [
      new Date('2024-09-24T14:18:46.330Z'),
      new Date('2024-10-12T07:45:23.294Z'),
      new Date('2025-01-04T04:20:53.194Z'),
    ],
    ['Genry Mozaro', 'Jovvani Jarsoni', 'Alexander McQueen'],
    'en-US',
    'USD'
  ),
];

let localTransferList = localStorage.getItem('transferList');

let personIndex = -1;

// ---- DOM Variables----

const btnAuth = document.getElementById('-btn__auth');
const btnLogOut = document.getElementById('-btn__log-out');
const btnSort = document.getElementById('-btn__sort');
const btnTransfer = document.getElementById('-btn__transfer');

const inputUsername = document.getElementById('-login__username');
const inputPassword = document.getElementById('-login__password');
const mainContent = document.getElementById('-main-content');
const nav = document.getElementById('-nav');
const transferList = document.getElementById('-transfer__list');

const inputNav = document.getElementsByClassName('nav__input');
const inputTransferValue = document.getElementById('-transfer__value');
const inputTransferWhom = document.getElementById('-transfer__whom');

const infoName = document.getElementById('-info__name');
const infoValue = document.getElementById('-info__value');

// ---- Code ----

if (Boolean(localTransferList)) {
  mainContent.classList.remove('hidden');
  nav.classList.add('hidden');

  personIndex = localStorage.getItem('personIndex');
  const localPerson = persons[personIndex];
  transferList.innerHTML = localStorage.getItem('transferList');
  infoName.textContent = localPerson.fullName + '.';
  infoValue.textContent = toIntlCurrency(
    localPerson.getCurrentBalance(),
    localPerson.region,
    localPerson.currency
  );
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
  // Find Person Index in order to get access to person
  personIndex = persons.findIndex(
    (element) =>
      getInitials(element.fullName) === inputUsername.value &&
      element.password === Number(inputPassword.value)
  );

  if (personIndex === -1) {
    return;
  }

  const person = persons[personIndex];

  // Adding Every Transfer from User Data
  for (let i = 0; i < person.movements.length; i++) {
    addTransfer(
      person.movements[i],
      person.movementsDates[i],
      person.movementsPerson[i],
      person.region,
      person.currency
    );
  }

  localStorage.setItem('transferList', transferList.innerHTML);

  infoName.textContent = getShortName(person.fullName) + '.';
  infoValue.textContent = toIntlCurrency(
    person.getCurrentBalance(),
    person.region,
    person.currency
  );
  localStorage.setItem('personIndex', personIndex);

  manageAnimation(nav, 'nav_ani', 'nav_ani_reverse');
  nav.addEventListener(
    'animationend',
    () => {
      nav.classList.add('hidden');
    },
    { once: true }
  );
  mainContent.classList.remove('hidden');
  manageAnimation(mainContent, 'main_ani_reverse', 'main_ani');
});

btnTransfer.addEventListener('click', () => {
  const localPerson = persons[personIndex];

  localPerson.movements.push(Number(inputTransferValue.value) * -1);
  localPerson.movementsPerson.push(inputTransferWhom.value);
  localPerson.movementsDates.push(new Date());

  // Delete if you want
  addTransfer(
    localPerson.movements.at(-1),
    localPerson.movementsDates.at(-1),
    localPerson.movementsPerson.at(-1),
    localPerson.region,
    localPerson.currency
  );

  // Refresh Balance
  infoValue.textContent = toIntlCurrency(
    localPerson.getCurrentBalance(),
    localPerson.region,
    localPerson.currency
  );
});

btnLogOut.addEventListener('click', () => {
  manageAnimation(mainContent, 'main_ani', 'main_ani_reverse');
  mainContent.addEventListener(
    'animationend',
    () => {
      mainContent.classList.add('hidden');
      transferList.innerHTML = '';
      localStorage.clear();
    },
    { once: true }
  );
  nav.classList.remove('hidden');
  manageAnimation(nav, 'nav_ani_reverse', 'nav_ani');
});
