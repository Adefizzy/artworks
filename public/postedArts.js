const arrows = document.querySelectorAll('.icon');
const deleteAndEdit = document.querySelectorAll('.delete-and-edit');
const deleteButtons = document.querySelectorAll('.delete-button');
const modaltext = document.querySelector('.modal-text');
const modalDeleteForm = document.querySelector('#modal-delete-form');


arrows.forEach((arrow, index) => {
  arrow.addEventListener('click', () => {
    if (!arrow.classList.contains('arrow-up') && !arrow.classList.contains('arrow-down')) {
      arrow.classList.add('arrow-down');
      deleteAndEdit[index].classList.remove('hide');
    } else if (arrow.classList.contains('arrow-down')) {
      arrow.classList.replace('arrow-down', 'arrow-up');
      deleteAndEdit[index].classList.add('hide');
    } else {
      arrow.classList.replace('arrow-up', 'arrow-down');
      deleteAndEdit[index].classList.remove('hide');
    }
  });
});

deleteButtons.forEach((buttton, index) => {
  buttton.addEventListener('click', () => {
    const id = deleteButtons[index].getAttribute('data-post-id');
    const title = deleteButtons[index].getAttribute('data-post-title');
    modaltext.innerHTML = `Do you want to delete <strong>${title}</strong>?`;
    modalDeleteForm.setAttribute('action', `/auth/deletepost/${id}?_method=DELETE`);
  });
});
