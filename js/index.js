// ==========================================
// ELEMENTS
// ==========================================

const currentUser = document.getElementById("currentUser");
const loggedInUser = JSON.parse(localStorage.getItem("currentUser"));


if (loggedInUser && currentUser) {
  currentUser.textContent = loggedInUser.username;
}
const movieList = document.getElementById("movie-list");
const animeList = document.getElementById("anime-list");
const allMovieList = document.getElementById("all-movie-list");
const showMoreBtn = document.getElementById("show-more-btn");
const allAnimeList = document.getElementById("all-anime-list");
const showMoreAnimeBtn = document.getElementById("show-more-anime-btn");
const trendingMoviesMoreBtn = document.getElementById("trending-movies-more-btn");
const trendingAnimeMoreBtn = document.getElementById("trending-anime-more-btn");
const searchForm = document.getElementById("movie-search-form");
const searchInput = document.getElementById("movie-search-input");
const searchResults = document.getElementById("search-results");
const searchResultsTitle = document.getElementById("search-results-title");
const searchResultsList = document.getElementById("search-results-list");
const searchShowMoreContainer = document.getElementById("search-show-more-container");
const searchShowMoreBtn = document.getElementById("search-show-more-btn");
const heroSection = document.querySelector(".hero");
const browseSections = document.querySelectorAll(
  ".movie-section, .anime-section, .movies, .anime-movies"
);
const SEARCH_RESULTS_PER_PAGE = 12;
const MOVIES_PER_PAGE = 14;
let searchResultItems = [];
let visibleSearchResultCount = SEARCH_RESULTS_PER_PAGE;
let trendingMovieItems = [];
let trendingAnimeItems = [];
let popularMovieItems = [];
let popularAnimeItems = [];
let visibleTrendingMovies = MOVIES_PER_PAGE;
let visibleTrendingAnime = MOVIES_PER_PAGE;
let visiblePopularMovies = MOVIES_PER_PAGE;
let visiblePopularAnime = MOVIES_PER_PAGE;

// ==========================================
// ANIME list
// ==========================================

async function loadPopularAnime() {
  try {
    allAnimeList.innerHTML = `
      <p class="loading-text">⏳ Đang tải anime...</p>
    `;

    const response = await fetch(
      "https://api.jikan.moe/v4/top/anime?limit=24"
    );

    if (!response.ok) {
      throw new Error(`Jikan error: ${response.status}`);
    }

    const data = await response.json();

    popularAnimeItems = data.data || [];

    if (!popularAnimeItems.length) {
      renderMessage(
        allAnimeList,
        "Không tìm thấy anime."
      );
      return;
    }

    renderMovieCollection(
      allAnimeList,
      popularAnimeItems,
      visiblePopularAnime,
      showMoreAnimeBtn
    );

  } catch (error) {
    console.error("Popular anime error:", error);

    renderMessage(
      allAnimeList,
      "Không tải được anime. Vui lòng thử lại sau."
    );
  }

  return;

  showMoreAnimeBtn.addEventListener("click", () => {
  allAnimeList.classList.toggle("expanded");

  if (allAnimeList.classList.contains("expanded")) {
    showMoreAnimeBtn.textContent = "Thu gọn";
  } else {
    showMoreAnimeBtn.textContent = "Xem thêm";
  }
});
}

showMoreBtn.addEventListener("click", () => {
  return;

  allMovieList.classList.toggle("expanded");

  if (allMovieList.classList.contains("expanded")) {
    showMoreBtn.textContent = "Thu gọn";
  } else {
    showMoreBtn.textContent = "Xem thêm";
  }
});


// ==========================================
// PROFILE
// ==========================================

showMoreBtn.addEventListener("click", () => {
  visiblePopularMovies =
    visiblePopularMovies >= popularMovieItems.length
      ? MOVIES_PER_PAGE
      : popularMovieItems.length;
  renderMovieCollection(allMovieList, popularMovieItems, visiblePopularMovies, showMoreBtn);
});

showMoreAnimeBtn.addEventListener("click", () => {
  visiblePopularAnime =
    visiblePopularAnime >= popularAnimeItems.length
      ? MOVIES_PER_PAGE
      : popularAnimeItems.length;
  renderMovieCollection(allAnimeList, popularAnimeItems, visiblePopularAnime, showMoreAnimeBtn);
});

trendingMoviesMoreBtn.addEventListener("click", () => {
  visibleTrendingMovies =
    visibleTrendingMovies >= trendingMovieItems.length
      ? MOVIES_PER_PAGE
      : trendingMovieItems.length;
  renderMovieCollection(movieList, trendingMovieItems, visibleTrendingMovies, trendingMoviesMoreBtn);
});

