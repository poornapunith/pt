# Poorna Tech

Poorna Tech shares short-form tech videos with ready-to-use prompt documents.

Visit the website to watch the latest videos and open the matching prompt for each one.

## Website

This project powers the public Poorna Tech prompt library.

The site includes public About, Contact, Guide, FAQ, Resources, Privacy Policy,
Terms, blog, glossary, editorial, and individual prompt guide pages.

## Updating Prompts

Add new video entries in `data.js`.

For AdSense and search visibility, every video should also have an on-site prompt
guide page. After editing `data.js`, run:

```bash
node tools/build-prompt-pages.js
```

That updates the prompt pages and `sitemap.xml`.

## Follow

- YouTube: https://www.youtube.com/@poorna_tech
- Instagram: https://instagram.com/poorna_tech
