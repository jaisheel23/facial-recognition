// Load the models
async function loadModels() {
  await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
  await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
  await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
  console.log("Models loaded");
}

// Handle the form submission
document
  .getElementById("uploadForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const image1 = document.getElementById("image1").files[0];
    const image2 = document.getElementById("image2").files[0];

    if (!image1 || !image2) {
      alert("Please upload both images.");
      return;
    }

    // Show loading spinner
    document.getElementById("loading").style.display = "block";
    document.getElementById("result").textContent = "";

    // Convert files to images for face-api.js processing
    const img1 = await faceapi.bufferToImage(image1);
    const img2 = await faceapi.bufferToImage(image2);

    // Show image previews
    document.getElementById(
      "preview1"
    ).innerHTML = `<img src="${URL.createObjectURL(
      image1
    )}" class="image-preview" />`;
    document.getElementById(
      "preview2"
    ).innerHTML = `<img src="${URL.createObjectURL(
      image2
    )}" class="image-preview" />`;

    // Detect faces and landmarks
    const detections1 = await faceapi
      .detectSingleFace(img1)
      .withFaceLandmarks()
      .withFaceDescriptor();
    const detections2 = await faceapi
      .detectSingleFace(img2)
      .withFaceLandmarks()
      .withFaceDescriptor();

    // Hide loading spinner
    document.getElementById("loading").style.display = "none";

    if (!detections1 || !detections2) {
      document.getElementById("result").textContent =
        "Could not detect faces in one or both images.";
      return;
    }

    // Compare the face descriptors
    const distance = faceapi.euclideanDistance(
      detections1.descriptor,
      detections2.descriptor
    );
    const result =
      distance < 0.6 ? "The faces are the same." : "The faces are different.";
    document.getElementById("result").textContent = result;
  });

// Load models when the page loads
window.onload = loadModels;