trendingAnimeMoreBtn.addEventListener("click", () => {
  visibleTrendingAnime =
    visibleTrendingAnime >= trendingAnimeItems.length
      ? MOVIES_PER_PAGE
      : trendingAnimeItems.length;
  renderMovieCollection(animeList, trendingAnimeItems, visibleTrendingAnime, trendingAnimeMoreBtn);
});

if (currentUser) {
  currentUser.addEventListener("click", () => {
    window.location.href = "page/profile.html";
  });
}


// ==========================================
// HELPER
// ==========================================

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


function renderMessage(container, message) {
  if (!container) return;

  container.className = "movies-message";
  container.textContent = message;
}


function showMessage(message) {
  renderMessage(movieList, message);
}

function setBrowseSectionsVisible(isVisible) {
  browseSections.forEach((section) => {
    section.hidden = !isVisible;
  });

  if (heroSection) {
    heroSection.hidden = !isVisible;
  }
}

function renderSearchResults() {
  const visibleResults = searchResultItems.slice(0, visibleSearchResultCount);
  const isExpanded = visibleSearchResultCount >= searchResultItems.length;

  searchResultsList.className = "movie-library search-results-grid";
  searchResultsList.replaceChildren(...visibleResults.map(createMovieCard));
  searchShowMoreContainer.hidden = searchResultItems.length <= SEARCH_RESULTS_PER_PAGE;
  searchShowMoreBtn.textContent = isExpanded ? "Thu gọn" : "Xem thêm";
}

function renderMovieCollection(container, items, visibleCount, button) {
  const isExpanded = visibleCount >= items.length;

  container.replaceChildren(...items.slice(0, visibleCount).map(createMovieCard));
  container.classList.toggle("expanded", isExpanded);
  button.parentElement.hidden = items.length <= MOVIES_PER_PAGE;
  button.textContent = isExpanded ? "Thu gọn" : "Xem thêm";
}


// ==========================================
// SEARCH MOVIES AND ANIME
// ==========================================

async function searchTMDBMovies(query) {
  if (typeof TMDB_API_KEY === "undefined" || !TMDB_API_KEY) {
    return [];
  }

  const url = new URL("https://api.themoviedb.org/3/search/movie");
  url.search = new URLSearchParams({
    api_key: TMDB_API_KEY,
    query,
    language: "vi-VN"
  });

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`TMDB search error: ${response.status}`);
  }

  const data = await response.json();
  return data.results || [];
}

