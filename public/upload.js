const fileInput = document.querySelector("#image"),
  label = document.querySelector("#image-label"),
  form = document.querySelector("#ad-form"),
  alert = document.querySelector(".alert"),
  price = document.querySelector("#price"),
  warning = document.querySelector("#warning");

form.addEventListener("submit", e => {
  e.preventDefault();

  if (fileInput.files.length > 3) {
    alert.classList.replace("alert-primary", "alert-danger");
    alert.style.display = "block";
    alert.innerHTML = "Images must not be more than 3";
    return;
  } else {
    alert.style.display = "none";
  }
});

fileInput.addEventListener("change", e => {
  let fileLen = fileInput.files.length;
  if (fileLen > 1) {
    label.childNodes[3].innerHTML = `${fileLen} photos`;
  } else if (fileLen === 1) {
    label.childNodes[3].innerHTML = `${fileInput.files[0].name}`;
  }
});

price.addEventListener("change", e => {
  if (isNaN(parseFloat(price.value))) {
    e.target.value = ``;
    price.style.borderColor = "red";
    warning.innerHTML = "Price must be number";
    warning.style.color = "red";
    return;
  }
  price.style.borderColor = "#ccc";
  warning.innerHTML = "";
  let priceDigits = `${price.value}`.split("");
  let digitsInThrees = [];
  while (priceDigits.length > 3) {
    digitsInThrees.unshift(arr.splice(-3, 3).join(""));
  }
  digitsInThrees.unshift(priceDigits.join(""));
  price.value = `${digitsInThrees.flat().toString()}.00`;
});
