# Curated Seoul — 3D skincare boutique

Run `npm install`, then `npm run dev` (http://127.0.0.1:5174). `npm run build` checks TypeScript and builds production files; `npm test` verifies navigation boundaries and source catalog facts.

React + TypeScript + Vite, Three.js / React Three Fiber / Drei. No backend, product API or payment gateway is configured. Product entries are locally curated references to supplied Drive photos. Prices, stock, sizes and ingredients are deliberately unset. A shortlist is local UI state, not an order.

Use W/A/S/D or arrow buttons to walk, drag empty floor to look around, click a product to inspect it. Department buttons move to safe viewing points. The overview button shows the complete boutique. Eye button hides/restores panels.

Brand guide: https://drive.google.com/file/d/1GMug_1zQ0LdAkI-hE_4aj9_YbPcDuC89/view
Brand assets: https://drive.google.com/drive/folders/1QkAi_FbGnyaI63JjCjX6a-E6EhMw2Iz2
Product photography: https://drive.google.com/drive/folders/1hwQS8WuSFTkE37d8Wgs4w83w2ixdZulJ

See DESIGN.md for colour decisions and temporary Thai font fallback. public/assets/sources.json records the original Drive URL for each used asset. `.assets-original` and `.qa` are local-only source/inspection folders. Do not put raw design files, signed download URLs or Drive credentials in the client.
