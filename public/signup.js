const moreDetails = document.querySelector('#more-details');
const artist = document.querySelector('#artist');
const artLover = document.querySelector('#art-lover');
const button = document.querySelector('.button');
const inputs = [...document.getElementsByTagName('input')];
const alert = document.querySelector('#alert');
let isArtist = false;


inputs.forEach((input) => {
  input.addEventListener('change', () => {
    alert.style.display = 'none';
    if (input.classList.contains('redBorder')) {
      input.classList.remove('redBorder');
    }
  });
});

const isFormComplete = () => {
  for (let index = 0; index < inputs.length; index += 1) {
    if (index < 4 && inputs[index].value === '' && !isArtist) {
      return false;
    }
    if (inputs[index].value === '' && isArtist) {
      return false;
    }
  }

  return true;
};

const switchForm = () => {
  alert.style.display = 'none';
  inputs.forEach((input) => {
    // eslint-disable-next-line
    input.value = '';

    if (input.classList.contains('redBorder')) {
      input.classList.remove('redBorder');
    }
  });
};

artist.addEventListener('click', () => {
  isArtist = true;
  switchForm();
  moreDetails.style.display = 'block';
  artLover.classList.add('box-shadow');
  artist.classList.remove('box-shadow');
  artLover.style.cursor = 'pointer';
  artist.style.cursor = 'default';
});

artLover.addEventListener('click', () => {
  isArtist = false;
  switchForm();
  moreDetails.style.display = 'none';
  artLover.classList.remove('box-shadow');
  artist.classList.add('box-shadow');
  artLover.style.cursor = 'default';
  artist.style.cursor = 'pointer';
});

button.addEventListener('click', (e) => {
  if (!isFormComplete()) {
    e.preventDefault();
    alert.style.display = 'block';
    alert.innerHTML = 'Please input all info';
    inputs.forEach((input) => {
      if (input.value === '') {
        input.classList.add('redBorder');
      }
    });
    return;
  }

  alert.style.display = 'none';
});
