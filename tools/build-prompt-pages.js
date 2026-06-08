const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const dataSource = fs.readFileSync(path.join(root, "data.js"), "utf8");
const sandbox = { window: {} };

vm.createContext(sandbox);
vm.runInContext(dataSource, sandbox);

const videos = sandbox.window.POORNA_TECH_VIDEOS || [];

const slugify = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

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

    if (shortsIndex >= 0 && parts[shortsIndex + 1]) {
      return parts[shortsIndex + 1];
    }
  } catch {
    return "";
  }

  return "";
};

const details = {
  "robo-chick-prompt": {
    category: "Character concept",
    summary:
      "A playful Seedance 2.0 character prompt focused on materials, expression, movement, and a clearly readable robotic creature idea.",
    learn:
      "This page is useful when you want a character to feel designed rather than random. The prompt works because it gives the model a clear subject, a surface treatment, a personality cue, and a small action. Those details help the final video read like a finished concept instead of a loose experiment.",
    customize:
      "Change the creature, metal finish, colour palette, background, camera distance, and the small action. A chick can become a toy robot, a futuristic pet, a tiny mascot, or a product-style animation. Keep the description specific enough that the model understands both the personality and the construction.",
    notes:
      "Avoid copying a copyrighted mascot or an existing animated character. The safer approach is to describe original shapes, materials, and expressions.",
    related: ["ipl-batsman-prompt", "govindaa-prompt", "childhood-profile"]
  },
  "ipl-batsman-prompt": {
    category: "Sports scene",
    summary:
      "A sports video prompt that combines batting action, crowd energy, stadium lighting, and camera timing for a short-form cricket moment.",
    learn:
      "Sports prompts need movement and atmosphere to work together. The action alone is not enough; the crowd, lights, field, camera angle, and celebration timing all make the moment feel alive. This structure helps creators write prompts that show a complete scene rather than only naming a sport.",
    customize:
      "Change the stadium, jersey colours, time of day, shot type, celebration, and crowd density. You can adapt the structure for cricket, football, kabaddi, tennis, or any match-day moment without using a real athlete's likeness.",
    notes:
      "Use fictional players and teams when possible. If you are making fan-style content, keep it clearly transformative and avoid implying official endorsement.",
    related: ["ipl-audience-scene", "metro-station-action-scene", "classroom-action-scene"]
  },
  "bhagavad-gita-image": {
    category: "Spiritual visual",
    summary:
      "An image prompt for ChatGPT or Gemini that focuses on respectful spiritual atmosphere, symbolic composition, lighting, and visual balance.",
    learn:
      "Spiritual and devotional visuals need careful framing. The strongest prompts describe mood, symbolism, art direction, and lighting without turning the subject into a loud or insensitive image. This example is mainly about calm composition and respectful visual language.",
    customize:
      "Change the setting, colour temperature, art medium, background elements, and camera framing. You can make it painterly, cinematic, minimal, poster-like, or book-cover inspired while keeping the tone thoughtful.",
    notes:
      "Treat religious and cultural themes with respect. Avoid shocking, mocking, or misleading representations.",
    related: ["tvk-image", "childhood-profile", "your-name-in-landsat-by-nasa"]
  },
  "dubai-sky-diving": {
    category: "Travel action",
    summary:
      "A Seedance 2.0 travel-action prompt that uses height, skyline, speed, and camera movement to create a dramatic short video idea.",
    learn:
      "Large-scale travel scenes depend on location and motion. This prompt works because the viewer can understand where the subject is, how fast the action feels, and why the shot is exciting. The city skyline becomes part of the story, not just a background.",
    customize:
      "Replace Dubai with another city, mountain range, island, or desert landscape. Change the weather, altitude, lens style, clothing, and emotional tone. A calmer version can feel like a travel film, while a faster one can feel like an action teaser.",
    notes:
      "Keep the prompt cinematic and fictional. Do not present generated footage as real travel footage.",
    related: ["spotted-at-airport", "metro-station-action-scene", "ipl-audience-scene"]
  },
  "ipl-audience-scene": {
    category: "Crowd energy",
    summary:
      "A crowd-focused Seedance 2.0 prompt for capturing stadium emotion, colour, motion, and match-day atmosphere.",
    learn:
      "Crowd prompts can become messy if they only say 'audience cheering'. This example is about giving the model a clear venue, lighting direction, colour accents, camera height, and emotional rhythm so the shot stays readable.",
    customize:
      "Change the event type, crowd size, banners, lighting, camera path, and reaction moment. The same structure works for concerts, festivals, sports matches, creator meetups, or celebration scenes.",
    notes:
      "Avoid real crowd claims. Generated crowd scenes should be treated as creative visuals, not documentary footage.",
    related: ["ipl-batsman-prompt", "dubai-sky-diving", "spotted-at-airport"]
  },
  "devara-cinematic-action-scene": {
    category: "Cinematic scene",
    summary:
      "A cinematic Seedance 2.0 action prompt that reads like shot direction, with setting, mood, movement, lighting, and camera language.",
    learn:
      "Action scenes need visual direction more than intensity words. A good prompt explains who is in the frame, where the action happens, what the camera does, and how the lighting shapes the mood. That keeps the result cinematic rather than chaotic.",
    customize:
      "Change the location, costume, weather, camera distance, and pacing. You can make the same structure rural, urban, historical, futuristic, or festival-themed while staying original.",
    notes:
      "Keep action stylized and non-graphic. Avoid instructions that describe severe injury or realistic harm.",
    related: ["intense-escalator-action-scene", "metro-station-action-scene", "classroom-action-scene"]
  },
  "intense-escalator-action-scene": {
    category: "Camera tension",
    summary:
      "A Seedance 2.0 prompt for a tense moving-location scene using escalator perspective, public-space lighting, and controlled action.",
    learn:
      "Narrow locations naturally create visual pressure. The prompt uses the escalator as a moving frame, so the camera does not need to do everything. This is a useful lesson for building tension with setting, depth, and direction.",
    customize:
      "Move the scene to a mall, airport, metro station, hotel lobby, or office atrium. Change the crowd level, camera angle, speed, clothing, and lighting temperature.",
    notes:
      "Frame the action as cinematic movement rather than real-world dangerous behaviour.",
    related: ["metro-station-action-scene", "devara-cinematic-action-scene", "spotted-at-airport"]
  },
  "childhood-profile": {
    category: "Portrait transformation",
    summary:
      "A profile-style Seedance 2.0 prompt for creating a soft personal transformation or memory-based character scene.",
    learn:
      "Profile prompts work best when they include gentle details: age, face shape, clothing, background, light, and emotional tone. This example is more personal than action-heavy, so small details carry the feeling.",
    customize:
      "Add hobbies, school details, favourite colours, home-town elements, or a specific memory mood. You can make the output nostalgic, documentary-like, warm, funny, or cinematic.",
    notes:
      "Be careful with real children's images and identity details. Use consent and avoid sensitive personal information.",
    related: ["childhood-vs-present-prompt", "bhagavad-gita-image", "govindaa-prompt"]
  },
  "tvk-video": {
    category: "Motion prompt",
    summary:
      "A Seedance 2.0 video prompt example that shows how movement, timing, and camera direction make a topic work as a short video.",
    learn:
      "A video prompt needs more than a still-image description. It should include motion, pacing, continuity, and what changes during the shot. This example is useful for comparing video prompt writing with image prompt writing.",
    customize:
      "Change the gesture, background movement, camera path, shot length, and visual mood. Keep the core idea clear, then build motion around it.",
    notes:
      "Use original wording and avoid suggesting official political, brand, or celebrity endorsement unless you have permission.",
    related: ["tvk-image", "claude-built-this-from-one-prompt", "prompt-library"]
  },
  "tvk-image": {
    category: "Still composition",
    summary:
      "A ChatGPT or Gemini image prompt example that focuses on single-frame composition, pose, lighting, and visual style.",
    learn:
      "Image prompts need strong composition because there is no motion to explain the idea over time. This example is useful for learning how pose, background, framing, and lighting hold attention in one frame.",
    customize:
      "Change the art style, lens, colour palette, outfit, background, and expression. If turning it into a video prompt later, add movement and timing instead of only adding more visual adjectives.",
    notes:
      "For public figures or public movements, keep generated content respectful, clearly creative, and not misleading.",
    related: ["tvk-video", "bhagavad-gita-image", "claude-built-this-from-one-prompt"]
  },
  "govindaa-prompt": {
    category: "Character mood",
    summary:
      "A Seedance 2.0 character prompt focused on expression, outfit, setting, and cultural mood for a short visual moment.",
    learn:
      "Character mood comes from several small choices working together. Expression, clothing, background, camera distance, and colour tone should all point toward the same feeling. This prompt is a good place to study that alignment.",
    customize:
      "Change the environment, mood, costume, lighting, and action. Try writing one calm version, one festive version, and one cinematic version to see how the same structure changes.",
    notes:
      "Use original character descriptions and avoid copying a real person's likeness without consent.",
    related: ["robo-chick-prompt", "childhood-profile", "spotted-at-airport"]
  },
  "spotted-at-airport": {
    category: "Candid scene",
    summary:
      "A Seedance 2.0 public-location prompt using airport details, walking motion, crowd activity, and candid camera language.",
    learn:
      "Believable public scenes need ordinary details. Terminal lights, luggage, signage, crowd movement, and camera distance make the output feel grounded. The prompt works because the scene has a place, a subject, and a reason to move.",
    customize:
      "Move it to a railway station, hotel lobby, event entrance, shopping mall, or street crossing. Change the outfit, luggage, time of day, and camera style.",
    notes:
      "Do not present generated candid footage as real footage of a person. Keep it clearly fictional or creative.",
    related: ["dubai-sky-diving", "metro-station-action-scene", "intense-escalator-action-scene"]
  },
  "metro-station-action-scene": {
    category: "Urban motion",
    summary:
      "A Seedance 2.0 urban-action prompt built around station lighting, movement, crowd flow, and cinematic camera direction.",
    learn:
      "Metro stations are useful because they already have lines, lights, motion, and depth. This prompt teaches how to use a location's natural geometry to guide the scene.",
    customize:
      "Change the station design, crowd density, colour tone, clothing, lens, and movement speed. The same idea can become suspenseful, stylish, comedic, or documentary-like.",
    notes:
      "Keep public safety in mind. Avoid describing dangerous real-world behaviour in a way that encourages imitation.",
    related: ["intense-escalator-action-scene", "spotted-at-airport", "classroom-action-scene"]
  },
  "childhood-vs-present-prompt": {
    category: "Comparison prompt",
    summary:
      "A Seedance 2.0 transformation prompt that compares two time periods while keeping one recognisable identity and emotional thread.",
    learn:
      "Comparison prompts need structure. The viewer should understand what changed, what stayed the same, and why the before-and-after moment matters. This is useful for personal, career, friendship, or creator-growth ideas.",
    customize:
      "Change the two ages, clothing, location, career, confidence level, and visual style. You can make it nostalgic, funny, motivational, or cinematic.",
    notes:
      "Use images and personal details only with consent. Avoid revealing private information.",
    related: ["childhood-profile", "claude-built-this-from-one-prompt", "bhagavad-gita-image"]
  },
  "your-name-in-landsat-by-nasa": {
    category: "Creative resource",
    summary:
      "A public NASA resource that turns a name into a visual experience using satellite imagery, useful for creators and students.",
    learn:
      "Not every useful creative idea is a prompt. This page is included because public tools can become strong short-form content when the result is visual, simple, and easy for viewers to try.",
    customize:
      "Try different names, initials, or words, then use the result as a poster idea, classroom activity, social story, or design inspiration.",
    notes:
      "This link points to an official public NASA experience. Credit the source clearly when sharing results.",
    related: ["bhagavad-gita-image", "resources", "learning-library"]
  },
  "classroom-action-scene": {
    category: "Controlled setting",
    summary:
      "A Seedance 2.0 classroom scene prompt focused on indoor camera direction, body movement, desk layout, and story mood.",
    learn:
      "Smaller spaces need clearer blocking. The classroom, desks, light, expressions, and movement all help the viewer understand the scene. This prompt is useful for writing controlled indoor action without making the scene confusing.",
    customize:
      "Change the classroom style, time of day, camera height, subject movement, background activity, and mood. The same setup can become funny, emotional, suspenseful, or motivational.",
    notes:
      "Keep school-related scenes safe and respectful. Avoid real students' private details.",
    related: ["metro-station-action-scene", "ipl-batsman-prompt", "devara-cinematic-action-scene"]
  },
  "claude-built-this-from-one-prompt": {
    category: "Prompt strategy",
    summary:
      "A workflow example about writing one strong instruction that gives an AI assistant enough context to build a useful result.",
    learn:
      "This example is about prompt quality rather than a single visual scene. A strong instruction explains the goal, audience, output format, constraints, and success criteria. That structure works for websites, scripts, documents, and creative planning.",
    customize:
      "Replace the task, audience, tone, deliverable, and constraints. Before sending a prompt, check whether the assistant knows what good output should look like.",
    notes:
      "Review generated output before publishing. AI can help with structure and speed, but final responsibility stays with the creator.",
    related: ["tvk-video", "childhood-vs-present-prompt", "guide"]
  }
};

