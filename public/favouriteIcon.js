/* eslint-disable no-restricted-syntax */

const hearts = document.querySelectorAll('.icon');

for (const heart of hearts) {
  heart.addEventListener('click', () => {
    if (heart.classList.contains('fa-heart-o')) {
      heart.classList.replace('fa-heart-o', 'fa-heart');
    } else if (heart.classList.contains('fa-heart')) {
      heart.classList.replace('fa-heart', 'fa-heart-o');
    }
  });
}
