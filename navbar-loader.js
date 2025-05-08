
document.addEventListener("DOMContentLoaded", () => {
  fetch("navbar.html")
    .then(response => response.text())
    .then(data => {
      const container = document.getElementById("navbar");
      if (container) container.innerHTML = data;
    })
    .catch(err => console.error("Failed to load navbar:", err));
});
