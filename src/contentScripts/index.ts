import { AnimeFillerListResponse, isTVShowSeasonPage } from "./utils";

isTVShowSeasonPage.then((data) => {
  const cellItems = document.querySelectorAll<HTMLDivElement>(
    "div[data-qa-id='cellItem']",
  );

  const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach(({ type }) => {
      console.log({ type });
    });
  });

  observer.observe(cellItems[0].parentNode as Node, {
    childList: true,
  });

  const getCellItemTitle = (cell: HTMLDivElement) =>
    cell.querySelector("a[data-qa-id='metadataTitleLink']")?.textContent;

  chrome.runtime.sendMessage(
    "getAnimeFillerList",
    (res: AnimeFillerListResponse) => {
      cellItems.forEach((cell, i) => {
        const { title, type } = res[i];

        if (getCellItemTitle(cell) === title) {
          cellItems[i].innerHTML += `
                <div style="
                    position: absolute;
                    top: 1em;s
                    right: 1em;
                    color: white;
                    text-transform: uppercase;
                    padding: .5em;
                    background-color: ${type === "Filler" ? "red" : "green"};
                    border-radius:5px;
                    box-shadow: 0 0 3px gray;
                    "
                >${type}</div>
            `;
        }
      });
    },
  );
});
