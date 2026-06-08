const grid = document.querySelector("#video-grid");
const emptyState = document.querySelector("#empty-state");
const videoCount = document.querySelector("#video-count");
const year = document.querySelector("#year");
const pageMode = document.body.dataset.page || "prompts";

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

const isImagePrompt = (title = "") => title.toLowerCase().includes("image");
const isPublicResource = (title = "") => title.toLowerCase().includes("landsat");

const getToolLabel = (title = "") => {
  if (isPublicResource(title)) return "Public Resource";
  if (isImagePrompt(title)) return "ChatGPT / Gemini";
  if (title.toLowerCase().includes("claude")) return "AI Workflow";
  return "Seedance 2.0";
};

const getCategoryLabel = (title = "") => {
  const lowerTitle = title.toLowerCase();

  if (isPublicResource(title)) return "Resource";
  if (isImagePrompt(title)) return "Image";
  if (lowerTitle.includes("action")) return "Action";
  if (lowerTitle.includes("sky") || lowerTitle.includes("airport") || lowerTitle.includes("ride")) return "Travel";
  if (lowerTitle.includes("ipl") || lowerTitle.includes("batsman")) return "Sports";
  if (lowerTitle.includes("gita") || lowerTitle.includes("govind") || lowerTitle.includes("tvk")) return "Concept";
  if (lowerTitle.includes("claude")) return "Workflow";

  return "Video";
};

const getPromptCopy = (video = {}) => {
  if (video.promptText || video.copyPrompt || video.promptPreview) {
    return video.promptText || video.copyPrompt || video.promptPreview;
  }

  const title = video.title || "Poorna Tech prompt";
  const tool = getToolLabel(title);
  const outputType = isImagePrompt(title) ? "an image" : "a short AI video";

  return `Create ${outputType} inspired by "${title}". Use ${tool}. Focus on a clear subject, strong visual composition, cinematic lighting, realistic detail, and a polished vertical 9:16 social-media result. Customize the subject, setting, colors, camera angle, and mood to make the final output original.`;
};

const slugify = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const copyPrompt = async (button) => {
  const prompt = button.dataset.prompt || "";
  const originalText = button.textContent;

  try {
    await navigator.clipboard.writeText(prompt);
    button.textContent = "Copied";
    window.setTimeout(() => {
      button.textContent = originalText;
    }, 1400);
  } catch {
    button.textContent = "Copy failed";
    window.setTimeout(() => {
      button.textContent = originalText;
    }, 1400);
  }
};

const setupCopyButtons = () => {
  document.querySelectorAll("[data-copy-prompt]").forEach((button) => {
    button.addEventListener("click", () => copyPrompt(button));
  });
};

const renderVideos = (videos = []) => {
  grid.innerHTML = "";

  if (!videos.length) {
    emptyState.hidden = false;
    videoCount.textContent = "0 videos";
    return;
  }

  emptyState.hidden = true;
  const itemLabel = pageMode === "videos" ? "video" : "prompt";
  videoCount.textContent = `${videos.length} ${itemLabel}${videos.length === 1 ? "" : "s"}`;

  const cards = videos
    .map((video) => {
      const youtubeId = getYouTubeId(video.youtubeUrl || video.youtubeId || "");
      const title = escapeHtml(video.title || "Poorna Tech Short");
      const promptUrl = escapeHtml(video.promptUrl || "#");
      const watchUrl = escapeHtml(video.youtubeUrl || getYouTubeUrl(youtubeId));
      const guideUrl = `prompts/${slugify(video.title || youtubeId)}.html`;
      const category = escapeHtml(video.category || getCategoryLabel(video.title || ""));
      const tool = escapeHtml(video.tool || getToolLabel(video.title || ""));
      const promptCopy = escapeHtml(getPromptCopy(video));

      if (!youtubeId) {
        return "";
      }

      if (pageMode === "videos") {
        return `
          <article class="video-card embed-card">
            <div class="video-frame">
              <iframe
                src="https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0"
                title="${title}"
                loading="lazy"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen>
              </iframe>
            </div>
            <div class="video-content">
              <div class="meta-row compact-meta"><span>${category}</span><span>${tool}</span></div>
              <h3 class="video-title">${title}</h3>
              <div class="prompt-actions">
                <a class="prompt-button" href="${guideUrl}">Prompt Guide</a>
                <a class="prompt-button secondary-button" href="${watchUrl}" target="_blank" rel="noreferrer">Open YouTube</a>
              </div>
            </div>
          </article>
        `;
      }

      return `
        <article class="video-card prompt-card">
          <a class="video-thumbnail prompt-thumbnail" href="${guideUrl}" aria-label="Open ${title} prompt guide">
            <img
              src="https://i.ytimg.com/vi/${youtubeId}/oardefault.jpg"
              onerror="this.src='https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg'"
              alt="${title}"
              loading="lazy"
            />
            <span class="card-badge">${category}</span>
          </a>
          <div class="video-content">
            <div class="meta-row compact-meta"><span>${tool}</span></div>
            <h3 class="video-title">${title}</h3>
            <p class="prompt-preview">${promptCopy}</p>
            <div class="prompt-actions">
              <button class="prompt-button" type="button" data-copy-prompt data-prompt="${promptCopy}">
                Copy Prompt
              </button>
              <a class="prompt-button secondary-button" href="${guideUrl}">
                View Details
              </a>
              <a class="text-link" href="${promptUrl}" target="_blank" rel="noreferrer">
                Prompt Doc
              </a>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  grid.innerHTML = cards;
  setupCopyButtons();
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
