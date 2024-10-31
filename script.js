// Load the models
async function loadModels() {
  const MODEL_URL = '/models'; // Adjust the path to your model files if needed
  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
  await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
  await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
}

document.getElementById("searchForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  // Get user input
  const imageFile = document.getElementById("imageUpload").files[0];
  const name = document.getElementById("name").value;
  const lastName = document.getElementById("lastName").value;
  const country = document.getElementById("country").value;

  // Load models
  await loadModels();

  // Get uploaded image
  const img = await faceapi.bufferToImage(imageFile);
  const detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();

  if (detections.length > 0) {
    const userFaceDescriptor = detections[0].descriptor;

    // Simulate fetching data from local data folder
    const profiles = await loadProfiles();

    const matches = profiles.filter(profile => {
      return faceapi.euclideanDistance(userFaceDescriptor, profile.faceDescriptor) < 0.6; // Adjust threshold as needed
    });

    displayResults(matches);
  } else {
    alert("No face detected. Please try again.");
  }
});

// Function to load profiles and their face descriptors
async function loadProfiles() {
  const profiles = [];
  
  // This is where you would dynamically load images and create face descriptors for each one
  // For simplicity, we will add hardcoded profiles
  profiles.push({
    name: "John",
    last_name: "Doe",
    age: "30",
    country: "USA",
    photo_url: "/data/person1/image1.png",
    faceDescriptor: await getFaceDescriptor('/data/person1/image1.png')
  });

  profiles.push({
    name: "Jane",
    last_name: "Smith",
    age: "25",
    country: "Canada",
    photo_url: "/data/person2/image2.jpg",
    faceDescriptor: await getFaceDescriptor('/data/person2/image2.jpg')
  });

  return profiles;
}

// Function to get face descriptor from an image
async function getFaceDescriptor(imageUrl) {
  const img = await faceapi.fetchImage(imageUrl);
  const detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
  return detections.length > 0 ? detections[0].descriptor : null;
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
