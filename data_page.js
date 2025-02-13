document.addEventListener('DOMContentLoaded', function() {
    const dataContainer = document.getElementById('data-container');

    // Fetch user's contributed videos
    fetch("https://ytfeedserver.onrender.com/api/user-contributions")
        .then(response => response.json())
        .then(data => {
            if (data.contributed_videos.length === 0) {
                dataContainer.innerHTML = '<p>No videos contributed yet.</p>';
                return;
            }

            dataContainer.innerHTML = "";  // Clear any existing content

            // Loop through contributed videos and create cards
            data.contributed_videos.forEach(entry => {
                const videoCard = document.createElement("div");
                videoCard.classList.add("video-card");

                videoCard.innerHTML = `
                    <img src="${entry.thumbnail_url}" alt="Video Thumbnail" class="video-thumbnail">
                    <p class="video-title">${entry.title}</p>
                    <p class="video-views">Tags: ${entry.tags}</p>
                    <button class="watch-btn">Watch</button>
                `;

                // Add click event to open YouTube video
                videoCard.querySelector(".watch-btn").addEventListener("click", function() {
                    window.open(`https://www.youtube.com/watch?v=${entry.video_id}`, '_blank');
                });

                dataContainer.appendChild(videoCard);
            });
        })
        .catch(error => {
            console.error("Error fetching user contributions:", error);
            dataContainer.innerHTML = '<p>Error loading data.</p>';
        });
});
