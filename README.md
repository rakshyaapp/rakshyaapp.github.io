# Rakshyaa App Landing Page 🛡️

The official landing page for **Rakshyaa**, hosted at [rakshyaapp.github.io](https://rakshyaapp.github.io). Rakshyaa is a global personal safety app that combines an SOS countdown, live location tracking, and encrypted evidence capture. This site is the central hub for users to learn about the app, watch the demo, and get it on Google Play.

## 🚀 Features

- **Smart SOS** — A cancellable countdown that prepares an SMS with your location and a call for your trusted contacts, which you send yourself.
- **Evidence Recording** — Record video that is encrypted on-device, with optional encrypted cloud backup.
- **Live Tracking** — Foreground and background GPS with a private, encrypted location history.
- **Ride Monitoring** — Alerts you when your route moves more than 300 m away from where you have been.
- **Check-in System** — Scheduled check-ins that remind you to message your contacts if you miss one.
- **Emergency Contacts** — An encrypted list of trusted people, ready for SOS messages and calls.
- **Safe Places** — Discovers nearby hospitals, police stations, and fire stations in a crisis.
- **Legal Help** — Quick access to legal resources and support contacts when you need them.
- **Fake Call** — Simulates an incoming call to discreetly escape uncomfortable situations.

## 🔐 Privacy by Architecture

Rakshyaa encrypts contacts, location history, and videos on-device with **AES-256-GCM**, with keys stored in the **Android Keystore**:

1. **Encrypt on device** — Sensitive data is encrypted with AES-256-GCM using keys held in the Android Keystore.
2. **Back up only ciphertext** — Optional backups upload only encrypted files. Account profiles and SOS incident reports are stored readably so they can be used.
3. **Secure cloud** — A **Cloudflare Workers + D1** backend, with encrypted files stored privately on **Cloudinary**. See the [Privacy Policy](https://rakshyaapp.github.io/privacy-policy.html).

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Hosting:** GitHub Pages
- **App Backend:** Cloudflare Workers (Hono, TypeScript), Cloudflare D1, Cloudinary
- **App Security:** AES-256-GCM on-device encryption, Android Keystore

## 📂 Project Structure

```text
├── index.html     # Main entry point (hero, features, demo, roadmap, blog, Q/A)
├── blog.html      # Redirects to /#blog (legacy URLs)
├── privacy-policy.html  # Privacy Policy page
├── data-policy.html     # Data Policy page
├── styles.css     # UI styling (includes blog + Q/A styles)
├── script.js      # Frontend logic
├── demo.mp4       # Video demonstration of the app (chapters are timestamped in index.html)
├── assets/screens/  # App screenshots captured from demo.mp4
├── favicon.png    # Site icon
├── previewcard.png# Social sharing preview image
├── robots.txt     # Search engine crawling rules
├── sitemap.xml    # Site map for SEO
├── googlea5b6745752877e72.html  # Google site verification
├── google0223efe922a66e9d.html  # Google site verification (Cloud project owner)
├── .gitignore     # Git ignore rules
└── LICENSE        # MIT License
```

## 📥 How to Install (For Users)

Install Rakshyaa from [Google Play](https://play.google.com/store/apps/details?id=com.rakshyaa.rakshyaa). Rakshyaa is Android-only.

## 🗺️ Roadmap

| Version | Status  | Scope                                             |
| ------- | ------- | ------------------------------------------------- |
| v1.2        | **Live** | All safety tools, Google sign-in, encrypted backup |
| Google Play | Next     | Public release on the Google Play Store |
| Reliability | Planned  | Restart-safe check-in timers; retries for incident reports and video backups |

## 🤝 Contributing

This repository is specifically for the landing page. If you'd like to contribute to the UI/UX of the website:

1. Fork the repo.
2. Create a new branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.