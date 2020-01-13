const modalImage = document.querySelector('.modal-body img');
const modalButton = document.querySelector('#enlargePhotoButton');

modalButton.addEventListener('click', () => {
  const mainImage = document.querySelector('.active img');
  const imageLink = mainImage.getAttribute('data-carousel-image');
  modalImage.setAttribute('src', imageLink);
});
