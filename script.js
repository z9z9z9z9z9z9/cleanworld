// Moving lines effect
const createLines = () => {
  const linesContainer = document.createElement("div");
  linesContainer.className = "moving-lines";
  document.body.appendChild(linesContainer);

  for (let i = 0; i < 100; i++) {
    const line = document.createElement("div");
    line.className = "line";
    linesContainer.appendChild(line);
  }

  document.addEventListener("mousemove", (e) => {
    linesContainer.style.transform = `translate(${e.clientX / 100}px, ${e.clientY / 100}px)`;
  });
};

// API call and form handling
document.getElementById("uploadForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const imageFile = document.getElementById("imageUpload").files[0];
  if (!imageFile) return alert("Please upload an image.");

  const formData = new FormData();
  formData.append("file", imageFile);

  const response = await fetch("/api/face-recognition", {  // Calls Vercel function
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    alert("Error with API call. Please check your connection or try again later.");
    return;
  }

  const data = await response.json();
  displayResults(data);
});

function displayResults(data) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = ""; // Clear previous results

  data.matches.forEach((match) => {
    const result = document.createElement("div");
    result.innerHTML = `
      <img src="${match.photo_url}" alt="Matched face">
      <p><strong>Name:</strong> ${match.name}</p>
      <p><strong>Age:</strong> ${match.age}</p>
    `;
    resultsDiv.appendChild(result);
  });
}

createLines();
