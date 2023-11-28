const express = require("express");
const multer = require("multer");
const tf = require("@tensorflow/tfjs");
const mobilenet = require("@tensorflow-models/mobilenet");
const fs = require("fs");

const app = express();
const port = 3000;

// Set up multer for handling file uploads
const upload = multer({ dest: "uploads/" });

// Serve static files from the current directory
app.use(express.static(__dirname));

// Serve HTML form for file upload
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Handle file upload and perform image classification
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    // Load the MobileNet model
    const model = await mobilenet.load();

    // Read the uploaded image
    const imageBuffer = fs.readFileSync(req.file.path);
    const tfimage = tf.browser.fromPixels(new Uint8Array(imageBuffer));

    // Perform image classification
    const predictions = await model.classify(tfimage);

    // Send the classification results as JSON
    res.json(predictions);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