const sitePages = {
  guide: "../guide.html",
  resources: "../resources.html",
  "learning-library": "../learning-library.html",
  "prompt-library": "../prompt-library.html"
};

const isImagePrompt = (title) => title.toLowerCase().includes("image");
const isPublicResource = (title) => title.toLowerCase().includes("landsat");

const getToolLabel = (title) => {
  if (isPublicResource(title)) return "Public resource";
  if (isImagePrompt(title)) return "ChatGPT / Gemini";
  if (title.toLowerCase().includes("claude")) return "AI assistant workflow";
  return "Seedance 2.0";
};

const getOutputLabel = (title) => {
  if (isPublicResource(title)) return "Creative tool";
  if (isImagePrompt(title)) return "AI image";
  if (title.toLowerCase().includes("claude")) return "Prompt strategy";
  return "AI video";
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

const buildFallbackDetails = (video, index) => {
  const title = video.title;
  const imagePrompt = isImagePrompt(title);
  const publicResource = isPublicResource(title);
  const tool = getToolLabel(title);
  const output = getOutputLabel(title).toLowerCase();
  const previous = videos[(index - 1 + videos.length) % videos.length];
  const next = videos[(index + 1) % videos.length];

  return {
    category: publicResource
      ? "Creative resource"
      : imagePrompt
        ? "Image prompt"
        : "Video prompt",
    summary: `${title} is a Poorna Tech ${output} resource with an on-site guide, video reference, and linked working prompt document.`,
    learn: imagePrompt
      ? `This prompt is useful for studying how a still image idea is built from subject, framing, lighting, style, and mood. Use the video reference to understand the final visual direction, then study how the prompt describes the composition in a clear and reusable way.`
      : `This prompt is useful for studying how a short AI video idea is built from subject, movement, camera direction, setting, and mood. Use the video reference to understand the final result, then study how the prompt turns that idea into clear creative instructions for ${tool}.`,
    customize: imagePrompt
      ? "Change the subject, background, art style, camera angle, lighting, colour palette, and mood. Keep the main structure of the prompt, but replace the details so the result becomes your own original image."
      : "Change the subject, location, camera movement, time of day, outfit, background activity, and emotional tone. Keep the prompt structure, but replace the details so the final video feels original instead of copied.",
    notes: "Use these prompts as learning references. Review generated results before publishing, avoid misleading claims, and do not copy protected characters, brands, or real-person likenesses without permission.",
    related: [slugify(previous.title), slugify(next.title), "guide"]
  };
};

const pageTemplate = (video, index) => {
  const slug = slugify(video.title);
  const detail = details[slug] || buildFallbackDetails(video, index);
  const title = escapeHtml(video.title);
  const description = escapeHtml(detail.summary);
  const youtubeId = getYouTubeId(video.youtubeUrl);
  const toolLabel = getToolLabel(video.title);
  const outputLabel = getOutputLabel(video.title);
  const promptButton = isPublicResource(video.title) ? "Open resource" : "Open prompt document";
  const promptCopy = getPromptCopy(video);
  const relatedLinks = detail.related
    .map((item) => {
      if (sitePages[item]) {
        return `<a href="${sitePages[item]}">${escapeHtml(item.replaceAll("-", " "))}</a>`;
      }

      const relatedVideo = videos.find((candidate) => slugify(candidate.title) === item);
      return relatedVideo
        ? `<a href="${slugify(relatedVideo.title)}.html">${escapeHtml(relatedVideo.title)}</a>`
        : "";
    })
    .filter(Boolean)
    .join("");
  const prevVideo = videos[(index - 1 + videos.length) % videos.length];
  const nextVideo = videos[(index + 1) % videos.length];

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${description}" />
    <title>${title} - Poorna Tech Prompt Guide</title>
    <link rel="preconnect" href="https://www.youtube.com" />
    <link rel="preconnect" href="https://i.ytimg.com" />
    <script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6570915843086049"
      crossorigin="anonymous">
    </script>
    <link rel="stylesheet" href="../styles.css" />
  </head>
  <body>
    <header class="site-header compact-header">
      <nav class="topbar" aria-label="Main navigation">
        <a class="brand" href="../" aria-label="Poorna Tech home">
          <img src="../Logo.jpeg" alt="Poorna Tech logo" />
          <span>Poorna Tech</span>
        </a>
        <div class="nav-links">
          <a href="../prompt-library.html">Prompts</a>
          <a href="../videos.html">Videos</a>
          <a href="../guide.html">Guide</a>
          <a href="../glossary.html">Glossary</a>
          <a href="../contact.html">Contact</a>
        </div>
      </nav>
    </header>

    <main class="content-page prompt-detail-page">
      <p class="eyebrow">Prompt Guide</p>
      <h1>${title}</h1>
      <p class="lead-text">${description}</p>

      <div class="meta-row">
        <span>${escapeHtml(toolLabel)}</span>
        <span>${escapeHtml(outputLabel)}</span>
        <span>${escapeHtml(detail.category)}</span>
      </div>

      <div class="prompt-detail-layout">
        <div class="prompt-video-panel">
          <a class="video-thumbnail prompt-thumbnail detail-thumbnail" href="../videos.html" aria-label="Open Poorna Tech videos">
            <img
              src="https://i.ytimg.com/vi/${youtubeId}/oardefault.jpg"
              onerror="this.src='https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg'"
              alt="${title}"
              loading="lazy"
            />
            <span class="card-badge">Video thumbnail</span>
          </a>
        </div>

        <article class="prompt-detail-copy">
          <h2>Copy starter prompt</h2>
          <div class="copy-panel">
            <p>${escapeHtml(promptCopy)}</p>
            <button class="prompt-button" type="button" data-copy-prompt data-prompt="${escapeHtml(promptCopy)}">Copy Prompt</button>
          </div>

          <h2>What this prompt teaches</h2>
          <p>${escapeHtml(detail.learn)}</p>

          <h2>How to customize it</h2>
          <p>${escapeHtml(detail.customize)}</p>

          <h2>Publishing note</h2>
          <p>${escapeHtml(detail.notes)}</p>

          <div class="prompt-actions detail-actions">
            <a class="prompt-button" href="${escapeHtml(video.promptUrl)}" target="_blank" rel="noreferrer">${promptButton}</a>
            <a class="prompt-button secondary-button" href="../videos.html">Watch videos</a>
          </div>
        </article>
      </div>

      <section class="content-list related-section" aria-labelledby="related-title">
        <article>
          <h2 id="related-title">Related reading</h2>
          <p>
            These pages are connected by tool type, prompt structure, or creative
            workflow. Use them to compare how different ideas are written.
          </p>
          <div class="related-links">${relatedLinks}</div>
        </article>
      </section>

      <nav class="prompt-page-nav" aria-label="Prompt navigation">
        <a href="${slugify(prevVideo.title)}.html">Previous: ${escapeHtml(prevVideo.title)}</a>
        <a href="../prompt-library.html">All prompts</a>
        <a href="${slugify(nextVideo.title)}.html">Next: ${escapeHtml(nextVideo.title)}</a>
      </nav>
    </main>

    <footer class="site-footer">
      <p>&copy; <span id="year"></span> Poorna Tech.</p>
      <nav class="footer-links" aria-label="Footer navigation">
        <a href="../">Home</a>
        <a href="../prompt-library.html">Prompts</a>
        <a href="../videos.html">Videos</a>
        <a href="../guide.html">Guide</a>
        <a href="../blog.html">Blog</a>
        <a href="../editorial-standards.html">Editorial Standards</a>
        <a href="../publishing-principles.html">Publishing Principles</a>
        <a href="../privacy.html">Privacy Policy</a>
        <a href="../terms.html">Terms</a>
      </nav>
    </footer>

    <script>
      document.querySelector("#year").textContent = new Date().getFullYear();
      document.querySelectorAll("[data-copy-prompt]").forEach((button) => {
        button.addEventListener("click", async () => {
          const originalText = button.textContent;
          try {
            await navigator.clipboard.writeText(button.dataset.prompt || "");
            button.textContent = "Copied";
          } catch {
            button.textContent = "Copy failed";
          }
          window.setTimeout(() => {
            button.textContent = originalText;
          }, 1400);
        });
      });
    </script>
  </body>
</html>
`;
};

const promptDir = path.join(root, "prompts");
fs.mkdirSync(promptDir, { recursive: true });

for (const [index, video] of videos.entries()) {
  const slug = slugify(video.title);

  if (!details[slug]) {
    details[slug] = buildFallbackDetails(video, index);
  }

  fs.writeFileSync(path.join(promptDir, `${slug}.html`), pageTemplate(video, index));
}

const baseUrls = [
  "",
  "videos.html",
  "about.html",
  "prompt-library.html",
  "glossary.html",
  "blog.html",
  "blog/how-to-write-better-ai-prompts.html",
  "blog/ai-image-vs-video-prompts.html",
  "blog/customize-prompts-without-copying.html",
  "editorial-standards.html",
  "publishing-principles.html",
  "contact.html",
  "guide.html",
  "prompt-notes.html",
  "learning-library.html",
  "resources.html",
  "faq.html",
  "privacy.html",
  "terms.html",
  ...videos.map((video) => `prompts/${slugify(video.title)}.html`)
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${baseUrls
  .map(
    (url) => `  <url>
    <loc>https://poornapunith.github.io/${url}</loc>
  </url>`
  )
  .join("\n")}
</urlset>
`;

fs.writeFileSync(path.join(root, "sitemap.xml"), sitemap);

console.log(`Generated ${videos.length} prompt pages and sitemap.xml`);
