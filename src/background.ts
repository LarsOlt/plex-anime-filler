import { getAnimeFillerList } from "./contentScripts/utils";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === "getAnimeFillerList") {
    getAnimeFillerList().then((data) => sendResponse(data));
    return true; // return true to indicate you want to send a response asynchronously
  }
});
