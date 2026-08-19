const params = new URLSearchParams(window.location.search);

const movieId = params.get("id");
const movieType = params.get("type");

const movieDetail = document.getElementById("movie-detail");

// ==============================
// LƯU PHIM ĐÃ XEM
// ==============================
function saveToRecentMovies(movie) {
  let recent = JSON.parse(localStorage.getItem("recentMovies")) || [];

  // Xóa mọi bản ghi cùng phim, rồi thêm lại ở đầu danh sách.
  // Hỗ trợ cả dữ liệu lịch sử cũ chỉ lưu URL.
  recent = recent.filter((item) => {
    if (String(item.id) === String(movie.id) && item.type === movie.type) {
      return false;
    }

    try {
      const itemUrl = new URL(item.url, window.location.href);
      return !(
        itemUrl.searchParams.get("id") === String(movie.id) &&
        itemUrl.searchParams.get("type") === movie.type
      );
    } catch {
      return true;
    }
  });

  // Thêm vào đầu
  recent.unshift(movie);

  // Chỉ giữ tối đa 20 phim gần nhất
  if (recent.length > 20) {
    recent = recent.slice(0, 20);
  }

  localStorage.setItem("recentMovies", JSON.stringify(recent));
}

// ==============================
// KIỂM TRA ID
// ==============================
if (!movieId || movieId === "undefined") {
  movieDetail.innerHTML = `
    <h1>Không tìm thấy phim</h1>
    <p>ID phim không hợp lệ.</p>
    <a href="../main.html">← Quay lại</a>
  `;
} else {
  if (movieType === "anime") {
    loadAnime(movieId);
  } else if (movieType === "tmdb") {
    loadTMDB(movieId);
  } else {
    movieDetail.innerHTML = `
      <h1>Không xác định được loại phim</h1>
      <p>Loại phim không hợp lệ.</p>
      <a href="../main.html">← Quay lại</a>
    `;
  }
}

// ==============================
// JIKAN - ANIME
// ==============================
async function loadAnime(id) {
  try {
    movieDetail.innerHTML = "<p>Đang tải thông tin anime...</p>";

    const response = await fetch(`https://api.jikan.moe/v4/anime/${id}`);

    if (!response.ok) {
      throw new Error(`Jikan error: ${response.status}`);
    }

    const result = await response.json();
    const anime = result.data;

    if (!anime) {
      throw new Error("Không có dữ liệu anime");
    }

    const genres =
      anime.genres?.map((genre) => genre.name).join(", ") || "Chưa có";

    const studios =
      anime.studios?.map((studio) => studio.name).join(", ") || "Chưa có";

    const poster = anime.images?.jpg?.large_image_url || "";

    movieDetail.innerHTML = `
      <div class="movie-detail-container">
        <img
          class="movie-detail-poster"
          src="${poster}"
          alt="${anime.title}"
        >
        <div class="movie-detail-info">
          <h1>${anime.title}</h1>
          <p class="japanese-title">
            ${anime.title_japanese || ""}
          </p>
          <p>⭐ Điểm: ${anime.score || "Chưa có"}</p>
          <p>📺 Số tập: ${anime.episodes || "Chưa có"}</p>
          <p>📅 Năm: ${anime.year || "Chưa có"}</p>
          <p>🎭 Thể loại: ${genres}</p>
          <p>🎬 Studio: ${studios}</p>
          <p>📌 Trạng thái: ${anime.status || "Chưa có"}</p>
        </div>
      </div>

      <section class="movie-description">
        <h2>Giới thiệu</h2>
        <p>${anime.synopsis || "Chưa có mô tả."}</p>
      </section>

      <a href="../main.html">← Quay lại</a>
    `;

    document.title = anime.title;

    // Lưu vào lịch sử xem
    saveToRecentMovies({
      id: movieId,
      type: movieType,
      title: anime.title,
      poster: poster,
      url: window.location.href,
    });
  } catch (error) {
    console.error(error);

    movieDetail.innerHTML = `
      <h1>Không thể tải anime</h1>
      <p>Jikan API đang gặp vấn đề hoặc ID không tồn tại.</p>
      <a href="../main.html">← Quay lại</a>
    `;
  }
}

// ==============================
// TMDB - PHIM
// ==============================
async function loadTMDB(id) {
  try {
    movieDetail.innerHTML = "<p>Đang tải thông tin phim...</p>";

    const url =
      `https://api.themoviedb.org/3/movie/${id}` +
      `?api_key=${TMDB_API_KEY}` +
      `&language=vi-VN`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`TMDB error: ${response.status}`);
    }

    const movie = await response.json();

    const genres =
      movie.genres?.map((genre) => genre.name).join(", ") || "Chưa có";

    const poster = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "https://placehold.co/500x750/161616/ffffff?text=No+Poster";

    const year = movie.release_date
      ? movie.release_date.slice(0, 4)
      : "Chưa có";

    movieDetail.innerHTML = `
      <div class="movie-detail-container">
        <img
          class="movie-detail-poster"
          src="${poster}"
          alt="${movie.title}"
        >
        <div class="movie-detail-info">
          <h1>${movie.title}</h1>
          <p>
            ⭐ Điểm:
            ${movie.vote_average ? movie.vote_average.toFixed(1) : "Chưa có"}
          </p>
          <p>📅 Năm: ${year}</p>
          <p>🎭 Thể loại: ${genres}</p>
          <p>⏱️ Thời lượng: ${movie.runtime || "Chưa có"} phút</p>
          <p>🌍 Ngôn ngữ: ${movie.original_language || "Chưa có"}</p>
        </div>
      </div>

      <section class="movie-description">
        <h2>Giới thiệu</h2>
        <p>${movie.overview || "Chưa có mô tả."}</p>
      </section>

      <a href="../main.html">← Quay lại</a>
    `;

    document.title = movie.title;

    // Lưu vào lịch sử xem
    saveToRecentMovies({
      id: movieId,
      type: movieType,
      title: movie.title,
      poster: poster,
      url: window.location.href,
    });
  } catch (error) {
    console.error(error);

    movieDetail.innerHTML = `
      <h1>Không thể tải phim</h1>
      <p>TMDB API đang gặp vấn đề hoặc ID không tồn tại.</p>
      <a href="../main.html">← Quay lại</a>
    `;
  }
}
