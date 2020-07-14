const order = false;

const breakfastPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    if (order) {
      resolve('Breakfast is served!')
    } else {
      reject(Error('Sorry, there was a problem with your order!'));
    }

  }, 3000);
});

console.log(breakfastPromise);
breakfastPromise
  .then(val => {
    console.log(val);
  })
  .catch(err => {
    console.log(err);
  });