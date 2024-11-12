document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
      .then(response => response.json())
      .then(data => {
        // Populate only title and summary
        document.querySelector('#title').textContent = data.title;
        document.querySelector('#summary').textContent = data.summary;
      })
      .catch(error => console.error('Error loading JSON data:', error));
  });
