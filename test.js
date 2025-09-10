function blockEventLoop() {
  console.log("Blocking the event loop now...");
  while (true) {
  }
  console.log("This will never be printed.");
}

// Filename: buggy-app.js
// This script is supposed to fetch user data, process it, and update the UI.
// But it is full of common mistakes.

// 1. Global variable that can be easily overwritten.
var currentUser = 'admin';

function checkPermissions(user) {
  // 2. Using loose equality (==) can lead to unexpected type coercion.
  // '1' == 1 is true, which might not be what's intended.
  if (user.id == 1 && user.isAdmin) {
    return true;
  } else {
    return false;
  }
}

const user = {
  id: '1', // The ID is a string, not a number.
  name: 'John Doe',
  isAdmin: true,
  // 3. 'this' context is lost in the callback.
  // In the setTimeout, 'this' will refer to the global object (window/global), not the 'user' object.
  greet: function() {
    setTimeout(function() {
      console.log('Hello, my name is ' + this.name); // Will log "Hello, my name is undefined"
    }, 1000);
  }
};

user.greet();

// 4. Misunderstanding of asynchronous loops.
// This will print 3, 3, 3 instead of 0, 1, 2 because the loop finishes
// before the setTimeout callbacks execute, and they all share the same 'i' from the parent scope.
for (var i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log('The value of i is: ' + i);
  }, 10);
}

// 5. Unhandled promise rejection.
// If the API call fails (e.g., network error), this will cause an 'Uncaught (in promise)' error.
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => {
    console.log('Data fetched successfully');
  });


function processItems(items) {
  // 6. Mutating an array while iterating over it can cause items to be skipped.
  // When an item is removed, the indexes of subsequent items shift down.
  for (let i = 0; i < items.length; i++) {
    if (items[i].value < 10) {
      items.splice(i, 1);
    }
  }
  return items;
}

const initialItems = [{value: 5}, {value: 20}, {value: 2}, {value: 30}];
console.log('Processed items:', processItems(initialItems)); // Output is incorrect

// 7. Using for...in to iterate over an array.
// This can include properties from the Array's prototype chain, leading to unexpected behavior.
Array.prototype.customMethod = function() {};
const numbers = [10, 20, 30];
let sum = '0'; // 8. Initializing sum as a string.

for (const i in numbers) {
  // 9. Implicit string concatenation instead of addition.
  // '0' + 10 becomes '010', then '01020', then '0102030'.
  sum += numbers[i];
}
console.log('The sum is: ' + sum); // Expected 60, but gets '0102030'

// 10. Incorrectly copying an object.
// This is a shallow copy. Modifying 'copiedConfig' will also modify the original 'appConfig'.
const appConfig = { settings: { theme: 'dark' } };
const copiedConfig = appConfig;
copiedConfig.settings.theme = 'light';

console.log('Original theme:', appConfig.settings.theme); // Is now 'light', which was unintended.

function getReportTitle(report) {
  // 11. Not handling null or undefined inputs.
  // If 'report' is null or undefined, this will throw a TypeError: Cannot read properties of null.
  return report.title.toUpperCase();
}

// console.log(getReportTitle()); // This would crash the script.

function createLargeArray() {
  const bigArray = [];
  // 12. Off-by-one error.
  // This loop runs 1,000,001 times instead of 1,000,000 because of the '<='.
  for (let i = 0; i <= 1000000; i++) {
    bigArray.push(i);
  }
  // 13. Synchronous blocking operation.
  // This complex calculation can freeze the browser or server while it's running.
  bigArray.sort(() => Math.random() - 0.5);
  return bigArray;
}

// console.log("Creating a large, sorted array... this might take a moment.");
// createLargeArray();
// console.log("Array created.");