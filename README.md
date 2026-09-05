# Rakshya App Landing Page 🛡️

The official landing page for **Rakshya**, hosted at [rakshyaapp.github.io](https://rakshyaapp.github.io). Rakshya is a global personal safety app that combines SOS alerts, voice triggers, live location tracking, and encrypted emergency response. This site is the central hub for users to learn about the app, watch the demo, and download the latest Android release.

## 🚀 Features

- **Smart SOS** — Launches a synchronized emergency workflow in one tap for immediate response.
- **Voice AI** — Detects hidden distress phrases and triggers protective actions discreetly.
- **Evidence Recording** — Captures audio and video automatically to preserve a secure incident trail.
- **Live Tracking** — Foreground and background GPS updates stream location with continuity.
- **Ride Monitoring** — Tracks route deviation and trip risks in real time for safer travel.
- **Check-in System** — Scheduled safety check-ins reduce uncertainty and notify contacts automatically.
- **Emergency Contacts** — An encrypted list of trusted people notified instantly during an incident.
- **Safe Places** — Discovers nearby hospitals, police stations, and fire stations in a crisis.
- **Legal Help** — Quick access to legal resources and support contacts when you need them.
- **Fake Call** — Simulates an incoming call to discreetly escape uncomfortable situations.

## 🔐 Privacy by Architecture

Rakshya encrypts all sensitive data on-device with **AES-256-GCM**, with keys stored in the **Android Keystore**. The backend stores only opaque encrypted blobs and never sees plaintext:

1. **Encrypt on device** — Sensitive data is encrypted with AES-256-GCM using keys held in the Android Keystore.
2. **Send only blobs** — Only opaque encrypted blobs travel to the server, never readable plaintext.
3. **Own your backend** — A self-hosted **Node.js + Express + SQLite** backend you control stores the encrypted bytes for backup and sync.

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Hosting:** GitHub Pages
- **App Backend:** Node.js, Express, SQLite (self-hosted)
- **App Security:** AES-256-GCM on-device encryption, Android Keystore

## 📂 Project Structure

```text
├── index.html     # Main entry point (hero, features, demo, roadmap, blog, Q/A)
├── blog.html      # Redirects to /#blog (legacy URLs)
├── styles.css     # UI styling (includes blog + Q/A styles)
├── script.js      # Frontend logic
├── demo.mp4       # Video demonstration of the app
├── favicon.png    # Site icon
├── previewcard.png# Social sharing preview image
├── robots.txt     # Search engine crawling rules
├── sitemap.xml    # Site map for SEO
├── googlea5b6745752877e72.html  # Google site verification
├── .gitignore     # Git ignore rules
└── LICENSE        # MIT License
```

## 📥 How to Install (For Users)

1. Navigate to the **[Releases](https://github.com/rakshyaapp/rakshyaapp.github.io/releases)** section.
2. Download the latest `.apk` file (currently **v1.1.0**).
3. On your Android device, enable "Install from Unknown Sources" in settings.
4. Open the file and follow the installation prompts.

> iOS support is coming soon.

## 🗺️ Roadmap

| Version | Status  | Scope                                             |
| ------- | ------- | ------------------------------------------------- |
| v1.1    | **Live**  | Google sign-in, self-hosted backend, on-device encryption |
| v1.2    | Next    | Restore SOS screen and live location tracking        |
| v1.3    | Planned | Restore ride monitoring and safety check-ins         |
| v1.4    | Planned | Restore emergency contacts and encrypted video capture |
| v1.5    | Planned | Restore safe places, legal help, and fake call       |
| v2.0    | Planned | Production hardening, release signing, Play Store     |

## 🤝 Contributing

This repository is specifically for the landing page. If you'd like to contribute to the UI/UX of the website:

1. Fork the repo.
2. Create a new branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.