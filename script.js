document.getElementById("uploadForm").addEventListener("submit", async function(event) {
  event.preventDefault();
  
  const imageFile = document.getElementById("imageUpload").files[0];
  if (!imageFile) return alert("Please upload an image.");

  const formData = new FormData();
  formData.append("file", imageFile);

  // Replace 'YOUR_API_ENDPOINT' with the actual endpoint URL
  const response = await fetch("YOUR_API_ENDPOINT", {
    method: "POST",
    body: formData
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
  resultsDiv.innerHTML = "";  // Clear previous results

  data.matches.forEach(match => {
    const result = document.createElement("div");
    result.innerHTML = `
      <img src="${match.photo_url}" alt="Matched face">
      <p><strong>Name:</strong> ${match.name}</p>
      <p><strong>Age:</strong> ${match.age}</p>
    `;
    resultsDiv.appendChild(result);
  });
}
