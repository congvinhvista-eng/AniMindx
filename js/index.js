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

    const anime = data.data || [];

    if (!anime.length) {
      renderMessage(
        allAnimeList,
        "Không tìm thấy anime."
      );
      return;
    }

    allAnimeList.replaceChildren(
      ...anime.map(createMovieCard)
    );

  } catch (error) {
    console.error("Popular anime error:", error);

    renderMessage(
      allAnimeList,
      "Không tải được anime. Vui lòng thử lại sau."
    );
  }
  
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

  const tmdbApiKey = typeof TMDB_API_KEY === "undefined" ? "" : TMDB_API_KEY;

  if (!tmdbApiKey) {

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
        api_key: tmdbApiKey,
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


    const results =
      data.results || [];


    movieList.replaceChildren(
      ...results
        .slice(0, 18)
        .map(createMovieCard)
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
      "https://api.jikan.moe/v4/top/anime?limit=12"
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

  const animeMovies = await fetchAnimeMovieList();

  if (!animeMovies.length) {
    renderMessage(
      animeList,
      "Không tải được anime. Vui lòng thử lại sau."
    );
    return;
  }

  animeList.replaceChildren(
    ...animeMovies.map(createMovieCard)
  );
}

// ==========================================
// LOAD POPULAR TMDB MOVIES
// ==========================================

async function loadPopularMovies() {

  const tmdbApiKey = typeof TMDB_API_KEY === "undefined" ? "" : TMDB_API_KEY;

  if (!tmdbApiKey) {

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
          `https://api.themoviedb.org/3/movie/popular?api_key=${tmdbApiKey}&language=vi-VN&page=${page}`
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


    allMovieList.replaceChildren(
      ...movies.map(
        createMovieCard
      )
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
