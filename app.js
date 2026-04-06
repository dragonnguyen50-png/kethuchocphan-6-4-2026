const movies = [
    { id: 1, title: "Inception", year: 2010, genres: ["Hành động", "Khoa học viễn tưởng"], director: "Christopher Nolan", desc: "Kẻ trộm đánh cắp bí mật thông qua công nghệ chia sẻ giấc mơ.", poster: "images/inception.jpg" },
    { id: 2, title: "The Dark Knight", year: 2008, genres: ["Hành động", "Tội phạm"], director: "Christopher Nolan", desc: "Batman đối đầu với Joker.", poster: "images/dark-knight.jpg" },
    // Thêm các phim khác vào đây...
];

const movieGrid = document.getElementById('movie-grid');
const genreContainer = document.getElementById('genre-filters');
const searchInput = document.getElementById('search-input');
const themeToggle = document.getElementById('theme-toggle');

// 1. Hiển thị dữ liệu
function displayMovies(data) {
    movieGrid.innerHTML = data.map(movie => `
        <div class="movie-card" onclick="openModal(${movie.id})">
            <img src="${movie.poster}" alt="${movie.title}">
            <div class="movie-info">
                <h4>${movie.title}</h4>
                <p>${movie.year}</p>
            </div>
        </div>
    `).join('');
}

// 2. Tự động tạo Checkbox Thể loại
function initGenres() {
    const allGenres = [...new Set(movies.flatMap(m => m.genres))];
    genreContainer.innerHTML = allGenres.map(genre => `
        <label>
            <input type="checkbox" value="${genre}" class="genre-checkbox"> ${genre}
        </label><br>
    `).join('');
}

// 4. Logic Lọc tích hợp (Search + Genre)
function filterMovies() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedGenres = Array.from(document.querySelectorAll('.genre-checkbox:checked')).map(cb => cb.value);

    const filtered = movies.filter(movie => {
        const matchSearch = movie.title.toLowerCase().includes(searchTerm);
        const matchGenre = selectedGenres.length === 0 || selectedGenres.some(g => movie.genres.includes(g));
        return matchSearch && matchGenre;
    });

    displayMovies(filtered);
}

// 5. Debounce cho tìm kiếm
function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

const processSearch = debounce(() => filterMovies());

// Sự kiện
searchInput.addEventListener('input', processSearch);
genreContainer.addEventListener('change', filterMovies);

// Bài 3: Light/Dark Mode & Modal
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.innerText = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
});

function openModal(id) {
    const movie = movies.find(m => m.id === id);
    const modal = document.getElementById('movie-modal');
    document.getElementById('modal-body').innerHTML = `
        <div style="display: flex; gap: 20px;">
            <img src="${movie.poster}" style="width: 300px; border-radius: 10px;">
            <div>
                <h2>${movie.title} (${movie.year})</h2>
                <p><strong>Đạo diễn:</strong> ${movie.director}</p>
                <p><strong>Thể loại:</strong> ${movie.genres.join(', ')}</p>
                <p>${movie.desc}</p>
            </div>
        </div>
    `;
    modal.style.display = "block";
}

document.querySelector('.close-modal').onclick = () => {
    document.getElementById('movie-modal').style.display = "none";
};

// Khởi tạo trang
window.onload = () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.innerText = '☀️ Light Mode';
    }
    initGenres();
    displayMovies(movies);
};