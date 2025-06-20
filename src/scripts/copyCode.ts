document.addEventListener("DOMContentLoaded", () => {
  // SVG icons for the button states
  const copyIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 8m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z"></path><path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2"></path></svg>`;
  const copiedIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5l10 -10"></path></svg>`;

  const codeBlocks = document.querySelectorAll("pre.astro-code");

  for (const codeBlock of codeBlocks) {
    // Create and style the wrapper
    const wrapper = document.createElement("div");
    wrapper.className = "code-block-wrapper";

    // Create the button and set its initial icon
    const copyButton = document.createElement("button");
    copyButton.className = "copy-code-button";
    copyButton.innerHTML = copyIconSVG;
    copyButton.setAttribute("aria-label", "Copy code to clipboard");

    // Wrap the code block
    codeBlock.parentNode?.insertBefore(wrapper, codeBlock);
    wrapper.appendChild(codeBlock);
    wrapper.appendChild(copyButton);

    // Add the click event listener
    copyButton.addEventListener("click", async () => {
      const codeElement = codeBlock.querySelector("code");
      if (codeElement) {
        const textToCopy = codeElement.innerText;
        try {
          await navigator.clipboard.writeText(textToCopy);

          // Visual feedback: change icon and add class
          copyButton.innerHTML = copiedIconSVG;
          copyButton.classList.add("copied");

          // Reset after click
          setTimeout(() => {
            copyButton.innerHTML = copyIconSVG;
            copyButton.classList.remove("copied");
          }, 700);
        } catch (err) {
          console.error("Failed to copy text: ", err);
          copyButton.innerHTML = "Error"; // Basic error feedback
        }
      }
    });
  }
});
