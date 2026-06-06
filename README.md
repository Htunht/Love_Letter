# 🎀 OK-ArBwar — Patisserie Love Letter

> *A bespoke digital sweetbox — craft a beautiful love letter, seal it with photos, and share it as a unique link.*

[![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

---

## ✨ What Is This?

**OK-ArBwar** is a romantic web experience styled as a luxury *Patisserie* sweet box. You compose a heartfelt letter, upload up to 3 cherished photos, and the app "bakes" it into a shareable link. When someone opens the link, they see an interactive gift box — they tap it open to reveal an animated typewriter letter and photo memories inside, accompanied by confetti balloons and sparkling effects.

---

## 🌟 Features

| Feature | Description |
|---|---|
| 🎁 **Interactive Gift Box** | A beautifully animated sweet box that the recipient taps open |
| ✍️ **Typewriter Animation** | The love letter types itself out character by character |
| 📸 **3-Photo Memory Strip** | Upload up to 3 precious photos that appear inside the box |
| 🍒 **Particle Effects** | Click sparkles, balloon confetti, and pop-on-click animations |
| 🔗 **Unique Shareable Link** | Every letter gets a unique URL powered by Supabase |
| 🎀 **Animated Baking Loader** | A playful progress bar with status messages while your letter is being "baked" |
| 📋 **One-Click Copy Link** | Share link is auto-copied to clipboard on submission |

---

## 🛠️ Tech Stack

- **Frontend** — Vanilla HTML, CSS, JavaScript
- **Styling** — Custom CSS + [Tailwind CSS CDN](https://tailwindcss.com) for utilities
- **Fonts** — [Syne](https://fonts.google.com/specimen/Syne) (headers) · [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) (body)
- **Backend / Database** — [Supabase](https://supabase.com) (Postgres + Storage)
  - `letters` table — stores recipient name, message lines, and photo URLs
  - `letterPhotoes` storage bucket — stores uploaded images

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/ok-arbwar.git
cd ok-arbwar
```

### 2. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com).
2. Create a table called **`letters`** with the following schema:

```sql
create table letters (
  id   uuid primary key default gen_random_uuid(),
  title    text,
  lines    jsonb,
  photo_1  text,
  photo_2  text,
  photo_3  text,
  created_at timestamptz default now()
);
```

3. Create a **Storage bucket** named `letterPhotoes` and set it to **public**.

4. Enable **Row Level Security (RLS)** policies as needed (e.g., allow inserts from anon).

### 3. Configure environment

Update the Supabase credentials directly in `script.js` (lines 1–4):

```js
const supabaseClient = supabase.createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_SUPABASE_ANON_KEY'
);
```

> **Note:** For production, move secrets to a server-side environment and never expose them in client code.

### 4. Run locally

Since this is a static site, simply open `index.html` in your browser, or use a local dev server:

```bash
# Using VS Code Live Server, or:
npx serve .
```

---

## 📂 Project Structure

```
ok-arbwar/
├── index.html      # Main app — both editor and viewer view
├── style.css       # All custom styles, animations & design tokens
├── script.js       # App logic: viewer, editor, Supabase integration
├── .env            # Local env variables (do NOT commit to GitHub)
├── .gitignore      # Ignores .env and other sensitive files
└── supabase/       # Supabase config / migration files
```

---

## 🔒 Security Notice

> [!WARNING]
> The Supabase **anon (publishable) key** in `script.js` is a client-side key — it is intentionally public but should only have the minimum required permissions. Make sure your **Supabase Row Level Security (RLS)** policies are properly configured to prevent unauthorized data access or deletion.
>
> **Never commit your secret service-role key to a public repo.**

---

## 🎨 Design Highlights

- **Color palette** — Deep berry (`#2D0010`), vibrant pink (`#FF0055`), blush (`#FFB3D1`), frosting white
- **Glassmorphism** cards with soft shadows and backdrop blur
- **Micro-animations** — heartBurst particles, floating sticker SVGs, balloon pop effects
- **Receipt-ticket aesthetic** — zigzag dividers and monospace fonts for a patisserie receipt feel

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

<div align="center">
  Made with 💖 and a lot of sweetness
</div>
