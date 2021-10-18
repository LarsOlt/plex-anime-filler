import { AnimeFillerListResponse, isTVShowSeasonPage } from "./utils";
import stringSimilarity from "string-similarity";

let animeFillerList: AnimeFillerListResponse | null = null;

isTVShowSeasonPage.then(() => {
  const cellItems = document.querySelectorAll<HTMLDivElement>(
    "div[data-qa-id='cellItem']",
  );

  const cellItemsWrapper = cellItems[0].parentNode as Node;

  const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      populateCells(mutation.addedNodes);
    });
  });

  observer.observe(cellItemsWrapper, {
    childList: true,
  });

  chrome.runtime.sendMessage(
    "getAnimeFillerList",
    (res: AnimeFillerListResponse) => {
      animeFillerList = res;

      console.log(res);

      populateCells(cellItems);
    },
  );
});

const getCellData = (cell: Node) => {
  const title = (cell as HTMLDivElement).querySelector(
    "a[data-qa-id='metadataTitleLink']",
  )?.textContent;

  return {
    title,
    fillerInfo: animeFillerList?.find((info) => {
      return stringSimilarity.compareTwoStrings(info.title, title!) > 0.95;
    }),
  };
};

const addFillerInfoToCell = (params: {
  cell: Node;
  fillerInfo: AnimeFillerListResponse[0];
}) => {
  const { cell, fillerInfo } = params;

  (cell as HTMLDivElement).innerHTML += `
            <div style="
                position: absolute;
                top: 1em;
                right: 1em;
                color: white;
                text-transform: uppercase;
                padding: .5em;
                background-color: ${
                  fillerInfo.type === "Filler" ? "red" : "green"
                };
                border-radius:5px;
                box-shadow: 0 0 3px gray;
                "
            >${fillerInfo.type}</div>
        `;
};

const populateCells = (cells: NodeList) => {
  cells.forEach((cell) => {
    const { fillerInfo } = getCellData(cell);

    console.log(getCellData(cell));

    if (fillerInfo) {
      addFillerInfoToCell({
        cell,
        fillerInfo,
      });
    }
  });
};
