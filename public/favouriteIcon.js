const hearts = document.querySelectorAll(".icon");

for (let heart of hearts) {
  heart.addEventListener("click", () => {
    if (heart.classList.contains("fa-heart-o")) {
      heart.classList.replace("fa-heart-o", "fa-heart");
    } else if (heart.classList.contains("fa-heart")) {
      heart.classList.replace("fa-heart", "fa-heart-o");
    }
  });
}
