async function loadModels() {
  // Load models from CDN or local, if needed
  await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
  await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
  await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
}

document.getElementById("searchForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const imageFile = document.getElementById("imageUpload").files[0];

  // Load models before processing
  await loadModels();

  // Load the uploaded image
  const img = await faceapi.bufferToImage(imageFile);
  const detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();

  if (detections.length > 0) {
    const userFaceDescriptor = detections[0].descriptor;

    // Load profiles from the /data directory
    const profiles = await loadProfiles();

    const matches = profiles.filter(profile => {
      return faceapi.euclideanDistance(userFaceDescriptor, profile.faceDescriptor) < 0.6; // Match threshold
    });

    displayResults(matches);
  } else {
    alert("No face detected. Please try again.");
  }
});

// Function to load profiles and their face descriptors
async function loadProfiles() {
  const profiles = [];
  
  // Replace with actual file loading logic
  const personFolders = ["person1", "person2"]; // Add more folder names as needed

  for (const folder of personFolders) {
    const imgUrl = `/data/${folder}/image1.png`; // Assuming a standard naming for images
    const infoUrl = `/data/${folder}/info.txt`;

    // Get face descriptor
    const faceDescriptor = await getFaceDescriptor(imgUrl);

    // Fetch info.txt
    const response = await fetch(infoUrl);
    const info = await response.text();

    // Parse the info based on the new format
    const profileData = parseProfileInfo(info);

    profiles.push({
      ...profileData,
      photo_url: imgUrl,
      faceDescriptor: faceDescriptor
    });
  }

  return profiles;
}

// Function to parse profile information from text
function parseProfileInfo(info) {
  const lines = info.split("\n");
  const profile = {};

  lines.forEach(line => {
    const [key, value] = line.split(":").map(part => part.trim());
    if (key && value) {
      profile[key] = value;
    }
  });

  return profile;
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
