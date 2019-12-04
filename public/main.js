const filter = document.querySelector("#filter");
const searchForm = document.querySelector("#search-form");
const body = document.querySelector(".closeSeachForm");
filter.addEventListener("click", () => {
  if (
    !searchForm.classList.contains("open-search-form") &&
    !searchForm.classList.contains("close-search-form")
  ) {
    searchForm.style.display = "block";
    searchForm.classList.add("open-search-form");
    filter.style.display = "none";
  } else if (searchForm.classList.contains("open-search-form")) {
    searchForm.classList.replace("open-search-form", "close-search-form");
    const timer = setTimeout(() => {
      searchForm.style.display = "none";
      return clearTimeout(timer);
    }, 550);
    filter.style.display = "block";
    return;
  } else if (searchForm.classList.contains("close-search-form")) {
    searchForm.style.display = "block";
    searchForm.classList.replace("close-search-form", "open-search-form");
    filter.style.display = "none";
  }
});

window.addEventListener("scroll", () => {
  if (searchForm.classList.contains("open-search-form")) {
    searchForm.classList.replace("open-search-form", "close-search-form");
    const timer = setTimeout(() => {
      searchForm.style.display = "none";
      return clearTimeout(timer);
    }, 550);
    filter.style.display = "block";
    return;
  }
});
