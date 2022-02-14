import "@webcomponents/webcomponentsjs";

import { AnimeFillerListResponse, isTVShowSeasonPage } from "./utils";
import stringSimilarity from "string-similarity";
import "./components";
import { EpisodeTag } from "./components";

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

  const EpisodeTagEle = new EpisodeTag({ fillerInfo });

  (cell as HTMLDivElement).insertAdjacentElement("beforeend", EpisodeTagEle);
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
