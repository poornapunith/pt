const grid = document.querySelector("#video-grid");
const emptyState = document.querySelector("#empty-state");
const videoCount = document.querySelector("#video-count");
const year = document.querySelector("#year");

if (year) {
  year.textContent = new Date().getFullYear();
}

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const getYouTubeId = (value = "") => {
  const trimmed = value.trim();

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);

    if (url.hostname.includes("youtu.be")) {
      return url.pathname.split("/").filter(Boolean)[0] || "";
    }

    if (url.searchParams.has("v")) {
      return url.searchParams.get("v") || "";
    }

    const parts = url.pathname.split("/").filter(Boolean);
    const shortsIndex = parts.findIndex((part) => part === "shorts");
    const embedIndex = parts.findIndex((part) => part === "embed");

    if (shortsIndex >= 0 && parts[shortsIndex + 1]) {
      return parts[shortsIndex + 1];
    }

    if (embedIndex >= 0 && parts[embedIndex + 1]) {
      return parts[embedIndex + 1];
    }
  } catch {
    return "";
  }

  return "";
};

const getThumbnailUrl = (youtubeId) =>
  `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;

const getFallbackThumbnailUrl = (youtubeId) =>
  `https://i.ytimg.com/vi/${youtubeId}/mqdefault.jpg`;

const renderPlayer = (button) => {
  const card = button.closest(".video-card");
  const frame = card?.querySelector(".video-frame");
  const youtubeId = button.dataset.youtubeId;
  const title = button.dataset.title || "Poorna Tech video";

  if (!frame || !youtubeId) {
    return;
  }

  frame.innerHTML = `
    <iframe
      src="https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0"
      title="${escapeHtml(title)}"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen>
    </iframe>
  `;
};

const renderVideos = (videos = []) => {
  if (!grid || !emptyState || !videoCount) {
    return;
  }

  grid.innerHTML = "";

  if (!videos.length) {
    emptyState.hidden = false;
    videoCount.textContent = "0 videos";
    return;
  }

  emptyState.hidden = true;
  videoCount.textContent = `${videos.length} video${videos.length === 1 ? "" : "s"}`;

  grid.innerHTML = videos
    .map((video) => {
      const youtubeId = getYouTubeId(video.youtubeUrl || video.youtubeId || "");
      const title = escapeHtml(video.title || "Poorna Tech video");
      const promptUrl = escapeHtml(video.promptUrl || "#");

      if (!youtubeId) {
        return "";
      }

      return `
        <article class="video-card">
          <div class="video-frame">
            <img
              src="${getThumbnailUrl(youtubeId)}"
              onerror="this.src='${getFallbackThumbnailUrl(youtubeId)}'"
              alt="${title}"
              loading="lazy"
            />
          </div>
          <div class="video-content">
            <h2>${title}</h2>
            <div class="card-actions">
              <button
                class="action-button"
                type="button"
                data-play-video
                data-youtube-id="${youtubeId}"
                data-title="${title}">
                Play Video
              </button>
              <a class="action-button secondary-button" href="${promptUrl}" target="_blank" rel="noreferrer">
                Copy Prompt
              </a>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  document.querySelectorAll("[data-play-video]").forEach((button) => {
    button.addEventListener("click", () => renderPlayer(button));
  });
};

if (Array.isArray(window.POORNA_TECH_VIDEOS)) {
  renderVideos(window.POORNA_TECH_VIDEOS);
} else {
  renderVideos([]);
}
