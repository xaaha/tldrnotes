document.addEventListener("DOMContentLoaded", () => {
  const linkIconSVG = `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></g></svg>`;
  const copiedIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><title>Copied</title><path d="M5 12l5 5l10 -10"></path></svg>`;

  const allHeadings = document.querySelectorAll(
    ".content h1, .content h2, .content h3, .content h4, .content h5, .content h6",
  );
  for (const heading of allHeadings) {
    {
      const headingId = heading.id;
      if (!headingId) return;
      heading.classList.add("heading-with-link");
      const copyLink = document.createElement("a");
      copyLink.className = "heading-link-copy-button";
      copyLink.setAttribute(
        "aria-label",
        `Copy link to heading: ${heading.textContent}`,
      );
      copyLink.innerHTML = linkIconSVG;
      heading.appendChild(copyLink);
      copyLink.addEventListener("click", async (event) => {
        event.preventDefault();
        const urlToCopy = `${window.location.origin}${window.location.pathname}#${headingId}`;
        try {
          await navigator.clipboard.writeText(urlToCopy);
          copyLink.innerHTML = copiedIconSVG;
          copyLink.classList.add("copied");
          setTimeout(() => {
            copyLink.innerHTML = linkIconSVG;
            copyLink.classList.remove("copied");
          }, 700);
        } catch (err) {
          console.error("Failed to copy URL: ", err);
        }
      });
    }
  }
});