async function searchAnime(query) {
  const url = new URL("https://api.jikan.moe/v4/anime");
  url.search = new URLSearchParams({ q: query, limit: "12" });

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Jikan search error: ${response.status}`);
  }

  const data = await response.json();
  return data.data || [];
}

async function searchTitles(query) {
  searchResults.hidden = false;
  searchResultsTitle.textContent = `Kết quả tìm kiếm: “${query}”`;
  searchResultsList.className = "movie-library search-results-grid";
  searchResultsList.innerHTML = '<p class="loading-text">Đang tìm kiếm...</p>';
  searchShowMoreContainer.hidden = true;

  const [movieSearch, animeSearch] = await Promise.allSettled([
    searchTMDBMovies(query),
    searchAnime(query)
  ]);

  const movies = movieSearch.status === "fulfilled" ? movieSearch.value : [];
  const anime = animeSearch.status === "fulfilled" ? animeSearch.value : [];
  const results = [...movies, ...anime];

  if (!results.length) {
    setBrowseSectionsVisible(true);
    searchResultItems = [];
    renderMessage(searchResultsList, "Không tìm thấy phim hoặc anime phù hợp.");
    return;
  }

  setBrowseSectionsVisible(false);
  searchResultItems = results;
  visibleSearchResultCount = SEARCH_RESULTS_PER_PAGE;
  renderSearchResults();
}

if (searchForm && searchInput) {
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const query = searchInput.value.trim();

    if (!query) {
      searchResults.hidden = true;
      setBrowseSectionsVisible(true);
      searchShowMoreContainer.hidden = true;
      return;
    }

    searchTitles(query).catch((error) => {
      console.error("Search error:", error);
      searchResults.hidden = false;
      setBrowseSectionsVisible(true);
      searchShowMoreContainer.hidden = true;
      renderMessage(searchResultsList, "Không thể tìm kiếm lúc này. Vui lòng thử lại.");
    });
  });

  searchInput.addEventListener("input", () => {
    if (!searchInput.value.trim()) {
      searchResults.hidden = true;
      setBrowseSectionsVisible(true);
      searchShowMoreContainer.hidden = true;
    }
  });
}

if (searchShowMoreBtn) {
  searchShowMoreBtn.addEventListener("click", () => {
    visibleSearchResultCount =
      visibleSearchResultCount >= searchResultItems.length
        ? SEARCH_RESULTS_PER_PAGE
        : searchResultItems.length;
    renderSearchResults();
  });
}


// ==========================================
// RECENT MOVIES
// ==========================================

function saveRecentMovie(movie) {
  const recentMovies =
    JSON.parse(
      localStorage.getItem("recentMovies")
    ) || [];


  // ==============================
  // XÁC ĐỊNH LOẠI PHIM
  // ==============================

  let type;
  let url;

  // Anime - Jikan
  if (movie.mal_id) {
    type = "anime";

    url =
      `page/movie.html?type=anime&id=${movie.mal_id}`;
  }

  // Movie - TMDB
  else if (movie.id) {
    type = "tmdb";

    url =
      `page/movie.html?type=tmdb&id=${movie.id}`;
  }

  else {
    console.log(
      "Không tìm thấy ID phim:",
      movie
    );

    return;
  }


  // ==============================
  // TITLE
  // ==============================

  const title =
    movie.title ||
    movie.name ||
    "Unknown";


  // ==============================
  // POSTER
  // ==============================

  const poster =
    movie.images?.jpg?.large_image_url ||
    (
      movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "https://placehold.co/500x750/161616/ffffff?text=No+Poster"
    );


  // ==============================
  // OBJECT
  // ==============================

  const recentMovie = {
    id: movie.mal_id || movie.id,
    type: type,
    title: title,
    poster: poster,
    url: url
  };


  // ==============================
  // XÓA PHIM TRÙNG
  // ==============================

  const filteredMovies =
    recentMovies.filter(
      (item) =>
        !(
          item.id === recentMovie.id &&
          item.type === recentMovie.type
        )
    );


  // ==============================
  // ĐƯA PHIM MỚI LÊN ĐẦU
  // ==============================

  filteredMovies.unshift(recentMovie);


  // ==============================
  // CHỈ GIỮ 10 PHIM
  // ==============================

  const limitedMovies =
    filteredMovies.slice(0, 10);


  // ==============================
  // LƯU LOCAL STORAGE
  // ==============================

  localStorage.setItem(
    "recentMovies",
    JSON.stringify(limitedMovies)
  );
}


// ==========================================
// CREATE MOVIE CARD
// ==========================================

function createMovieCard(movie) {

  // ==============================
  // CARD
  // ==============================

  const card =
    document.createElement("article");

  card.className = "movie-card";


  // ==============================
  // TITLE
  // ==============================

  const titleText =
    movie.title ||
    movie.name ||
    "Unknown";


  // ==============================
  // POSTER URL
  // ==============================

  const posterUrl =
    movie.images?.jpg?.large_image_url ||
    (
      movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "https://placehold.co/500x750/161616/ffffff?text=No+Poster"
    );


  // ==============================
  // POSTER
  // ==============================

  const poster =
    document.createElement("img");

  poster.className = "movie-poster";
  poster.loading = "lazy";
  poster.alt = `Poster ${titleText}`;
  poster.src = posterUrl;


  // ==============================
  // INFO
  // ==============================

  const info =
    document.createElement("div");

  info.className = "movie-info";


  // ==============================
  // TITLE ELEMENT
  // ==============================

  const title =
    document.createElement("h3");

  title.className = "movie-title";
  title.textContent = titleText;


  // ==============================
  // META
  // ==============================

  const meta =
    document.createElement("p");

  meta.className = "movie-meta";


  // ==============================
  // YEAR
  // ==============================

  const year =
    movie.year ||
    movie.release_date?.slice(0, 4) ||
    movie.aired?.from?.slice(0, 4) ||
    "Đang cập nhật";


  // ==============================
  // SCORE
  // ==============================

  const scoreValue =
    movie.score ||
    movie.vote_average;


  const score =
    scoreValue
      ? `★ ${Number(scoreValue).toFixed(1)}`
      : "Chưa có điểm";


  meta.textContent =
    `${year} · ${score}`;


  // ==============================
  // APPEND
  // ==============================

  info.append(
    title,
    meta
  );

  card.append(
    poster,
    info
  );


  // ==========================================
  // CLICK CARD
  // ==========================================

  card.addEventListener("click", () => {

    // Lưu vào đã xem gần đây
    saveRecentMovie(movie);


    // ==============================
    // ANIME
    // ==============================

    if (movie.mal_id) {

      window.location.href =
        `page/movie.html?type=anime&id=${movie.mal_id}`;

      return;
    }


    // ==============================
    // TMDB
    // ==============================

    if (movie.id) {

      window.location.href =
        `page/movie.html?type=tmdb&id=${movie.id}`;

      return;
    }


    console.log(
      "Không tìm thấy ID phim:",
      movie
    );
  });


  return card;
}


// ==========================================
// LOAD TRENDING MOVIES
// ==========================================

async function loadMovies() {

  if (!TMDB_API_KEY) {

    showMessage(
      "Thiếu API key TMDB"
    );

    return;
  }


  try {

    const url =
      new URL(
        "https://api.themoviedb.org/3/trending/movie/week"
      );


    url.search =
      new URLSearchParams({
        api_key: TMDB_API_KEY,
        language: "vi-VN"
      });


    const response =
      await fetch(url);


    if (!response.ok) {

      throw new Error(
        "TMDB request failed"
      );
    }


    const data =
      await response.json();


    trendingMovieItems = data.results || [];

    renderMovieCollection(
      movieList,
      trendingMovieItems,
      visibleTrendingMovies,
      trendingMoviesMoreBtn
    );

  }

  catch (error) {

    console.error(error);

    showMessage(
      "Không tải được phim. Hãy kiểm tra API key TMDB và kết nối mạng."
    );
  }
}


// ==========================================
// ANIME IDS
// ==========================================

const romanceAnimeIds = [

  38101,
  42897,
  50425,
  54744,
  50739,
  14753,
  4224,

  23273,
  2167,
  4181,
  1698,
  7054,
  1575,
  877,
  1535,

  14719,
  28297,
  2904,
  1210,
  18671,

  48926,
  51535,
  55866,
  52991,
  30015,
  35860,
  21995,
  3731,
  6045,
  4224
];


// ==========================================
// FETCH ANIME
// ==========================================

async function fetchAnimeMovieList() {
  try {
    const response = await fetch(
      "https://api.jikan.moe/v4/top/anime?limit=25"
    );

    if (!response.ok) {
      throw new Error(`Jikan error: ${response.status}`);
    }

    const data = await response.json();

    return data.data || [];

  } catch (error) {
    console.error("Anime API error:", error);
    return [];
  }
}

// ==========================================
// LOAD ANIME
// ==========================================

async function loadAnimeMovies() {
  animeList.innerHTML = `
    <p class="loading-text">⏳ Đang tải anime...</p>
  `;

  trendingAnimeItems = await fetchAnimeMovieList();

  if (!trendingAnimeItems.length) {
    renderMessage(
      animeList,
      "Không tải được anime. Vui lòng thử lại sau."
    );
    return;
  }

  renderMovieCollection(
    animeList,
    trendingAnimeItems,
    visibleTrendingAnime,
    trendingAnimeMoreBtn
  );
}

// ==========================================
// LOAD POPULAR TMDB MOVIES
// ==========================================

async function loadPopularMovies() {

  if (!TMDB_API_KEY) {

    renderMessage(
      allMovieList,
      "Thiếu API key TMDB."
    );

    return;
  }


  try {

    let movies = [];


    // Lấy 5 trang
    for (
      let page = 1;
      page <= 5;
      page++
    ) {

      const response =
        await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=vi-VN&page=${page}`
        );


      if (!response.ok) {

        throw new Error(
          "TMDB popular request failed"
        );
      }


      const data =
        await response.json();


      if (data.results) {

        movies.push(
          ...data.results
        );
      }
    }


    popularMovieItems = movies;

    renderMovieCollection(
      allMovieList,
      popularMovieItems,
      visiblePopularMovies,
      showMoreBtn
    );

  }

  catch (error) {

    console.error(error);

    renderMessage(
      allMovieList,
      "Không tải được phim phổ biến."
    );
  }
}


// ==========================================
// HERO
// ==========================================

async function loadHero() {
  const heroTitle = document.getElementById("hero-title");
  const heroInfo = document.getElementById("hero-info");
  const heroDescription = document.getElementById("hero-description");
  const heroButton = document.getElementById("hero-button");

  // Dữ liệu Hero TQQ
  heroTitle.textContent = "The Quintessential Quintuplets";

  heroInfo.textContent = "Romance · Comedy · School";

  heroDescription.textContent =
    "Futaro Uesugi trở thành gia sư cho năm chị em Nakano, mở ra một câu chuyện tình cảm đầy hài hước và những bí mật.";

  heroButton.onclick = () => {
    window.location.href = "page/movie.html?type=anime&id=38101";
  };
}

loadMovies();
loadAnimeMovies();
loadPopularMovies();
loadPopularAnime();
loadHero();
