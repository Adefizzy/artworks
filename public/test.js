window.addEventListener('load', async () => {
  console.log('loaded');
  try {
    const res = await fetch('/auth/job');
    const data = res.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
});
