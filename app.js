const movies = [
    { 
        id: 1, 
        title: "Inception", 
        year: 2010, 
        genres: ["Hành động", "Khoa học viễn tưởng"], 
        director: "Christopher Nolan", 
        desc: "Kẻ trộm đánh cắp bí mật thông qua công nghệ chia sẻ giấc mơ.", 
        poster: "images/inception.webp" 
    },
    { 
        id: 2, 
        title: "The Dark Knight", 
        year: 2008, 
        genres: ["Hành động", "Tội phạm"], 
        director: "Christopher Nolan", 
        desc: "Batman đối đầu với Joker để bảo vệ thành phố Gotham.", 
        poster: "images/dark-knight.webp" 
    }
];

// DOM Elements
const movieGrid = document.getElementById('movie-grid');
const genreContainer = document.getElementById('genre-filters');
const searchInput = document.getElementById('search-input');
const themeToggle = document.getElementById('theme-toggle');

// 1. Khởi tạo danh sách thể loại (Tự động)
function initGenres() {
    const allGenres = [...new Set(movies.flatMap(m => m.genres))];
    genreContainer.innerHTML = allGenres.map(genre => `
        <div style="margin-bottom: 8px;">
            <input type="checkbox" value="${genre}" class="genre-checkbox" id="${genre}">
            <label for="${genre}">${genre}</label>
        </div>
    `).join('');
}

// 2. Hiển thị danh sách phim
function displayMovies(data) {
    if (data.length === 0) {
        movieGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center;">Không tìm thấy phim nào phù hợp.</p>`;
        return;
    }
    movieGrid.innerHTML = data.map(movie => `
        <div class="movie-card" onclick="openModal(${movie.id})">
            <img src="${movie.poster}" alt="${movie.title}" onerror="this.src='https://via.placeholder.com/200x300?text=No+Image'">
            <div class="movie-info">
                <h4>${movie.title}</h4>
                <p>${movie.year}</p>
            </div>
        </div>
    `).join('');
}

// 3. Logic Lọc (Search + Checkbox)
function filterMovies() {
    const term = searchInput.value.toLowerCase();
    const selectedGenres = Array.from(document.querySelectorAll('.genre-checkbox:checked')).map(cb => cb.value);

    const filtered = movies.filter(m => {
        const matchSearch = m.title.toLowerCase().includes(term);
        const matchGenre = selectedGenres.length === 0 || selectedGenres.some(g => m.genres.includes(g));
        return matchSearch && matchGenre;
    });
    displayMovies(filtered);
}

// 4. Debounce (Tối ưu tìm kiếm)
function debounce(func, wait = 400) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// 5. Modal & Theme
function openModal(id) {
    const m = movies.find(movie => movie.id === id);
    document.getElementById('modal-body').innerHTML = `
        <div style="display: flex; gap: 20px; flex-wrap: wrap;">
            <img src="${m.poster}" style="width: 250px; border-radius: 8px;" onerror="this.src='https://via.placeholder.com/200x300'">
            <div style="flex: 1; min-width: 300px;">
                <h2 style="margin-top:0">${m.title} (${m.year})</h2>
                <p><strong>Đạo diễn:</strong> ${m.director}</p>
                <p><strong>Thể loại:</strong> ${m.genres.join(', ')}</p>
                <p style="line-height: 1.6;">${m.desc}</p>
            </div>
        </div>
    `;
    document.getElementById('movie-modal').style.display = "block";
}

// Event Listeners
searchInput.addEventListener('input', debounce(filterMovies));
genreContainer.addEventListener('change', filterMovies);

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.innerText = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
});

document.querySelector('.close-modal').onclick = () => document.getElementById('movie-modal').style.display = "none";
window.onclick = (e) => { if(e.target.classList.contains('modal')) e.target.style.display = "none"; }

// Khởi chạy khi load trang
window.onload = () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.innerText = '☀️ Light Mode';
    }
    initGenres();
    displayMovies(movies);
};
