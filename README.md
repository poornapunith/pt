# Poorna Tech Prompts Website

Static website for displaying a grid of short-form videos with a `PROMPT` button under each video.

## Add a new video

Edit `data.js` and add one object inside `window.POORNA_TECH_VIDEOS`:

```js
window.POORNA_TECH_VIDEOS = [
  {
    title: "Your Short Title",
    youtubeUrl: "https://www.youtube.com/shorts/YOUTUBE_SHORT_ID",
    promptUrl: "https://docs.google.com/document/d/YOUR_DOC_ID/edit"
  }
];
```

You can also use a normal YouTube watch URL, a `youtu.be` URL, or just the 11-character YouTube video ID.

## Test locally

Open `index.html` directly in your browser. Direct file opening shows YouTube thumbnails to avoid local YouTube embed errors. GitHub Pages and local servers show embedded players.

## Publish with GitHub Pages

Push these files to your GitHub repository, then enable GitHub Pages for the repository branch that contains `index.html`.
