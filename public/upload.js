const fileInput = document.querySelector('.image');
const postImage = document.querySelector('#post-image');
const label = document.querySelector('.image-label');
const form = document.querySelector('.ad-form');
const alert = document.querySelector('.alert');
const price = document.querySelector('.price');
const warning = document.querySelector('.warning');

form.addEventListener('submit', (e) => {
  if (fileInput.files.length > 3) {
    e.preventDefault();
    alert.classList.replace('alert-primary', 'alert-danger');
    alert.style.display = 'block';
    alert.innerHTML = 'Images must not be more than 3';
    return;
  }
console.log(postImage.files.length);
console.log('postImage.files.length');
  if (postImage.files.length < 1) {
    console.log('less than 1')
    e.preventDefault();
    alert.classList.replace('alert-primary', 'alert-danger');
    alert.style.display = 'block';
    alert.innerHTML = 'please select at least one image';
    return;
  }
  alert.style.display = 'none';
});

fileInput.addEventListener('change', () => {
  const fileLen = fileInput.files.length;
  if (fileLen > 1) {
    label.childNodes[3].innerHTML = `${fileLen} photos`;
  } else if (fileLen === 1) {
    label.childNodes[3].innerHTML = `${fileInput.files[0].name}`;
  }
});

price.addEventListener('change', (e) => {
  // eslint-disable-next-line
  if (isNaN(parseFloat(price.value))) {
    e.target.value = '';
    price.style.borderColor = 'red';
    warning.innerHTML = 'Price must be number';
    warning.style.color = 'red';
    return;
  }
  price.style.borderColor = '#ccc';
  warning.innerHTML = '';
  const priceDigits = `${price.value}`.split('');
  const digitsInThrees = [];
  while (priceDigits.length > 3) {
    digitsInThrees.unshift(priceDigits.splice(-3, 3).join(''));
  }
  digitsInThrees.unshift(priceDigits.join(''));
  price.value = `${digitsInThrees.flat().toString()}.00`;
});
