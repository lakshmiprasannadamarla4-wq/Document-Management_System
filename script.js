let documents = [];

function uploadFiles() {
  const input = document.getElementById("fileInput");

  if (!input.files.length) {
    alert("Please select a document first!");
    return;
  }

  for (const file of input.files) {
    const existing = documents.find(
      doc => doc.name === file.name
    );

    if (existing) {
      existing.versions.push({
        size: file.size,
        date: new Date().toLocaleString()
      });
      existing.size = file.size;
      existing.date = new Date().toLocaleString();
    } else {
      documents.push({
        name: file.name,
        size: file.size,
        date: new Date().toLocaleString(),
        versions: [{
          size: file.size,
          date: new Date().toLocaleString()
        }]
      });
    }
  }

  input.value = "";
  showFiles();
}

function showFiles() {
  const search = document
    .getElementById("searchInput")
    .value.toLowerCase();

  const list = document.getElementById("fileList");
  list.innerHTML = "";

  documents
    .filter(doc => doc.name.toLowerCase().includes(search))
    .forEach(doc => {
      const item = document.createElement("li");

      const title = document.createElement("strong");
      title.textContent = doc.name;

      const info = document.createElement("p");
      info.textContent =
        "Size: " + (doc.size / 1024).toFixed(1) +
        " KB | Versions: " + doc.versions.length;

      const shareButton = document.createElement("button");
      shareButton.textContent = "Share";
      shareButton.onclick = async () => {
        if (navigator.share) {
          try {
            await navigator.share({
              title: doc.name,
              text: "Document: " + doc.name
            });
          } catch (error) {
            if (error.name !== "AbortError") {
              alert("Sharing is not available.");
            }
          }
        } else {
          alert("Sharing is not supported in this browser.");
        }
      };

      const versionButton = document.createElement("button");
      versionButton.textContent = "View Versions";
      versionButton.style.marginLeft = "8px";
      versionButton.onclick = () => {
        const details = doc.versions.map(
          (version, index) =>
            "Version " + (index + 1) +
            " - " + version.date
        ).join("\n");

        alert(details);
      };

      item.appendChild(title);
      item.appendChild(info);
      item.appendChild(shareButton);
      item.appendChild(versionButton);
      list.appendChild(item);
    });
}
