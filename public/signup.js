const moreDetails = document.querySelector("#more-details");
const artist = document.querySelector("#artist");
const artLover = document.querySelector("#art-lover");

artist.addEventListener("click", () => {
  moreDetails.style.display = "block";
  artLover.classList.add("box-shadow");
  artist.classList.remove("box-shadow");
  artLover.style.cursor = "pointer";
  artist.style.cursor = "default";
});

artLover.addEventListener("click", () => {
  moreDetails.style.display = "none";
  artLover.classList.remove("box-shadow");
  artist.classList.add("box-shadow");
  artLover.style.cursor = "default";
  artist.style.cursor = "pointer";
});
