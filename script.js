document.getElementById("searchForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  // Get user input
  const imageFile = document.getElementById("imageUpload").files[0];
  const name = document.getElementById("name").value;
  const lastName = document.getElementById("lastName").value;
  const country = document.getElementById("country").value;

  // Simulate fetching data from local data folder
  const results = searchForProfiles(name, lastName, country);

  // Display results
  displayResults(results);
});

// Function to search for profiles based on provided input
function searchForProfiles(name, lastName, country) {
  const results = [];

  // Replace this with actual local data reading logic
  const data = [
    {
      name: "John",
      last_name: "Doe",
      age: "30",
      country: "USA",
      photo_url: "/data/person1/image1.png",
    },
    {
      name: "Jane",
      last_name: "Smith",
      age: "25",
      country: "Canada",
      photo_url: "/data/person2/image2.jpg",
    }
  ];

  // Filter the data based on search criteria
  data.forEach(profile => {
    if (
      (!name || profile.name.toLowerCase() === name.toLowerCase()) &&
      (!lastName || profile.last_name.toLowerCase() === lastName.toLowerCase()) &&
      (!country || profile.country.toLowerCase() === country.toLowerCase())
    ) {
      results.push(profile);
    }
  });

  return results;
}

// Function to display search results
function displayResults(data) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = ""; // Clear previous results

  data.forEach(match => {
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
