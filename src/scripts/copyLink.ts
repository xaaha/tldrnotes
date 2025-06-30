document.addEventListener("DOMContentLoaded", () => {
  const linkIconSVG = `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Link</title><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M5.576 13.481a3.5 3.5 0 0 0 4.95 4.95m2.473-7.423a3.5 3.5 0 0 1 0 4.95l-2.475 2.475m-2.475-7.425l-2.475 2.475m12.857-2.957a3.5 3.5 0 1 0-4.95-4.95M11.01 13a3.5 3.5 0 0 1 0-4.95l2.474-2.475M15.958 13l2.475-2.475"/></svg>`;
  const copiedIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><title>Copied</title><path d="M5 12l5 5l10 -10"></path></svg>`;

  const allHeadings = document.querySelectorAll(
    ".content h1, .content h2, .content h3, .content h4, .content h5, .content h6",
  );

  allHeadings.forEach((heading) => {
    const headingId = heading.id;
    if (!headingId) return;

    const wrapper = document.createElement("div");
    wrapper.className = "heading-wrapper";

    const copyButton = document.createElement("button");
    copyButton.className = "heading-link-copy-button";
    copyButton.setAttribute(
      "aria-label",
      `Copy link to heading: ${heading.textContent}`,
    );
    copyButton.innerHTML = linkIconSVG;

    heading.parentNode?.insertBefore(wrapper, heading);
    wrapper.appendChild(heading);

    wrapper.appendChild(copyButton);

    copyButton.addEventListener("click", async () => {
      const urlToCopy = `${window.location.origin}${window.location.pathname}#${headingId}`;

      try {
        await navigator.clipboard.writeText(urlToCopy);

        copyButton.innerHTML = copiedIconSVG;
        copyButton.classList.add("copied");

        setTimeout(() => {
          copyButton.innerHTML = linkIconSVG;
          copyButton.classList.remove("copied");
        }, 700);
      } catch (err) {
        console.error("Failed to copy URL: ", err);
      }
    });
  });
});
