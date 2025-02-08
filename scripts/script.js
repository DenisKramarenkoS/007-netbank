'use strict';
// ---- Functions ----

function getInitials(fullName) {
  return fullName.split(' ').map(word => word[0]?.toUpperCase()).join('');
}

// ---- Variables ----

const person = {
  fullName: 'Gustavo Dior',
  initialBalance: 180000,
  interestRate: 4.5,
  movements: [900, -40, 5000],
  movementsDates: [
    '2019-01-25T14:18:46.235Z',
    '2023-02-08T07:25:23.114Z',
    '2024-10-05T12:29:53.131Z',
  ],
  region: 'it',
  currency: 'EUR',
};

const person2 = {
  fullName: 'Aurora Sever',
  initialBalance: 9909999.93,
  interestRate: 4.5,
  movements: [9000, 904, -5000],
  movementsDates: [
    '2024-09-24T14:18:46.330Z',
    '2024-10-12T07:45:23.294Z',
    '2025-01-04T04:20:53.194Z',
  ],
  region: 'en-US',
  currency: 'USD',
};

console.log(getInitials(person2.fullName));
// ---- DOM Variables----

// ---- Code ----
