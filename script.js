// Selectors
const generateBtn = document.getElementById("generate-btn");
const saveBtn = document.getElementById("save-btn");
const paletteContainer = document.querySelector(".palette-container");
const savedPalettesContainer = document.getElementById("saved-palettes");

// 1. Initialize App
generatePalette();
loadSavedPalettes();

// --- EVENT LISTENERS ---

generateBtn.addEventListener("click", generatePalette);
saveBtn.addEventListener("click", savePalette);

// Spacebar Trigger
document.body.onkeyup = function (e) {
  if (e.code === "Space" && e.target.tagName !== "INPUT") {
    e.preventDefault();
    generatePalette();
  }
};

// Event Delegation for Palette Container (Handles Copy & Lock)
paletteContainer.addEventListener("click", function (e) {
  const target = e.target;

  // Handle Copy
  if (target.classList.contains("copy-btn")) {
    const hexValue = target.parentElement.previousElementSibling.textContent;
    copyToClipboard(hexValue, target);
  }

  // Handle Lock
  const lockBtn = target.closest(".lock-btn");
  if (lockBtn) {
    toggleLock(lockBtn);
  }
});

// --- MAIN FUNCTIONS ---

function generatePalette() {
  const colorBoxes = document.querySelectorAll(".color-box");

  colorBoxes.forEach((box) => {
    // Only generate if NOT locked
    if (!box.classList.contains("locked")) {
      const newColor = generateRandomColor();
      const colorDiv = box.querySelector(".color");
      const hexText = box.querySelector(".hex-value");

      // Update visual and text
      colorDiv.style.backgroundColor = newColor;
      hexText.textContent = newColor;
    }
  });
}

function generateRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function toggleLock(button) {
  const icon = button.querySelector("i");
  const colorBox = button.closest(".color-box");

  // Toggle class
  colorBox.classList.toggle("locked");

  // Toggle Icon
  if (colorBox.classList.contains("locked")) {
    icon.classList.remove("fa-lock-open");
    icon.classList.add("fa-lock");
  } else {
    icon.classList.remove("fa-lock");
    icon.classList.add("fa-lock-open");
  }
}

// --- UTILS ---

function copyToClipboard(hex, element) {
  navigator.clipboard
    .writeText(hex)
    .then(() => showCopySuccess(element))
    .catch((err) => console.log(err));
}

function showCopySuccess(element) {
  element.classList.remove("far", "fa-copy");
  element.classList.add("fas", "fa-check");

  const originalColor = element.style.color;
  element.style.color = "#48bb78";

  setTimeout(() => {
    element.classList.remove("fas", "fa-check");
    element.classList.add("far", "fa-copy");
    element.style.color = originalColor;
  }, 1500);
}

// --- LIBRARY / LOCAL STORAGE ---

function savePalette() {
  const colorBoxes = document.querySelectorAll(".hex-value");
  const palette = [];

  colorBoxes.forEach((box) => {
    palette.push(box.textContent);
  });

  // Save to Local Storage
  let savedPalettes = JSON.parse(localStorage.getItem("myPalettes")) || [];
  savedPalettes.push(palette);
  localStorage.setItem("myPalettes", JSON.stringify(savedPalettes));

  // Render immediately
  displaySavedPalette(palette);
}

function loadSavedPalettes() {
  let savedPalettes = JSON.parse(localStorage.getItem("myPalettes")) || [];
  savedPalettes.forEach((palette) => {
    displaySavedPalette(palette);
  });
}

function displaySavedPalette(palette) {
  const paletteDiv = document.createElement("div");
  paletteDiv.classList.add("mini-palette");

  // Create mini boxes
  palette.forEach((color) => {
    const colorDiv = document.createElement("div");
    colorDiv.style.backgroundColor = color;
    colorDiv.classList.add("mini-color");
    paletteDiv.appendChild(colorDiv);
  });

  // Create Delete Button
  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
  deleteBtn.classList.add("delete-btn");
  deleteBtn.title = "Delete Palette";

  deleteBtn.addEventListener("click", (e) => {
    // Remove from DOM
    const itemToRemove = e.target.closest(".mini-palette");
    itemToRemove.remove();

    // Note: For a true production app, you would also want to remove
    // the specific item from the LocalStorage array here.
  });

  paletteDiv.appendChild(deleteBtn);
  savedPalettesContainer.appendChild(paletteDiv);
}
