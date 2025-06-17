


// Quote collection - mix of local quotes and API
const localQuotes = [
    {
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs"
    },
    {
        text: "Innovation distinguishes between a leader and a follower.",
        author: "Steve Jobs"
    },
    {
        text: "Life is what happens to you while you're busy making other plans.",
        author: "John Lennon"
    },
    {
        text: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt"
    },
    {
        text: "The only impossible journey is the one you never begin.",
        author: "Tony Robbins"
    },
    {
        text: "In the middle of difficulty lies opportunity.",
        author: "Albert Einstein"
    },
    {
        text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author: "Winston Churchill"
    },
    {
        text: "The way to get started is to quit talking and begin doing.",
        author: "Walt Disney"
    },
    {
        text: "Don't let yesterday take up too much of today.",
        author: "Will Rogers"
    },
    {
        text: "You learn more from failure than from success. Don't let it stop you. Failure builds character.",
        author: "Unknown"
    }
];

// DOM elements
const quoteText = document.getElementById('quoteText');
const quoteAuthor = document.getElementById('quoteAuthor');
const newQuoteBtn = document.getElementById('newQuoteBtn');
const shareBtn = document.getElementById('shareBtn');
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

let currentQuote = null;
let isLoading = false;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    loadLastQuote();
});

// Theme management
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

function toggleTheme() {
    body.classList.toggle('dark');
    const isDark = body.classList.contains('dark');
    themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Quote management
function loadLastQuote() {
    const savedQuote = localStorage.getItem('lastQuote');
    if (savedQuote) {
        currentQuote = JSON.parse(savedQuote);
        displayQuote(currentQuote, false);
    } else {
        getNewQuote();
    }
}

async function getNewQuote() {
    if (isLoading) return;
    
    isLoading = true;
    body.classList.add('loading');
    
    try {
        // Try to fetch from API first
        const response = await fetch('https://api.quotable.io/random');
        if (response.ok) {
            const data = await response.json();
            currentQuote = {
                text: data.content,
                author: data.author
            };
        } else {
            throw new Error('API failed');
        }
    } catch (error) {
        // Fallback to local quotes
        console.log('Using local quotes as fallback');
        currentQuote = localQuotes[Math.floor(Math.random() * localQuotes.length)];
    }
    
    displayQuote(currentQuote);
    saveQuote(currentQuote);
    
    isLoading = false;
    body.classList.remove('loading');
}

function displayQuote(quote, animate = true) {
    if (animate) {
        // Fade out current quote
        quoteText.classList.add('fade-out');
        quoteAuthor.classList.add('fade-out');
        
        setTimeout(() => {
            quoteText.textContent = quote.text;
            quoteAuthor.textContent = quote.author;
            updateShareButton(quote);
            
            // Reset animations
            quoteText.classList.remove('fade-out');
            quoteAuthor.classList.remove('fade-out');
            quoteText.style.animation = 'none';
            quoteAuthor.style.animation = 'none';
            
            // Trigger reflow
            quoteText.offsetHeight;
            quoteAuthor.offsetHeight;
            
            // Restart animations
            quoteText.style.animation = 'fadeInUp 0.6s ease forwards';
            quoteAuthor.style.animation = 'fadeInUp 0.6s ease 0.2s forwards';
        }, 300);
    } else {
        quoteText.textContent = quote.text;
        quoteAuthor.textContent = quote.author;
        updateShareButton(quote);
    }
}

function updateShareButton(quote) {
    const tweetText = `"${quote.text}" - ${quote.author}`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&hashtags=inspiration,quotes`;
    shareBtn.href = tweetUrl;
}

function saveQuote(quote) {
    localStorage.setItem('lastQuote', JSON.stringify(quote));
}

// Event listeners
newQuoteBtn.addEventListener('click', getNewQuote);
themeToggle.addEventListener('click', toggleTheme);

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.code === 'Space' && !isLoading) {
        e.preventDefault();
        getNewQuote();
    }
    if (e.code === 'KeyT' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        toggleTheme();
    }
});

// Add some interactive effects
document.addEventListener('mousemove', function(e) {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    document.documentElement.style.setProperty('--mouse-x', mouseX);
    document.documentElement.style.setProperty('--mouse-y', mouseY);
});
