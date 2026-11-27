# Yoga Instruments 1.4

A calm, offline app with nine instruments used in yoga and meditation, for Windows and any modern browser. Browse them with `<` and `>`, play them by clicking or tapping, or let them keep playing by themselves. Every sound is synthesized live with the Web Audio API, so there are no audio files and the app needs no internet.

**▶ Play it in your browser: https://rpg86x.github.io/yoga-instruments/**

![Yoga Instruments](logo.png)

## Phone or tablet?

One app for phones and tablets: the same APK installs on both and adapts to the screen by itself.

- **Phone:** one instrument per screen, swipe with ‹ ›; everything fits without scrolling.
- **Tablet:** the same app, larger - nice as a session instrument next to your mat.


## Instruments

| # | Instrument | Used for |
|---|------------|----------|
| 1 | Gong | Gong bath, savasana |
| 2 | Tingsha | Opening and closing a session |
| 3 | Koshi chime | Relaxation |
| 4 | Shruti box | Drone under mantra and chanting |
| 5 | Tanpura | Drone for meditation |
| 6 | Ocean drum | Savasana |
| 7 | Rainstick | Grounding |
| 8 | Kalimba | Light, playful melodies |
| 9 | Frame drum | A steady, grounding pulse |

Looking for singing bowls or a handpan? They have their own apps: [Singing Bowls](https://github.com/rpg86x/singing-bowls) and [Handpan](https://github.com/rpg86x/handpan).

## Controls

| Key | Action |
|-----|--------|
| `<` `>` / `,` `.` / `←` `→` | Previous / next instrument |
| `1`–`9` | Jump to an instrument |
| `Space` or click / tap the instrument | Play (where you click shapes the sound) |
| `W` | Keep playing: wind in the chimes, a heartbeat on the drum, waves on the ocean drum |
| `S` | Silence |

Volume and reverb sliders are at the bottom of the window. The app remembers your settings.

## Languages

English (default) and Dutch, plus German, French and Spanish. Pick another language in the menu at the top right. On first start the app uses your system language if it's available.

## Install (Windows)

1. Download this repository (**Code → Download ZIP**) and unzip it.
2. Double-click `launch.vbs`. The app opens in its own Microsoft Edge window.

You can also open `index.html` in any modern browser, including on a phone or tablet.

To get a desktop shortcut: right-click `launch.vbs` → **Send to → Desktop (create shortcut)**, then set `icon.ico` as the icon in the shortcut's properties.

## Support

If you enjoy the instruments, you can [buy me a coffee ☕](https://urbantechmonk.gumroad.com/coffee).

---

## Nederlands

Een rustige app met negen yoga- en meditatie-instrumenten die zonder internet werkt. Met `<` en `>` blader je door de instrumenten. Je bespeelt ze door te klikken of te tikken, of je laat ze vanzelf doorspelen met `W`. Alle klanken worden live opgewekt. Start de app door te dubbelklikken op `launch.vbs`. De taal kies je rechtsboven.

## License

MIT, see [LICENSE](LICENSE).


## What's new in 1.2

- **Kalimba with 17 tines** (C4–E6, the common 17-key layout: lowest note in the middle, alternating left and right).
- **Practice songs from [Song Library](https://github.com/rpg86x/song-library):** on the kalimba, pick a song and press **▶ Listen** or **🎯 Practice**. In practice mode the tine to tap glows **red** (the next one light red) and mistakes are counted. 132 of the 133 songs fit the kalimba.
- Song Library can open a song here directly: `index.html?song=<id>&mode=practice|listen`.
- **Android app** (`android/build.ps1`), so Song Library can open the kalimba on a tablet. Keep `songs.js` next to `index.html`.

## What's new in 1.3

- The kalimba gets the new songs from Song Library 1.6 (143 songs), including the calm **Icaro style (Amazon)** series.

## What's new in 1.4

- **Clean sound on Android:** some Android phones crackled because the WebView ran out of audio buffer. On Android the app now uses a larger audio buffer, a shorter reverb tail and schedules notes 20 ms ahead. Desktop is unchanged.
