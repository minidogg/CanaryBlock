const server = "http://localhost:5000"

chrome.tabs.onUpdated.addListener(
    async function(tabId, changeInfo, tab) {

        // read changeInfo data and do something with it
        // like send the new url to contentscripts.js
        if (changeInfo.url) {
            console.log(changeInfo.url)
        }
    }
);
