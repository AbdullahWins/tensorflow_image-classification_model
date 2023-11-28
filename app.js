// app.js
document
  .getElementById("uploadForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(this);

    try {
      // Load the MobileNet model
      const model = await mobilenet.load();

      // Read the uploaded image
      const fileInput = formData.get("image");
      const imageElement = document.createElement("img");
      const reader = new FileReader();

      reader.onload = async function () {
        imageElement.src = reader.result;
        document.body.appendChild(imageElement);

        // Wait for the image to load
        await new Promise((resolve) => (imageElement.onload = resolve));

        // Resize the image to meet MobileNet's expected input size
        const canvas = document.createElement("canvas");
        canvas.width = 224;
        canvas.height = 224;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(imageElement, 0, 0, 224, 224);

        // Convert the canvas to a TensorFlow tensor
        const tfimage = tf.browser.fromPixels(canvas);
        const expandedImage = tfimage.expandDims(0);

        // Perform image classification
        const predictions = await model.classify(expandedImage);

        // Display the classification results
        console.log(predictions);
      };

      reader.readAsDataURL(fileInput);
    } catch (error) {
      console.error(error.message);
    }
  });
