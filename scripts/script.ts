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
  if (splittedName.length === 1) {
    return name;
  }
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

function getRandomFromRange(a, b) {
  return parseFloat((Math.random() * (b - a) + a).toFixed(2));
}
function addTransfer(movement, movementDate, movementPerson, investType, region, currency) {
  if (movementPerson === 'invest') {
    addPercent(
      {
        movements: [movement],
        movementsDates: [movementDate],
        region: region,
        currency: currency,
      },
      investType
    );
    return;
  }

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

function addPercent({ movements, movementsDates, region, currency }, investTypeStr) {
  const transferWrap = document.createElement('div');
  transferWrap.classList.add('transfer_percent', 'link_reset');

  const transferInfoWrap = document.createElement('div');
  transferInfoWrap.classList.add('transfer__info-container');

  const transferValue = document.createElement('div');
  transferValue.classList.add('transfer__value');

  const transferPercentage = document.createElement('div');
  transferPercentage.classList.add('transfer__percentage');

  const transferDateWrap = document.createElement('div');
  transferDateWrap.classList.add('transfer__date');

  const transferDate = document.createElement('div');

  const transferDateHours = document.createElement('div');
  transferDateHours.classList.add('transfer__date__hours');

  const btnGet = document.createElement('button');
  btnGet.classList.add('btn__default', 'btn_reset', 'btn__action', 'btn__get-invest');
  btnGet.textContent = 'Get';
  btnGet.type = 'button';

  const intlMovementDate = toIntlDate(movementsDates.at(-1), region).split(', ');

  transferValue.textContent = toIntlCurrency(movements.at(-1) * -1, region, currency);
  transferPercentage.textContent = investTypeStr; // Do Do Do Do
  transferDate.textContent = intlMovementDate[0];
  transferDateHours.textContent = intlMovementDate[1];

  transferWrap.appendChild(transferInfoWrap);
  transferWrap.appendChild(btnGet);
  transferInfoWrap.appendChild(transferValue);
  transferInfoWrap.appendChild(transferPercentage);
  transferInfoWrap.appendChild(transferDateWrap);
  transferDateWrap.appendChild(transferDate);
  transferDateWrap.appendChild(transferDateHours);

  transferList.appendChild(transferWrap);
}

/**
 * @param  {...any} args
 * @returns true if invalid, false if valid
 */
function checkInputValidity(...args) {
  const arr = [...args];

  if (arr.map((item) => item.checkValidity()).includes(false)) {
    // Play Animation
    for (const element of arr) {
      element.classList.add('nav__input_ani-color');

      element.addEventListener(
        'animationend',
        () => {
          element.classList.remove('nav__input_ani-color');
        },
        { once: true }
      );
    }
    return true;
  }
}

function refreshBalance(localPersonObj) {
  infoValue.textContent = toIntlCurrency(
    localPersonObj.getCurrentBalance(),
    localPersonObj.region,
    localPersonObj.currency
  );
}

function refreshName(localPersonObj) {
  infoName.textContent = getShortName(localPersonObj.fullName) + '.';
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
  typeOfInvest,
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
  this.typeOfInvest = typeOfInvest;
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
    [900, -40, 5000, -800],
    [
      new Date('2019-01-25T14:18:46.235Z'),
      new Date('2023-02-08T07:25:23.114Z'),
      new Date('2024-10-05T12:29:53.131Z'),
      new Date('2024-11-05T12:29:53.131Z'),
    ],
    ['John Knawel', 'Jane Claude Dame', 'Laura Poe', 'invest'],
    [null, null, null, 'Perspective'],
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
    ['Henry Moro', 'Jovian Jayson', 'Alexander McQueen'],
    [null, null, null],
    'en-US',
    'USD'
  ),
];

const localTransferList: string | null = localStorage.getItem('transferList');

let personIndex = -1;
let investBtnCurrentText = '';

// ---- DOM Variables----

// Buttons
const btnAuth = (document.getElementById('-btn__auth') as HTMLButtonElement) || null;
const btnLogOut = (document.getElementById('-btn__log-out') as HTMLButtonElement) || null;
const btnSort = (document.getElementById('-btn__sort') as HTMLButtonElement) || null;
const btnTransfer = (document.getElementById('-btn__transfer') as HTMLButtonElement) || null;
const btnBorrow = (document.getElementById('-btn__borrow') as HTMLButtonElement) || null;
const btnInvest = (document.getElementById('-btn__invest') as HTMLButtonElement) || null;

// Input
const inputUsername = (document.getElementById('-login__username') as HTMLInputElement) || null;
const inputPassword = (document.getElementById('-login__password') as HTMLInputElement) || null;
const inputTransferValue =
  (document.getElementById('-transfer__value') as HTMLInputElement) || null;
