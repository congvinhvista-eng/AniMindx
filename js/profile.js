const recentMoviesContainer =
  document.getElementById("recent-movies");

function loadRecentMovies() {
  const recentMovies =
    JSON.parse(localStorage.getItem("recentMovies")) || [];

  if (recentMovies.length === 0) {
    recentMoviesContainer.innerHTML = `
      <p class="empty-message">
        Bạn chưa xem bộ phim nào.
      </p>
    `;
    return;
  }

  recentMoviesContainer.replaceChildren(
    ...recentMovies.map((movie) => {
      const card = document.createElement("article");
      card.className = "movie-card";

      card.innerHTML = `
        <img
          class="movie-poster"
          src="${movie.poster}"
          alt="${movie.title}"
        >

        <div class="movie-info">
          <h3 class="movie-title">
            ${movie.title}
          </h3>
        </div>
      `;

      card.addEventListener("click", () => {
        window.location.href =
          movie.url;
      });

      return card;
    })
  );
}

loadRecentMovies();