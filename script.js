const grid = document.querySelector("#video-grid");
const emptyState = document.querySelector("#empty-state");
const videoCount = document.querySelector("#video-count");
const year = document.querySelector("#year");
const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

year.textContent = new Date().getFullYear();

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
    const shortIndex = parts.findIndex((part) => part === "shorts");
    const embedIndex = parts.findIndex((part) => part === "embed");

    if (shortIndex >= 0 && parts[shortIndex + 1]) {
      return parts[shortIndex + 1];
    }

    if (embedIndex >= 0 && parts[embedIndex + 1]) {
      return parts[embedIndex + 1];
    }
  } catch {
    return "";
  }

  return "";
};

const getYouTubeUrl = (youtubeId) => `https://www.youtube.com/watch?v=${youtubeId}`;

const sendPlayerCommand = (iframe, command) => {
  if (!iframe?.contentWindow) {
    return;
  }

  iframe.contentWindow.postMessage(
    JSON.stringify({
      event: "command",
      func: command,
      args: []
    }),
    "*"
  );
};

const setupAutoplay = () => {
  const cards = [...document.querySelectorAll(".video-card")];

  if (window.location.protocol === "file:") {
    return;
  }

  if (canHover) {
    cards.forEach((card) => {
      const iframe = card.querySelector("iframe");

      card.addEventListener("mouseenter", () => sendPlayerCommand(iframe, "playVideo"));
      card.addEventListener("mouseleave", () => sendPlayerCommand(iframe, "pauseVideo"));
      card.addEventListener("focusin", () => sendPlayerCommand(iframe, "playVideo"));
      card.addEventListener("focusout", () => sendPlayerCommand(iframe, "pauseVideo"));
    });

    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const iframe = entry.target.querySelector("iframe");
        sendPlayerCommand(iframe, entry.isIntersecting ? "playVideo" : "pauseVideo");
      });
    },
    { threshold: 0.72 }
  );

  cards.forEach((card) => observer.observe(card));
};

const renderVideos = (videos = []) => {
  grid.innerHTML = "";

  if (!videos.length) {
    emptyState.hidden = false;
    videoCount.textContent = "0 videos";
    return;
  }

  emptyState.hidden = true;
  videoCount.textContent = `${videos.length} video${videos.length === 1 ? "" : "s"}`;

  const cards = videos
    .map((video) => {
      const youtubeId = getYouTubeId(video.youtubeUrl || video.youtubeId || "");
      const title = escapeHtml(video.title || "Poorna Tech Short");
      const promptUrl = escapeHtml(video.promptUrl || "#");
      const watchUrl = escapeHtml(video.youtubeUrl || getYouTubeUrl(youtubeId));
      const isDirectFileOpen = window.location.protocol === "file:";

      if (!youtubeId) {
        return "";
      }

      const videoMedia = isDirectFileOpen
        ? `
          <a class="video-thumbnail" href="${watchUrl}" target="_blank" rel="noreferrer" aria-label="Watch ${title} on YouTube">
            <img
              src="https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg"
              alt="${title}"
              loading="lazy"
            />
            <span>Watch on YouTube</span>
          </a>
        `
        : `
          <iframe
            src="https://www.youtube-nocookie.com/embed/${youtubeId}?enablejsapi=1&mute=1&playsinline=1&rel=0"
            title="${title}"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen>
          </iframe>
        `;

      return `
        <article class="video-card">
          <div class="video-frame">
            ${videoMedia}
          </div>
          <div class="video-content">
            <h3 class="video-title">${title}</h3>
            <a class="prompt-button" href="${promptUrl}" target="_blank" rel="noreferrer">
              PROMPT
            </a>
          </div>
        </article>
      `;
    })
    .join("");

  grid.innerHTML = cards;
  setupAutoplay();
};

const loadVideos = async () => {
  if (!grid || !emptyState || !videoCount) {
    return;
  }

  if (Array.isArray(window.POORNA_TECH_VIDEOS)) {
    renderVideos(window.POORNA_TECH_VIDEOS);
    return;
  }

  try {
    const response = await fetch("data.json", { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Unable to load data.json (${response.status})`);
    }

    const data = await response.json();
    renderVideos(Array.isArray(data.videos) ? data.videos : []);
  } catch (error) {
    console.error(error);
    videoCount.textContent = "Could not load videos";
    emptyState.hidden = false;
    emptyState.querySelector("h2").textContent = "Could not load video data";
    emptyState.querySelector("p").innerHTML =
      "Check that <code>data.js</code> exists in this folder and refresh the page.";
  }
};

loadVideos();
