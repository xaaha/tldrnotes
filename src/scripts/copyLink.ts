document.addEventListener("DOMContentLoaded", () => {
  const linkIconSVG = `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M11 17H7q-2.075 0-3.537-1.463T2 12t1.463-3.537T7 7h4v2H7q-1.25 0-2.125.875T4 12t.875 2.125T7 15h4zm-3-4v-2h8v2zm5 4v-2h4q1.25 0 2.125-.875T20 12t-.875-2.125T17 9h-4V7h4q2.075 0 3.538 1.463T22 12t-1.463 3.538T17 17z"/></svg>`;
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
