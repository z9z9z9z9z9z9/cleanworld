document.getElementById("searchForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData();

  formData.append("file", document.getElementById("imageUpload").files[0]);
  formData.append("name", document.getElementById("name").value);
  formData.append("last_name", document.getElementById("lastName").value);
  formData.append("country", document.getElementById("country").value);

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
  resultsDiv.innerHTML = ""; // Clear previous results

  data.matches.forEach(match => {
    const result = document.createElement("div");
    result.classList.add("profile");

    result.innerHTML = `
      <div class="profile-header">
        <img src="${match.photo_url}" alt="Profile Picture">
        <h2>${match.name} ${match.last_name}</h2>
      </div>
      <div class="profile-info">
        <p><strong>Age:</strong> ${match.age}</p>
        <p><strong>Country:</strong> ${match.country}</p>
      </div>
    `;
    resultsDiv.appendChild(result);
  });
}
