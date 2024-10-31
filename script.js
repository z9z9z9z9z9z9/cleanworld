document.getElementById("searchForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData();

  // Collect all input values and files
  formData.append("file", document.getElementById("imageUpload").files[0]);
  formData.append("name", document.getElementById("name").value);
  formData.append("last_name", document.getElementById("lastName").value);
  formData.append("country", document.getElementById("country").value);

  // Send form data to backend for matching
  const response = await fetch("/api/search", {
    method: "POST",
    body: formData
  });

  if (response.ok) {
    const data = await response.json();
    displayResults(data);
  } else {
    alert("Error during search. Try again.");
  }
});

function displayResults(data) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = ""; // Clear old results

  data.matches.forEach(match => {
    const result = document.createElement("div");
    result.innerHTML = `
      <img src="${match.photo_url}" alt="Matched face">
      <p><strong>Name:</strong> ${match.name}</p>
      <p><strong>Age:</strong> ${match.age}</p>
      <p><strong>Country:</strong> ${match.country}</p>
    `;
    resultsDiv.appendChild(result);
  });
}
