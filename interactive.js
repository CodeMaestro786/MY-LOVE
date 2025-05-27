// WebSocket connection
const ws = new WebSocket('ws://localhost:3000');

// Love counter and effects
let loveCounter = 0;
const counterDisplay = document.createElement('div');
counterDisplay.className = 'love-counter bounce-in';
document.body.appendChild(counterDisplay);

// Dynamic love messages
const loveMessages = [
    'Every moment with you is magical ✨',
    'You make my heart skip a beat 💓',
    'Eight months of pure joy with you 🎉',
    'You are my favorite person 💝',
    'Forever grateful for your love 💖',
    'Since September 28, 2023, my life has been complete 💑',
    'Every day with you is a blessing 🌟',
    'You are my everything 💕',
    'Together forever and always 💘',
    'My heart belongs to you 💖'
];

// Photo gallery effects
function initializeGallery() {
    const gallery = document.querySelector('.photo-gallery');
    const photos = gallery.querySelectorAll('img');

    photos.forEach(photo => {
        photo.addEventListener('mouseover', (e) => {
            createHeartBurst(e.target);
        });
    });
}

// Create heart burst effect
function createHeartBurst(element) {
    const hearts = 10;
    for (let i = 0; i < hearts; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = '❤';
        heart.className = 'floating-heart sparkle';
        heart.style.position = 'absolute';
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.top = `${Math.random() * 100}%`;
        element.appendChild(heart);

        setTimeout(() => heart.remove(), 1500);
    }
}

// Update love statistics
function updateLoveStats() {
    fetch('http://localhost:5000/')
        .then(response => response.json())
        .then(data => {
            const statsContainer = document.createElement('div');
            statsContainer.className = 'stats-container slide-in';
            statsContainer.innerHTML = `
                <div class="stat color-cycle">${data.days} Days</div>
                <div class="stat color-cycle">${data.hours} Hours</div>
                <div class="stat color-cycle">${data.minutes} Minutes</div>
                <div class="stat color-cycle">${data.moments}</div>
            `;
            document.querySelector('.container').appendChild(statsContainer);
        });
}

// Initialize interactive elements
document.addEventListener('DOMContentLoaded', () => {
    initializeGallery();
    updateLoveStats();

    // Add click event for love reactions
    document.addEventListener('click', (e) => {
        const heart = document.createElement('div');
        heart.className = 'love-burst';
        heart.style.left = `${e.clientX}px`;
        heart.style.top = `${e.clientY}px`;
        document.body.appendChild(heart);

        // Send love click to server
        ws.send(JSON.stringify({
            type: 'love_click',
            position: { x: e.clientX, y: e.clientY }
        }));

        setTimeout(() => heart.remove(), 1000);
    });

    // Rotate love messages
    const messageElement = document.querySelector('.message');
    let currentMessage = 0;

    setInterval(() => {
        messageElement.style.opacity = 0;
        setTimeout(() => {
            messageElement.textContent = loveMessages[currentMessage];
            messageElement.style.opacity = 1;
            currentMessage = (currentMessage + 1) % loveMessages.length;
        }, 500);
    }, 5000);
});

// WebSocket event handlers
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'heart') {
        createFloatingHeart(data.color, data.position);
    } else if (data.type === 'love_reaction') {
        createHeartBurst(document.body);
    }
};

function createFloatingHeart(color, position) {
    const heart = document.createElement('div');
    heart.innerHTML = '❤';
    heart.className = 'floating-heart';
    heart.style.color = color;
    heart.style.left = `${position}vw`;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 3000);
}