const inputTransferWhom = (document.getElementById('-transfer__whom') as HTMLInputElement) || null;
const inputBorrowValue = (document.getElementById('-borrow__value') as HTMLInputElement) || null;
const inputInvest = (document.getElementById('-input__invest') as HTMLInputElement) || null;

// Divs
const mainContent = (document.getElementById('-main-content') as HTMLElement) || null;
const nav = (document.getElementById('-nav') as HTMLElement) || null;
const transferList = (document.getElementById('-transfer__list') as HTMLElement) || null;
const infoName = (document.getElementById('-info__name') as HTMLDivElement) || null;
const infoValue = (document.getElementById('-info__value') as HTMLDivElement) || null;
const investBtnsOptions = (document.getElementById('-invest__btns') as HTMLDivElement) || null;

// Classes
const inputNav = document.getElementsByClassName(
  'nav__input'
) as HTMLCollectionOf<HTMLInputElement>;
const btnsSelective = document.getElementsByClassName(
  'btn__selective'
) as HTMLCollectionOf<HTMLButtonElement>;

// ---- Code ----

if (localTransferList !== null) {
  mainContent.classList.remove('hidden');
  nav.classList.add('hidden');

  personIndex = Number(localStorage.getItem('personIndex'));
  const localPerson = persons[personIndex];
  transferList.innerHTML = localTransferList;

  refreshName(localPerson);
  refreshBalance(localPerson);
}

btnAuth.addEventListener('click', () => {
  if (checkInputValidity(inputUsername, inputPassword)) {
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

  const localPerson = persons[personIndex];

  // Adding Every Transfer from User Data
  for (let i = 0; i < localPerson.movements.length; i++) {
    addTransfer(
      localPerson.movements[i],
      localPerson.movementsDates[i],
      localPerson.movementsPerson[i],
      localPerson.typeOfInvest[i],
      localPerson.region,
      localPerson.currency
    );
  }

  localStorage.setItem('transferList', transferList.innerHTML);

  refreshName(localPerson);
  refreshBalance(localPerson);

  localStorage.setItem('personIndex', personIndex.toString());

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
  if (checkInputValidity(inputTransferValue, inputTransferWhom)) {
    return;
  }
  const localPerson = persons[personIndex];

  localPerson.movements.push(Number(inputTransferValue.value) * -1);
  localPerson.movementsPerson.push(inputTransferWhom.value);
  localPerson.movementsDates.push(new Date());
  localPerson.typeOfInvest.push(null);

  addTransfer(
    localPerson.movements.at(-1),
    localPerson.movementsDates.at(-1),
    localPerson.movementsPerson.at(-1),
    null,
    localPerson.region,
    localPerson.currency
  );

  refreshBalance(localPerson);
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

btnBorrow.addEventListener('click', () => {
  if (checkInputValidity(inputBorrowValue)) {
    return;
  }

  const localPerson = persons[personIndex];

  localPerson.movements.push(Number(inputBorrowValue.value));
  localPerson.movementsPerson.push('Borrow');
  localPerson.movementsDates.push(new Date());
  localPerson.typeOfInvest.push('Risky');

  addTransfer(
    localPerson.movements.at(-1),
    localPerson.movementsDates.at(-1),
    localPerson.movementsPerson.at(-1),
    localPerson.typeOfInvest.at(-1),
    localPerson.region,
    localPerson.currency
  );

  refreshBalance(localPerson);
});

investBtnsOptions.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;

  if (target instanceof HTMLButtonElement) {
    for (let i = 0; i < btnsSelective.length; i++) {
      btnsSelective[i].classList.remove('btn__selective_active');
    }
    target.classList.add('btn__selective_active');
    investBtnCurrentText = target.textContent as string;
  }
});

btnInvest.addEventListener('click', () => {
  if (checkInputValidity(inputInvest)) {
    return;
  }
  const localPerson = persons[personIndex];

  localPerson.movements.push(Number(inputInvest.value) * -1);
  localPerson.movementsDates.push(new Date());
  localPerson.movementsPerson.push('invest');

  addPercent(localPerson, investBtnCurrentText);
  localStorage.setItem('transferList', transferList.innerHTML);

  refreshBalance(localPerson);
});

transferList.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;

  if (target.classList.contains('btn__get-invest')) {
    const outerElement = target.parentElement as HTMLElement;
    const investValueElement = outerElement.getElementsByClassName('transfer__value')[0];
    const investValue = Number(investValueElement?.textContent?.slice(1));

    const investMode = outerElement.getElementsByClassName('transfer__percentage')[0].textContent;

    const percent =
      investMode === 'Not risky'
        ? getRandomFromRange(0.98, 1.05)
        : investMode === 'Perspective'
        ? getRandomFromRange(0.9, 1.2)
        : getRandomFromRange(0.55, 1.7);
    console.log(percent);
  }
});
