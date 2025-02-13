document.addEventListener('DOMContentLoaded', function() {
    const submitBtn = document.getElementById('submit-btn');
    const dataPageBtn = document.getElementById('data-page-btn');
    const tagElements = document.querySelectorAll('.tag');
    const userGreeting = document.getElementById('user-greeting');
    const contentDiv = document.getElementById('content');
    const loginBtn = document.getElementById('login-btn');

    let selectedTags = [];

    // Step 1: Authenticate User
    fetch('https://ytfeedserver.onrender.com/auth/user', { credentials: 'include' })
        .then(response => response.json())
        .then(data => {
            if (data.user) {
                const firstName = data.user.first_name || "User"; // Get first name
                userGreeting.innerHTML = `Hi, ${firstName}! 👋`; 
                contentDiv.style.display = 'block'; // Show content
            } else {
                loginBtn.style.display = 'block'; // Show login button
            }
        })
        .catch(error => {
            console.error('Error checking authentication:', error);
            loginBtn.style.display = 'block';
        });

    // Step 2: Redirect to Login when clicking login button
    loginBtn.addEventListener('click', function() {
        chrome.tabs.create({ url: 'https://ytfeedserver.onrender.com/auth/login' });
    });

    // Step 3: Tag Selection
    tagElements.forEach(tag => {
        tag.addEventListener('click', function() {
            tag.classList.toggle('selected');
            if (tag.classList.contains('selected')) {
                selectedTags.push(tag.id);
            } else {
                selectedTags = selectedTags.filter(item => item !== tag.id);
            }
        });
    });

    // Step 4: Submit data to Flask server
    submitBtn.addEventListener('click', function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            const videoUrl = tabs[0].url;
            const videoTitle = tabs[0].title;

            if (videoUrl.includes("youtube.com")) {
                fetch('https://ytfeedserver.onrender.com/api/store-data', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        video_url: videoUrl,
                        tags: selectedTags
                    })
                })
                .then(response => response.json())
                .then(data => {
                    alert('Data stored successfully');
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            } else {
                alert('This extension only works for YouTube videos.');
            }
        });
    });

    // Step 5: Open Data Page
    dataPageBtn.addEventListener('click', function() {
        chrome.tabs.create({ url: chrome.runtime.getURL('data_page.html') });
    });
});
