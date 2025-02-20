const mcqs = [];
const mcqsAll = [];
const tags = new Map();

try {
  fetch("./brain/db/mcqs.json")
    .then((response) => response.json())
    .then((data) => {
      document.body.classList.remove("hidden");
      mcqsAll.push(...data);
      data = data.sort(() => Math.random() - 0.5).slice(0, 100);
      mcqs.push(...data);
      displayQuestion(mcqs);
      getTags();
      totalQuestions();
      topicsCount();
    });
} catch (error) {
  console.error(error);
}

function displayQuestion(data) {
  const mcqsContainer = document.getElementById("mcqs");
  mcqsContainer.innerHTML = "";
  // ramdomize the questions
  data = data.sort(() => Math.random() - 0.5);
  data.forEach((mcq) => {
    const questionDiv = document.createElement("div");
    questionDiv.innerHTML +=
      `<h3 class="font-semibold">${mcq.question}</h3>` +
      `<ul class="list-disc list-inside">${mcq.options
        .map((option) => `<li class="text-sm">${option}</li>`)
        .join("")}</ul>` +
      `<div class="mt-4">${mcq.answer}</div>` +
      `<div class="mt-4">${mcq.explanation}</div>` +
      `<div class="mt-4 text-nowrap">${mcq.tags
        .map((e) => {
          return `<span onclick="filterByTag('${e}')" class="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs mr-2 cursor-pointer">${e}</span>`;
        })
        .join("")}</div><hr class="my-5">`;
    mcqsContainer.appendChild(questionDiv);
  });
}

function filterByTag(tag) {
  const filteredData = mcqsAll.filter((mcq) => mcq.tags.includes(tag));
  displayQuestion(filteredData);
}

function getTags() {
  mcqsAll.forEach((mcq) => {
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

function totalQuestions() {
  const totalQuestions = document.getElementById("totalQuestions");
  totalQuestions.innerText = mcqsAll.length;
}

function topicsCount() {
  const topics = document.getElementById("topics");
  // filter tags having more than five questions
  const filteredTags = new Map(
    [...tags.entries()].filter(([key, value]) => value >= 3)
  );
  topics.innerText = filteredTags.size;
}
