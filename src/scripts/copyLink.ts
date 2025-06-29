document.addEventListener("DOMContentLoaded", () => {
  const linkIcon: string = `<svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Link</title>
      <path
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M5.576 13.481a3.5 3.5 0 0 0 4.95 4.95m2.473-7.423a3.5 3.5 0 0 1 0 4.95l-2.475 2.475m-2.475-7.425l-2.475 2.475m12.857-2.957a3.5 3.5 0 1 0-4.95-4.95M11.01 13a3.5 3.5 0 0 1 0-4.95l2.474-2.475M15.958 13l2.475-2.475"
      />
    </svg>`;
  const copiedIconSVG: string = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5l10 -10"></path></svg>`;
  const allHeadings: NodeListOf<Element> = document.querySelectorAll(
    "h1, h2, h3, h4, h5, h6",
  );

  const aElem = document.createElement("a");
  aElem.className = "anchor";
  aElem.ariaLabel = "Permalink:";
  // id of the heading. Strip out the special chraracters wtih regex
  // need to check how we are going work when there is special char
  // see astro
});
