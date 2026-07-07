# Module 9 — Videos section

## Run
npm install
npm run dev
open http://localhost:3000/videos

## What's in here
- app/videos/page.tsx        Video Listing + Trending + Latest
- app/videos/[slug]/page.tsx Video Details + Embedded Player
- components/videos/         VideoCard, VideoPlayer, SectionHeader, VideoFilters
- lib/videos-data.ts         Mock data + helpers (swap for real API/DB later)

## Product notes
- Trending vs Latest are separate ranking functions, not the same list re-sorted
  in the UI — trending should eventually be driven by real analytics (views in
  the last N days), latest by publish date. Keeping them as separate data
  functions now avoids a UI hack later.
- VideoPlayer uses a click-to-load facade instead of an always-on iframe so the
  details page doesn't pay YouTube's embed script cost before the user asks for it.
- Card component has 3 variants (grid, rail, row) so the same tile logic powers
  the listing grid, a horizontal rail, and the compact sidebar list without
  duplicating markup.
