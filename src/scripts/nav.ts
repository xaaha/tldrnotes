const navLinks = document.querySelectorAll("[data-navLink]");
for (const link of navLinks) {
  if (link.getAttribute("href") === window.location.pathname) {
    link.setAttribute("aria-current", "page");
  }
}
