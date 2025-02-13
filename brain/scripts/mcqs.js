try {
  fetch("./brain/db/mcqs.json")
    .then((response) => response.json())
    .then((data) => {
        document.body.classList.remove("hidden");
        const mcqsContainer = document.getElementById("mcqs");
        const questionDiv = document.createElement("div");

        displayQuestion();
        
        function displayQuestion() {
            // ramdomize the questions
            data = data.sort(() => Math.random() - 0.5);
            questionDiv.innerHTML = `<h3 class="font-semibold">${data[0].question}</h3>`+
            `<ul class="list-disc list-inside">${data[0].options.map(option => `<li class="text-sm">${option}</li>`).join('')}</ul>`+
            `<div class="mt-4">${data[0].answer}</div>`+
            `<div class="mt-4">${data[0].explanation}</div>`;
            mcqsContainer.appendChild(questionDiv);
        }
        
    });
} catch (error) {
  console.error(error);
}

