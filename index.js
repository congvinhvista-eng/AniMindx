

const movieList = document.getElementById("movie-list");
const animeList = document.getElementById("anime-list");
const allMovieList = document.getElementById("all-movie-list");
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function renderMessage(container, message) {
  container.className = "movies-message";
  container.textContent = message;
}

function showMessage(message) {
  renderMessage(movieList, message);
}

function createMovieCard(movie) {
  const card = document.createElement("article");
  card.className = "movie-card";

  const titleText = movie.title || movie.name || "Unknown";

  const posterUrl =
    movie.images?.jpg?.large_image_url ||
    (movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "https://placehold.co/500x750/161616/ffffff?text=No+Poster");

  const poster = document.createElement("img");
  poster.className = "movie-poster";
  poster.loading = "lazy";
  poster.alt = `Poster ${titleText}`;
  poster.src = posterUrl;

  const info = document.createElement("div");
  info.className = "movie-info";

  const title = document.createElement("h3");
  title.className = "movie-title";
  title.textContent = titleText;

  const meta = document.createElement("p");
  meta.className = "movie-meta";

  const year =
    movie.year ||
    movie.release_date?.slice(0, 4) ||
    "Đang cập nhật";

  const scoreValue = movie.score || movie.vote_average;

  const score = scoreValue
    ? `★ ${Number(scoreValue).toFixed(1)}`
    : "Chưa có điểm";

  meta.textContent = `${year} · ${score}`;

  info.append(title, meta);
  card.append(poster, info);

  // ==============================
  // CLICK VÀO PHIM
  // ==============================

  card.addEventListener("click", () => {

    // Anime từ Jikan
    if (movie.mal_id) {
      window.location.href =
        `movie.html?type=anime&id=${movie.mal_id}`;
      return;
    }

    // Phim từ TMDB
    if (movie.id) {
      window.location.href =
        `movie.html?type=tmdb&id=${movie.id}`;
      return;
    }

    console.log("Không tìm thấy ID phim:", movie);
  });

  return card;
}


async function loadMovies() {

  if (!TMDB_API_KEY) {
    showMessage("Thiếu API key TMDB");
    return;
  }

  try {

    const url = new URL(
      "https://api.themoviedb.org/3/trending/movie/week"
    );

    url.search = new URLSearchParams({
      api_key: TMDB_API_KEY,
      language: "vi-VN"
    });

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("TMDB request failed");
    }

    const { results } = await response.json();

    movieList.replaceChildren(
      ...results
        .slice(0, 18)
        .map(createMovieCard)
    );

  } catch (error) {

    console.error(error);

    showMessage(
      "Không tải được phim. Hãy kiểm tra API key TMDB và kết nối mạng."
    );
  }
}

const romanceAnimeIds = [
  38101, // The Quintessential Quintuplets
  42897, // Horimiya
  50425, // My Dress-Up Darling
  54744, // Alya Sometimes Hides Her Feelings in Russian
  50739, // The Angel Next Door Spoils Me Rotten
  14753, // Oregairu
  4224,  // Toradora!

  23273, // Your Lie in April
  2167,  // Clannad
  4181,  // Clannad After Story
  1698,  // Nodame Cantabile
  7054,  // Kaichou wa Maid-sama!
  1575,  // Code Geass (ít romance)
  877,   // Nana
  1535,  // Death Note (ít romance)

  14719, // Chuunibyou demo Koi ga Shitai!
  28297, // Ore Monogatari!!
  2904,  // School Rumble
  1210,  // NHK ni Youkoso!
  18671, // Golden Time

  48926, // More than a Married Couple, but Not Lovers
  51535, // The Dangers in My Heart
  55866, // Blue Box
  52991, // The Angel Next Door
  30015, // ReLIFE
  35860, // Tsuki ga Kirei
  21995, // Ao Haru Ride
  3731,  // Itazura na Kiss
  6045,  // Kimi ni Todoke
  4224   // Toradora
];



async function fetchAnimeMovieList() {
  const results = [];

for (const id of romanceAnimeIds) {
  try {
    const response = await fetch(
      `https://api.jikan.moe/v4/anime/${id}`
    );

    console.log("ID:", id, "Status:", response.status);

    const data = await response.json();

    console.log(data);

    if (data.data) {
      results.push(data.data);
    }

    await sleep(500);

  } catch (error) {
    console.error("Anime load error:", error);
  }
}

  return results;
}

async function loadAnimeMovies() {

  animeList.innerHTML = `
    <p class="loading-text">⏳ Đang tải anime...</p>
  `;

  try {

    const animeMovies =
      await fetchAnimeMovieList();

    if (!animeMovies.length) {

      renderMessage(
        animeList,
        "Không tìm thấy phim anime."
      );

      return;
    }

    animeList.replaceChildren(
      ...animeMovies.map(createMovieCard)
    );

  } catch (error) {

    console.error(error);

    renderMessage(
      animeList,
      "Không tải được anime."
    );
  }
}
async function loadPopularMovies() {
  try {

    let movies = [];

    for (let page = 1; page <= 5; page++) {

      const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=vi-VN&page=${page}`
      );

      const data = await response.json();

      movies.push(...data.results);
    }

    allMovieList.replaceChildren(
      ...movies.map(createMovieCard)
    );

  } catch (error) {

    console.error(error);

    renderMessage(
      allMovieList,
      "Không tải được phim phổ biến."
    );
  }
}



// Chạy website
loadMovies();
loadAnimeMovies();
loadPopularMovies();

async function loadHero() {
  try {
    const response = await fetch(
      "https://api.jikan.moe/v4/anime/39783"
    );

    const data = await response.json();
    const anime = data.data;

    document.getElementById("hero-title").textContent =
      anime.title;

    document.getElementById("hero-info").textContent =
      anime.genres.map(g => g.name).join(", ");

    document.getElementById("hero-description").textContent =
      anime.synopsis?.slice(0, 200) + "...";
  } catch (error) {
    console.error(error);
  }
}

loadHero();