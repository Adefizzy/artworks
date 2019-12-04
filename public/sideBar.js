const USER = document.querySelector("#USER");
const SIDEBAR = document.querySelector("#sideBar");
const CONTAINER = document.querySelector(
  ".container-fluid, #art-preview, #postAd, #edit-post-container"
);
function navBarAnimation() {
  if (
    !SIDEBAR.classList.contains("openSideBar") &&
    !SIDEBAR.classList.contains("closeSideBar")
  ) {
    SIDEBAR.classList.add("openSideBar");
  } else if (SIDEBAR.classList.contains("openSideBar")) {
    SIDEBAR.classList.remove("openSideBar");
    SIDEBAR.classList.add("closeSideBar");
  } else if (SIDEBAR.classList.contains("closeSideBar")) {
    SIDEBAR.classList.remove("closeSideBar");
    SIDEBAR.classList.add("openSideBar");
  }
}

USER.addEventListener("click", () => {
  navBarAnimation();
});

CONTAINER.addEventListener("click", () => {
  if (SIDEBAR.classList.contains("openSideBar")) navBarAnimation();
});

window.addEventListener("scroll", () => {
  if (SIDEBAR.classList.contains("openSideBar")) navBarAnimation();
});
