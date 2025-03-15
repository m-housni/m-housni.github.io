const mcqs = [];
const mcqsAll = [];
const tags = new Map();

try {
  fetch("./../brain/db/mcqs.json")
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
      getCoverage();
    });
} catch (error) {
  console.error(error);
}

function displayQuestion(data, tag) {
  const mcqsContainer = document.getElementById("mcqs");
  const currTopic = document.getElementById("currTopic");

  currTopic.innerText = tag
    ? tag + " | " + data.length
    : data.length + " Questions";

  mcqsContainer.innerHTML = "";
  // ramdomize the questions
  // TODO: handle random/natural order options
  // data = data.sort(() => Math.random() - 0.5);
  data.forEach((mcq) => {
    const questionDiv = document.createElement("div");
    questionDiv.innerHTML +=
      `<div class="mb-4 text-nowrap">${mcq.tags
        .map((e) => {
          return `<span onclick="filterByTag('${e}')" class="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs mr-2 cursor-pointer">${e}</span>`;
        })
        .join("")}</div>` +
      `<h3 class="font-semibold">${mcq.question}</h3>` +
      `<div class="mt-4">${mcq.answer}</div>` +
      `<div class="mt-4">${mcq.explanation}</div>` +
      `<div class="mt-4">
      <button class="bg-blue-500 text-white px-2 py-0 rounded mr-2" onclick="updateResponse(event, '${mcq.question.replace(
        /'/g,
        "\\'"
      )}', 1)">1</button>
      <button class="bg-green-500 text-white px-2 py-0 rounded mr-2" onclick="updateResponse(event, '${mcq.question.replace(
        /'/g,
        "\\'"
      )}', 2)">2</button>
      <button class="bg-red-500 text-white px-2 py-0 rounded" onclick="updateResponse(event, '${mcq.question.replace(
        /'/g,
        "\\'"
      )}', 3)">3</button>
      <span class="ml-2 text-xs">${getResponseStats(
        mcq.question.replace(/'/g, "\\'")
      )}</span>
      </div>` +
      `<hr class="my-5">`;

    mcqsContainer.appendChild(questionDiv);
  });
}

function updateResponse(event, question, response) {
  let responses = JSON.parse(localStorage.getItem("responses")) || {};
  if (!responses[question]) {
    responses[question] = { total: 0, count: 0 };
  }
  responses[question].total += response;
  responses[question].count += 1;
  localStorage.setItem("responses", JSON.stringify(responses));
  event.target.closest("div").querySelector("span").innerText =
    getResponseStats(question.replace(/'/g, "\\'"));
  getCoverage();
}

function getCoverage() {
  const coverage = document.getElementById("coverage");
  const responses = JSON.parse(localStorage.getItem("responses")) || {};
  let totalQuestionsAnswered = 0;
  let totalResponses = 0;
  let totalScore = 0;

  for (const question in responses) {
    totalQuestionsAnswered += 1;
    totalResponses += responses[question].count;
    totalScore += responses[question].total;
  }

  const average = totalResponses ? (totalScore / totalResponses).toFixed(2) : 0;

  coverage.innerHTML = `${totalQuestionsAnswered} | ${((totalQuestionsAnswered/(mcqsAll.length)).toFixed(2)*100)}% | ${average}`;
}

function getResponseStats(question) {
  const responses = JSON.parse(localStorage.getItem("responses"));
  if (responses && responses[question]) {
    const average = (
      responses[question].total / responses[question].count
    ).toFixed(2);
    const total = responses[question].count;
    return `${average} / ${total}`;
  }
  return "0 / 0";
}

function filterByTag(tag) {
  const filteredData = mcqsAll.filter((mcq) => mcq.tags.includes(tag));
  displayQuestion(filteredData, tag);
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
