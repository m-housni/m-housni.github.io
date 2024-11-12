document.addEventListener('DOMContentLoaded', () => {
  const url = `data.json?t=${new Date().getTime()}`; // Adds a unique timestamp

  fetch(url)
    .then(response => response.json())
    .then(data => {
      document.querySelector('#title').textContent = data.title;
      document.querySelector('#summary').textContent = data.summary;
    })
    .catch(error => console.error('Error loading JSON data:', error));
});
