import { browser } from "webextension-polyfill-ts";
import { getAnimeFillerList } from "./contentScripts/utils";

// Listen for messages sent from other parts of the extension
browser.runtime.onMessage.addListener((request: { popupMounted: boolean }) => {
  // Log statement if request.popupMounted is true
  // NOTE: this request is sent in `popup/component.tsx`
  if (request.popupMounted) {
    console.log("backgroundPage notified that Popup.tsx has mounted.");
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === "getAnimeFillerList") {
    getAnimeFillerList().then((data) => sendResponse(data));
    return true; // return true to indicate you want to send a response asynchronously
  }
});
