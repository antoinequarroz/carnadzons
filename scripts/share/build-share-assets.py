"""Image d'aperçu au partage (1200×630) et icônes du site.

Requiert Pillow, et macOS (Quick Look) pour faire le rendu du temple de l'affiche :
    python3 scripts/share/build-share-assets.py
Produit dans dist/ : assets/partage-2027.jpg, favicon.ico, favicon-32.png,
apple-touch-icon.png, icon-192.png, icon-512.png (favicon.svg est dessiné à la main).
"""
import pathlib, re, subprocess, tempfile
from PIL import Image, ImageDraw, ImageFont

root = pathlib.Path(__file__).resolve().parents[2]
dist = root / 'dist'
INK, GOLD, WHITE, MUTED = '#0D1215', '#FFCB71', '#F9F9F9', '#B1B3B2'
cleo = str(dist / 'assets/fonts-v8/cleopatra.ttf')
manrope = str(dist / 'assets/fonts-v15/manrope-variable.ttf')

def manrope_font(size, weight):
    f = ImageFont.truetype(manrope, size)
    f.set_variation_by_axes([weight])
    return f

def render_svg(svg_text, size):
    with tempfile.TemporaryDirectory() as tmp:
        src = pathlib.Path(tmp) / 'source.svg'
        src.write_text(svg_text)
        subprocess.run(['qlmanage', '-t', '-s', str(size), '-o', tmp, str(src)], check=True, capture_output=True)
        return Image.open(pathlib.Path(tmp) / 'source.svg.png').convert('RGB')

# 1. Le temple de l'affiche, rendu en grand puis recadré.
poster = (dist / 'assets/affiche-egypte-2027.svg').read_text()
tag = re.search(r'<svg[^>]*>', poster).group(0)
square = re.sub(r'viewBox="[^"]*"', 'viewBox="-228 0 1556 1556"', tag)
square = re.sub(r'\swidth="[^"]*"', ' width="1556"', square)
square = re.sub(r'\sheight="[^"]*"', ' height="1556"', square)
full = render_svg(poster.replace(tag, square, 1), 2400)
k = 2400 / 1556
temple = full.crop((round((228 + 120) * k), round(395 * k), round((228 + 980) * k), round(1065 * k)))

# 2. Carte de partage 1200×630.
card = Image.new('RGB', (1200, 630), INK)
t = temple.resize((round(temple.width * 480 / temple.height), 480), Image.LANCZOS)
tx = 1200 - t.width - 60
card.paste(t, (tx, 92))
d = ImageDraw.Draw(card)
for x0, y0, dx, dy in ((40, 40, 1, 1), (1160, 40, -1, 1), (40, 590, 1, -1), (1160, 590, -1, -1)):
    d.line([(x0, y0 + 46 * dy), (x0, y0), (x0 + 46 * dx, y0)], fill=GOLD, width=2)
x = 88
d.text((x, 120), 'Le carnaval de Saint-Martin', font=manrope_font(26, 500), fill=WHITE)
size = 100
while ImageDraw.Draw(card).textlength('Carna’dzons', font=ImageFont.truetype(cleo, size)) > tx - x - 30:
    size -= 2
d.text((x, 160 + (100 - size) // 2), 'Carna’dzons', font=ImageFont.truetype(cleo, size), fill=GOLD)
d.text((x, 285), 'Une nuit en Égypte', font=ImageFont.truetype(cleo, 36), fill=GOLD)
d.line([(x, 372), (x + 90, 372)], fill=GOLD, width=2)
d.text((x, 400), 'Samedi 30 janvier 2027', font=manrope_font(32, 600), fill=WHITE)
d.text((x, 448), 'Salle de gym de Saint-Martin (VS)', font=manrope_font(25, 400), fill=MUTED)
d.text((x, 486), 'Entrée gratuite', font=manrope_font(25, 400), fill=MUTED)
card.save(dist / 'assets/partage-2027.jpg', quality=86, optimize=True, progressive=True)

# 3. Icônes : rendu du favicon.svg dessiné à la main.
icon = render_svg((dist / 'favicon.svg').read_text(), 1024)
for size, name in ((32, 'favicon-32.png'), (180, 'apple-touch-icon.png'), (192, 'icon-192.png'), (512, 'icon-512.png')):
    icon.resize((size, size), Image.LANCZOS).save(dist / name, optimize=True)
icon.resize((48, 48), Image.LANCZOS).save(dist / 'favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)])
print('Aperçu de partage et icônes générés.')
