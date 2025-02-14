chrome.runtime.onInstalled.addListener(() => {
  console.log("Install was a success.");
});

// Listens for tab changes and injects content.js when a YouTube page is opened
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Check if the page is YouTube home page
  if (tab.url && tab.url.includes('youtube.com')) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    });
  }
});

// Listen for extension activation
chrome.runtime.onStartup.addListener(() => {
  checkAuth();
});

// Function to check if the user is authenticated
function checkAuth() {
  fetch('https://ytfeedserver.onrender.com/auth/user', {
    credentials: 'include'
  })
  .then(response => response.json())
  .then(data => {
    if (data.error) {
      console.log('User is not authenticated:', data.error);
      // Handle unauthenticated user (e.g., show login prompt)
    } else {
      console.log('User is authenticated:', data.user);
      // Store user data in chrome.storage for later use
      chrome.storage.local.set({ user: data.user }, () => {
        console.log('User data stored in chrome.storage');
      });
    }
  })
  .catch(error => {
    console.log('Authentication check failed:', error);
  });
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action === "checkAuth") {
      fetch('https://ytfeedserver.onrender.com/auth/user', {
        credentials: 'include'
      })
      .then(response => response.json())
      .then(data => sendResponse({ data: data }))
      .catch(error => sendResponse({ error: error.message }));
      return true; // Will respond asynchronously
    }
  }
);
