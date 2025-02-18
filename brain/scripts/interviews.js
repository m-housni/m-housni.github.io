const mcqs = [];
const tags = new Map();

try {
  fetch("./brain/db/mcqs.json")
    .then((response) => response.json())
    .then((data) => {
      document.body.classList.remove("hidden");

      mcqs.push(...data);
      displayQuestion(mcqs);
      getTags();
      
    });
} catch (error) {
  console.error(error);
}

function displayQuestion(data) {
  const mcqsContainer = document.getElementById("mcqs");
  mcqsContainer.innerHTML = "";
  const questionDiv = document.createElement("div");
  // ramdomize the questions
  data = data.sort(() => Math.random() - 0.5);
  questionDiv.innerHTML =
    `<h3 class="font-semibold">${data[0].question}</h3>` +
    `<ul class="list-disc list-inside">${data[0].options
      .map((option) => `<li class="text-sm">${option}</li>`)
      .join("")}</ul>` +
    `<div class="mt-4">${data[0].answer}</div>` +
    `<div class="mt-4">${data[0].explanation}</div>` +
    `<div class="mt-4 text-nowrap">${data[0].tags
      .map((e) => {
        return `<span onclick="filterByTag('${e}')" class="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs mr-2 cursor-pointer">${e}</span>`;
      })
      .join("")}</div>`;

  mcqsContainer.appendChild(questionDiv);
}

function filterByTag(tag) {
  const filteredData = mcqs.filter((mcq) => mcq.tags.includes(tag));
  displayQuestion(filteredData);
}

function getTags() {
  mcqs.forEach((mcq) => {
    mcq.tags.forEach((tag) => {
      if (tags.has(tag)) {
        tags.set(tag, tags.get(tag) + 1);
      } else {
        tags.set(tag, 1);
      }
    });
  });
  const sortedTags = new Map([...tags.entries()].sort((a, b) => b[1] - a[1]));
  tags.clear();
  sortedTags.forEach((value, key) => tags.set(key, value));

  const tagsContainer = document.getElementById("tags");
  tagsContainer.innerHTML = "<div class='text-nowrap'>";
  tags.forEach((value, key) => {
    tagsContainer.innerHTML += `<span onclick="filterByTag('${key}')"   class="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs mr-2 cursor-pointer">${key} (${value})</span>`;
  });
  tagsContainer.innerHTML += "</div>";


}
