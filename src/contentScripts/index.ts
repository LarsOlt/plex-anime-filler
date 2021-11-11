import { AnimeFillerListResponse, isTVShowSeasonPage } from "./utils";
import stringSimilarity from "string-similarity";

let animeFillerList: AnimeFillerListResponse | null = null;

isTVShowSeasonPage.then(() => {
  const cellItems = document.querySelectorAll<HTMLDivElement>(
    "div[data-testid='cellItem']",
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
    "a[data-testid='metadataTitleLink']",
  )?.textContent as string;

  return {
    title,
    fillerInfo: animeFillerList?.find((info) => {
      return stringSimilarity.compareTwoStrings(info.title, title) > 0.95;
    }),
  };
};

const addFillerInfoToCell = (params: {
  cell: Node;
  fillerInfo: AnimeFillerListResponse[0];
}) => {
  const { cell, fillerInfo } = params;

  (cell as HTMLDivElement).insertAdjacentHTML(
    "beforeend",
    `
            <div style="
                position: absolute;
                bottom: 0;
                right: 0;
                color: white;
                text-transform: uppercase;
                padding: 1px 5px;
                background-color: ${
                  fillerInfo.type === "Filler" ? "red" : "green"
                };
                border-radius:5px;
                "
            >${fillerInfo.type}</div>
        `,
  );
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
