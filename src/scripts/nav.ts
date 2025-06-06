const navLinks = document.querySelectorAll("[data-navLink]");
console.log("📮", navLinks);
for (const link of navLinks) {
  if (link.getAttribute("href") === window.location.pathname) {
    link.setAttribute("aria-current", "page");
  }
}

console.log("📮", navLinks);
