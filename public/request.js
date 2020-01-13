const requestButton = document.querySelector('#requestButton');
const alert = document.querySelector('.alert');

requestButton.addEventListener('click', (e) => {
  e.preventDefault();
  const postId = requestButton.getAttribute('data-postId');

  requestButton.disable = true;
  requestButton.style.backgroundColor = '#ccc';
  requestButton.innerText = 'sending...';

  fetch(`/auth/request/${postId}`)
    .then((res) => {
      if (res.status >= 200 && res.status <= 299) {
        return res.json();
      }
      throw Error('An error occured, Please try again');
    })
    .then((data) => {
      alert.innerText = data;
      alert.classList.remove('hide');
      requestButton.innerText = 'sent';
    })
    .catch((error) => {
      alert.classList.remove('alert-success');
      alert.classList.add('alert-danger');
      alert.classList.remove('hide');
      requestButton.innerText = 'try again';
      alert.innerText = error;
    });
});
