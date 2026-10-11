"""
Generate modern high-contrast favicons and app icons for Pradyumna's portfolio.
Uses headless Edge to render crisp SVG to PNG, then Pillow to produce all required sizes and a multi-resolution .ico.
"""
import os
import subprocess
from PIL import Image

SVG_CONTENT = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0f1d" />
      <stop offset="100%" stop-color="#030712" />
    </linearGradient>
    <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    <linearGradient id="glowBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7dd3fc" />
      <stop offset="50%" stop-color="#0ea5e9" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#0ea5e9" flood-opacity="0.35" />
    </filter>
  </defs>

  <!-- Deep Obsidian Container with Glowing Cyan Rim -->
  <rect x="24" y="24" width="464" height="464" rx="112" fill="url(#bgGrad)" stroke="url(#glowBorder)" stroke-width="24" filter="url(#softGlow)" />
  <rect x="36" y="36" width="440" height="440" rx="100" fill="none" stroke="#ffffff" stroke-opacity="0.08" stroke-width="4" />

  <!-- Monogram P Architecture -->
  <!-- Left Pillar / Stem (Solid Crisp White) -->
  <rect x="148" y="128" width="52" height="256" rx="26" fill="#ffffff" />

  <!-- Top-Right Bowl / Loop (Cyan-Sky Gradient with 52px stroke) -->
  <path d="M174 154 H288 C345.438 154 392 200.562 392 258 C392 315.438 345.438 362 288 362 H174" 
        fill="none" 
        stroke="url(#cyanGrad)" 
        stroke-width="52" 
        stroke-linecap="round" 
        stroke-linejoin="round" />

  <!-- Luminous Core Node -->
  <circle cx="288" cy="258" r="28" fill="#38bdf8" />
  <circle cx="288" cy="258" r="14" fill="#ffffff" />
</svg>
"""

OG_IMAGE_HTML = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1200px;
    height: 630px;
    background: #0b0f17;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 72px 84px;
    position: relative;
    overflow: hidden;
  }
  .bg-grid {
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 48px 48px;
  }
  .glow {
    position: absolute;
    top: -100px;
    right: -100px;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, transparent 70%);
    pointer-events: none;
  }
  .content {
    position: relative;
    z-index: 10;
  }
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    border-radius: 8px;
    background: rgba(14, 165, 233, 0.12);
    border: 1px solid rgba(14, 165, 233, 0.3);
    color: #38bdf8;
    font-size: 14px;
    font-family: monospace;
    font-weight: 600;
    margin-bottom: 24px;
  }
  h1 {
    font-size: 64px;
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.1;
    margin-bottom: 16px;
    color: #f8fafc;
  }
  p.subtitle {
    font-size: 24px;
    color: #94a3b8;
    max-width: 820px;
    line-height: 1.45;
  }
  .footer {
    position: relative;
    z-index: 10;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(255,255,255,0.1);
    padding-top: 32px;
  }
  .tags {
    display: flex;
    gap: 12px;
    font-family: monospace;
    font-size: 14px;
    color: #cbd5e1;
  }
  .tag {
    padding: 6px 12px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 6px;
  }
  .url {
    font-family: monospace;
    font-size: 16px;
    color: #38bdf8;
    font-weight: 600;
  }
</style>
</head>
<body>
  <div class="bg-grid"></div>
  <div class="glow"></div>
  <div class="content">
    <div class="badge">B.Tech CSE (AI/ML) &bull; Software &amp; Web Developer</div>
    <h1>Pradyumna</h1>
    <p class="subtitle">First-year engineering student at GL Bajaj ITM building practical web applications, data tools, and systems. World Memory Championship Bronze Medalist.</p>
  </div>
  <div class="footer">
    <div class="tags">
      <div class="tag">React &bull; Next.js &bull; TypeScript</div>
      <div class="tag">Python &bull; FastAPI</div>
      <div class="tag">WMC 2023 Bronze</div>
    </div>
    <div class="url">parthparthu.github.io/me</div>
  </div>
</body>
</html>
"""

def main():
    print("Writing vector SVG favicons...")
    with open("public/favicon.svg", "w", encoding="utf-8") as f:
        f.write(SVG_CONTENT)
    with open("app/icon.svg", "w", encoding="utf-8") as f:
        f.write(SVG_CONTENT)

    # Temporary HTML to rasterize the SVG at 512x512
    svg_html = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body {{ margin: 0; padding: 0; background: transparent; overflow: hidden; }}
  svg {{ display: block; width: 512px; height: 512px; }}
</style>
</head>
<body>
{SVG_CONTENT}
</body>
</html>
"""
    with open("temp_render_icon.html", "w", encoding="utf-8") as f:
        f.write(svg_html)

    with open("temp_render_og.html", "w", encoding="utf-8") as f:
        f.write(OG_IMAGE_HTML)

    edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    icon_html_path = os.path.abspath("temp_render_icon.html")
    og_html_path = os.path.abspath("temp_render_og.html")

    print("Rasterizing 512x512 icon with headless Edge...")
    cmd_icon = [
        edge_path,
        "--headless",
        "--disable-gpu",
        "--hide-scrollbars",
        "--window-size=512,512",
        f"--screenshot={os.path.abspath('public/icon-512.png')}",
        f"file:///{icon_html_path.replace(os.sep, '/')}"
    ]
    subprocess.run(cmd_icon, check=True)

    print("Rasterizing 1200x630 OG image card with headless Edge...")
    cmd_og = [
        edge_path,
        "--headless",
        "--disable-gpu",
        "--hide-scrollbars",
        "--window-size=1200,630",
        f"--screenshot={os.path.abspath('public/og-image.png')}",
        f"file:///{og_html_path.replace(os.sep, '/')}"
    ]
    subprocess.run(cmd_og, check=True)

    # Clean up temp html
    if os.path.exists("temp_render_icon.html"):
        os.remove("temp_render_icon.html")
    if os.path.exists("temp_render_og.html"):
        os.remove("temp_render_og.html")

    print("Generating resized icon variants and multi-resolution ICO...")
    base_img = Image.open("public/icon-512.png").convert("RGBA")

    # 192x192
    img_192 = base_img.resize((192, 192), Image.Resampling.LANCZOS)
    img_192.save("public/icon-192.png", "PNG")

    # 180x180 Apple Touch Icon
    img_180 = base_img.resize((180, 180), Image.Resampling.LANCZOS)
    img_180.save("public/apple-touch-icon.png", "PNG")

    # Multi-size ICO: 16x16, 32x32, 48x48
    base_img.save("public/favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])

    print("All favicon assets successfully generated:")
    for path in [
        "public/favicon.svg",
        "app/icon.svg",
        "public/favicon.ico",
        "public/icon-192.png",
        "public/icon-512.png",
        "public/apple-touch-icon.png",
        "public/og-image.png"
    ]:
        size = os.path.getsize(path)
        print(f"  {path}: {size} bytes")

if __name__ == "__main__":
    main()
