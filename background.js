let updateDelay = 5; // wait time in seconds, to minimize system resource usage
let tabsList; // create empty global tabsList
let elapsed_time = 0; // set global elapsed_time
let last_timestamp = Date.now(); // set initial timestamp for time calculations
let MaximumElapsedTime = 30; // Number of minutes before being notified
let already_notified = false; // set flag for already notified to false

// Loads current tabs into global tabsList variable
async function updateTabList() {
  tabsList = await chrome.tabs.query({ url: "*://*.youtube.com/*" });
}

// Checks tabs list for youtube tab, and updates elapsed
function checkTabs() {
  if (tabsList.length >= 1) {
    // increments elapsed time by float of seconds since last check
    elapsed_time += (Date.now() - last_timestamp) / 1000;
    
    // set last_timestamp for reference on next function call
    last_timestamp = Date.now();
  } else { // if not youtube URLs found in open tabs
    elapsed_time = 0; // reset elapsed time
    already_notified = false; // reset already_notified
  }

  // Check if elapsed time now exceeds maximum time set at top of code
  if (elapsed_time >= MaximumElapsedTime * 60 && already_notified == false) {
    // use Chrome API to open new tab and load 'popup.html' file
    chrome.tabs.create({ url: chrome.runtime.getURL("popup.html") });

    // set elapsed time back to 0 after notification opens
    elapsed_time = 0;
    
    // Set already_notified to true to prevent multiple new tabs opening
    already_notified == true;
  }
}

// Function to bulk set update function call intervals
function setIntervals() {
  // set interval to update open tab list
  setInterval(updateTabList, updateDelay * 1000);

  // set interval to check open tabs (Should be > delay for
  // updateTabList to prevent multiple calls without refreshed tablist)
  setInterval(checkTabs, updateDelay * 1000);
}

// load open tabs at startup and call function to set function call timers
updateTabList().then(setIntervals());
