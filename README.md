# Tune Detective 2

[![In Development](https://img.shields.io/badge/status-in%20development-yellow)](https://github.com/WhatTheShuck/Tune-Detective-2)
[![PWA Ready](https://img.shields.io/badge/PWA-ready-blue)](https://github.com/WhatTheShuck/Tune-Detective-2)

> The spiritual successor to the beloved music discovery app

## 📖 The Story

### The Beginning

This project is the spiritual successor to **Tune Detective**, created by the talented **n00tavailable**. The original app used the Deezer API to fetch the latest releases from artists, filling a crucial gap for music lovers who don't rely on traditional streaming platforms like Spotify, Apple Music, Deezer, or *insert music streaming service of choice here*.

### The Problem

For those of us who don't use mainstream music streaming services, discovering new releases from our favourite artists can be a real challenge. Tune Detective was the perfect solution — it kept us in the loop without requiring subscriptions to multiple platforms.

### When Everything Changed

But when the world needed him most, GitHub user N00tavailable vanished. A few months passed, and then the Tune Detective app randomly stopped working. Two weeks ago, my father and the men of my tribe...

*Alright, cut the cringe Avatar references!* 😅

### The Revival

I decided to take on the task of recreating the app myself, but this time as a modern web application. This version is built as a Progressive Web App (PWA), which means you can install it on both Android and iOS devices for a near-native experience. The first iteration was a simple prototype to practice my skills in Angular during a university break, as I had a major project that was written with that framework. You can find that history in the commits. I am now working on the second iteration, written in Next.js.

### Plot Twist: The Return! 🎉

In an unexpected turn of events, the legend himself has returned! N00tavailable (now [nooowavailable](https://github.com/nooowavailable)) is back and has released [Tune Detective X](https://github.com/nooowavailable/tunedetectivex) — a shiny new native app packed with cool new features that'll blow your mind.

📱 **Want the full native experience?** Check out [Tune Detective X](https://github.com/nooowavailable/tunedetectivex) for all the latest features!

But hey, if you're a web person or just prefer self-hosting, you're absolutely welcome here! This web version will continue to serve all you lovely web users. 🌐

## ⚠️ Current Status

🙃 The project is still under (semi-)active development — apologies if it breaks occasionally!

With Tune Detective X now available for native app lovers, this web version will focus on providing the best possible browser experience. The PWA should still provide excellent mobile experience across all platforms for those who prefer it.

## ✨ Features

- 🎵 Track latest releases from your favourite artists using the Deezer API
- 📱 Progressive Web App (PWA) - install on Android and iOS for a near-native experience
- 🏠 Self-hostable - keep your data under your control
- ⚛️ Built with modern Next.js
- 🐳 Easy Docker deployment

## 🚀 How to Install - Properly

### Prerequisites
- Docker and Docker Compose installed on your system
- A reverse proxy with HTTPS (recommended: Caddy) for PWA installation and camera access

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/WhatTheShuck/Tune-Detective-2
   cd Tune-Detective-2
   ```

2. **Build the app**
   ```bash
   sudo docker compose build
   ```

3. **Run the app**
   ```bash
   sudo docker compose up -d
   ```

4. **Access the app**
   - Navigate to `http://$YOUR_IP_ADDRESS:7777`
   - For PWA installation and camera access, you'll need HTTPS access
   - I recommend Caddy as an easy reverse proxy, but you can use any reverse proxy you like

## 🛠️ Tech Stack

- ⚛️ **Next.js** - React framework for production
- 📱 **PWA** - Progressive Web App capabilities
- 🎵 **Deezer API** - Music data source
- 🐳 **Docker** - Easy deployment and self-hosting

## 📝 License

This project maintains the spirit of the original Tune Detective while being rebuilt from the ground up.

## 🙏 Acknowledgements

- **n00tavailable/nooowavailable** - For creating the original Tune Detective and the new Tune Detective X
- Deezer - For keeping their API (barely) alive, allowing this project to exist

---
