function extractPageContent() {
  if (window.location.hostname.includes("youtube.com")) {
    // Extract video title and description
    let title = document.querySelector('h1.title')?.innerText || '';
    let description = document.querySelector('#description')?.innerText || '';
    return `${title}\n${description}`;
  }
  if (window.location.hostname.includes("netflix.com")) {
    // Netflix DOM is complex; basic metadata extraction
    let title = document.querySelector('.video-title')?.innerText || '';
    let description = document.querySelector('.video-synopsis')?.innerText || '';
    return `${title}\n${description}`;
  }
  // General webpage text
  return document.body.innerText.slice(0, 7000);
}

// Distraction blocker
function blockDistractions() {
  // Example: Block YouTube comments, sidebar, ads
  if (window.location.hostname.includes("youtube.com")) {
    let selectors = [
      "#comments", "#related", ".ytp-ad-module", ".ytp-ad-player-overlay"
    ];
    selectors.forEach(sel => {
      let el = document.querySelector(sel);
      if (el) el.style.display = "none";
    });
  }
  // Add more rules for Netflix, etc.
}

// Widget injection
function injectWidget() {
  if (!document.getElementById('activelearn-widget')) {
    let iframe = document.createElement('iframe');
    iframe.src = chrome.runtime.getURL('widget.html');
    iframe.id = 'activelearn-widget';
    iframe.style = 'position:fixed;bottom:32px;right:32px;width:380px;height:520px;z-index:999999;border-radius:18px;box-shadow:0 4px 32px #0006;border:none;transition:all 0.3s;';
    document.body.appendChild(iframe);
  }
}

// Listen for popup requests
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'getContent') {
    sendResponse({ content: extractPageContent() });
  }
  if (msg.action === 'blockDistractions') {
    blockDistractions();
    sendResponse({ status: "done" });
  }
  if (msg.action === 'toggleWidget') {
    injectWidget();
    sendResponse({ status: "widget_injected" });
  }
});
