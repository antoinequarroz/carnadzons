"""Build original editable poster/social vectors and font-independent display copies.

Run with Python + fonttools. No browser, external images or service calls are used.
The optional --output directory receives all standalone editable/display variants.
"""
from pathlib import Path
from copy import deepcopy
import argparse, base64, json, math, re
import xml.etree.ElementTree as ET
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = Path(__file__).resolve().parents[2]
SVG = 'http://www.w3.org/2000/svg'
INK = 'http://www.inkscape.org/namespaces/inkscape'
ET.register_namespace('', SVG)
ET.register_namespace('inkscape', INK)
def tag(name): return f'{{{SVG}}}{name}'
def node(name, attrs=None, **extra):
    return ET.Element(tag(name), {**(attrs or {}), **extra})
def add(parent, name, attrs=None, **extra):
    child = node(name, attrs, **extra); parent.append(child); return child
def layer(root, ident, label):
    return add(root, 'g', {'id': ident, f'{{{INK}}}groupmode': 'layer', f'{{{INK}}}label': label})

font_paths = {
    'Cleopatra': ROOT / 'dist/assets/fonts-v8/cleopatra.ttf',
    'Manrope': ROOT / 'dist/assets/fonts-v15/manrope-variable.ttf',
}
fonts = {name: TTFont(path) for name, path in font_paths.items()}
fonts['Manrope'] = instantiateVariableFont(fonts['Manrope'], {'wght': 500}, inplace=False)
font_data = {}
for name, font in fonts.items():
    font_data[name] = (font.getBestCmap(), font.getGlyphSet(), font['head'].unitsPerEm, font['hmtx'].metrics)

def label(parent, ident, text, x, y, size, family='Manrope', fill='#F9F9F9', max_width=None, spacing=0):
    cmap, glyphset, upem, metrics = font_data[family]
    missing = [c for c in text if ord(c) not in cmap]
    if missing: raise ValueError(f'{family} missing glyphs {missing!r}')
    raw_width = sum(metrics[cmap[ord(c)]][0] for c in text) / upem
    width = raw_width * size + max(0, len(text)-1) * spacing
    if max_width and width > max_width:
        size *= max_width / width; width = max_width
    attrs = {'id': ident, 'x': str(x), 'y': str(y), 'font-family': family,
             'font-size': str(size), 'font-weight': '400' if family == 'Cleopatra' else '500',
             'font-kerning': 'none', 'text-anchor': 'middle', 'fill': fill,
             'data-label': text, 'data-width': f'{width:.3f}'}
    if spacing: attrs['letter-spacing'] = str(spacing)
    child = add(parent, 'text', attrs); child.text = text
    return {'id': ident, 'text': text, 'family': family, 'size': round(size, 3), 'x': x, 'y': y, 'width': round(width, 3)}

def outlined_copy(editable):
    root = deepcopy(editable)
    description = root.find(tag('desc'))
    description.text = description.text.replace('Tous les textes de cette version sont modifiables.',
        'Version de diffusion aux textes vectorisés ; une version avec textes modifiables est fournie séparément.')
    for style in list(root.findall(tag('style'))): root.remove(style)
    for parent in root.iter():
        for original in list(parent):
            if original.tag != tag('text'): continue
            family = original.get('font-family'); text = original.text or ''
            cmap, glyphset, upem, metrics = font_data[family]
            size = float(original.get('font-size')); spacing = float(original.get('letter-spacing', '0'))
            width = float(original.get('data-width')); x = float(original.get('x')) - width/2
            y = float(original.get('y')); scale = size/upem
            group = node('g', {'id': original.get('id'), 'data-label': text, 'fill': original.get('fill'),
                               'aria-label': text, 'transform': f'translate({x:.5f} {y}) scale({scale:.8f} {-scale:.8f})'})
            offset = 0
            for char in text:
                glyph_name = cmap[ord(char)]; pen = SVGPathPen(glyphset); glyphset[glyph_name].draw(pen)
                d = pen.getCommands()
                if d: add(group, 'path', {'d': d, 'transform': f'translate({offset:.5f} 0)'})
                offset += metrics[glyph_name][0] + spacing/scale
            parent[parent.index(original) if hasattr(parent, 'index') else list(parent).index(original)] = group
    return root

def write(root, path):
    ET.indent(root, space='  ')
    ET.ElementTree(root).write(path, encoding='utf-8', xml_declaration=True)

stone = ET.parse(ROOT / 'dist/assets/engraved-stone.svg').getroot()
incisions = next(e for e in stone.iter() if e.get('id') == 'incisions')
art_source = ET.parse(Path(__file__).with_name('temple.svg')).getroot()

variants = {
    'affiche': {'width': 1100, 'height': 1556, 'h': 1556, 'brand': (249, 155), 'theme': (335, 48),
                'top': 112, 'art_top': 405, 'art_height': 670, 'date': (1180, 82), 'venue': 1230,
                'entry': 1272, 'bands_label': 1358, 'bands': 1403, 'site': 1484},
    'publication': {'width': 1080, 'height': 1350, 'h': 1375, 'brand': (210, 149), 'theme': (289, 46),
                    'top': 87, 'art_top': 342, 'art_height': 548, 'date': (985, 78), 'venue': 1036,
                    'entry': 1078, 'bands_label': 1160, 'bands': 1205, 'site': 1297},
    'story': {'width': 1080, 'height': 1920, 'h': 1955.555556, 'brand': (420, 152), 'theme': (507, 48),
              'top': 280, 'art_top': 560, 'art_height': 690, 'date': (1370, 96), 'venue': 1432,
              'entry': 1484, 'bands_label': 1581, 'bands': 1633, 'site': 1685},
}

def build(kind, config):
    height = config['h']; w, h = config['width'], config['height']
    root = node('svg', {'width': str(w), 'height': str(h), 'viewBox': f'0 0 1100 {height}',
                        'version': '1.1', 'role': 'img', 'aria-labelledby': 'poster-title poster-desc'})
    add(root, 'title', {'id': 'poster-title'}).text = 'Carna’dzons 2027 — Au royaume des pharaons'
    add(root, 'desc', {'id': 'poster-desc'}).text = ('Affiche noir et doré du carnaval de Saint-Martin : '
        'Carna’dzons en titre principal, le thème en sous-titre, un temple aux portes ouvertes, '
        'un soleil, des colonnes de signes gravés et de petites vaches dans le fond. 30 janvier 2027, salle de gym de Saint-Martin. '
        'Entrée gratuite, Les Chenegaudes et Les Gugg’Dragons. Tous les textes de cette version sont modifiables.')
    style = add(root, 'style')
    style.text = '\n'.join('@font-face{font-family:'+name+';src:url(data:font/ttf;base64,'+
        base64.b64encode(path.read_bytes()).decode()+") format('truetype');font-weight:"+
        ('400' if name == 'Cleopatra' else '100 900')+';font-style:normal}' for name,path in font_paths.items())
    defs = add(root, 'defs')
    for definition in art_source.find(tag('defs')): defs.append(deepcopy(definition))
    clip = add(defs, 'clipPath', {'id': 'poster-canvas'}); add(clip, 'rect', {'width': '1100', 'height': str(height)})
    for ident, attrs, stops in [
        ('p33-horizontal-veil', {'x1': '0', 'y1': '0', 'x2': '1', 'y2': '0'}, [(0,.15),(.2,.28),(.35,.74),(.65,.74),(.8,.28),(1,.15)]),
        ('p33-vertical-veil', {'x1': '0', 'y1': '0', 'x2': '0', 'y2': '1'}, [(0,.55),(.25,.18),(.5,0),(.75,.18),(1,.65)]),
    ]:
        grad = add(defs, 'linearGradient', {'id': ident, **attrs})
        for position, opacity in stops: add(grad, 'stop', {'offset': str(position), 'stop-color': '#0D1215', 'stop-opacity': str(opacity)})
    background = layer(root, 'fond-grave', '01 · Pierre et hiéroglyphes gravés')
    background.set('clip-path', 'url(#poster-canvas)')
    add(background, 'rect', {'width': '1100', 'height': str(height), 'fill': '#0D1215'})
    for row in range(math.ceil(height/648)):
        for col in range(2):
            tile = add(background, 'g', {'transform': f'translate({col*648-80} {row*648-20}) scale(.9)'})
            for suffix, color, offset, opacity in [('highlight','#34413F','translate(1.2 1.4)', '.6'), ('cut','#070C0F','', '.92')]:
                copy = deepcopy(incisions)
                for child in copy.iter(): child.attrib.pop('id', None)
                copy.set('id', f'glyph-{col}-{row}-{suffix}'); copy.set('stroke', color); copy.set('stroke-width','1.5'); copy.set('opacity',opacity)
                if offset: copy.set('transform',offset)
                tile.append(copy)
    for gradient in ['p33-horizontal-veil', 'p33-vertical-veil']:
        add(background, 'rect', {'width':'1100','height':str(height),'fill':f'url(#{gradient})'})
    frame = layer(root, 'cadre', '02 · Cadre gravé et coins dorés')
    margin = 44 if kind != 'story' else 54
    top, bottom = (44, height-44) if kind != 'story' else (154, height-154)
    add(frame, 'path', {'d':f'M{margin} {top}H{1100-margin}V{bottom}H{margin}Z','fill':'none','stroke':'#2D383A','stroke-width':'1.6'})
    add(frame, 'path', {'d':f'M{margin+1.2} {top+1.4}H{1100-margin+1.2}V{bottom+1.4}H{margin+1.2}Z','fill':'none','stroke':'#060C0F','stroke-width':'1.7'})
    inset=25; length=60
    add(frame, 'path', {'d':f'M{margin+inset} {top+inset+length}V{top+inset}h{length}M{1100-margin-inset-length} {top+inset}h{length}v{length}M{margin+inset} {bottom-inset-length}v{length}h{length}M{1100-margin-inset-length} {bottom-inset}h{length}v-{length}',
        'fill':'none','stroke':'#D4AA62','stroke-width':'1.5'})
    texts=[]
    heading = layer(root, 'titre-principal', '03 · Carna’dzons — titre principal')
    texts.append(label(heading, 'carnaval-local', 'Le carnaval de Saint-Martin', 550, config['top'], 22, max_width=700))
    texts.append(label(heading, 'nom-carnadzons', 'Carna’dzons', 550, *config['brand'], 'Cleopatra', '#FFCB71', 930))
    theme = layer(root, 'sous-titre-theme', '04 · Thème — sous-titre')
    texts.append(label(theme, 'theme-pharaons', 'Au royaume des pharaons', 550, *config['theme'], 'Cleopatra', '#FFCB71', 850))
    line_y=config['theme'][0]+39
    add(theme, 'path', {'d':f'M280 {line_y}H508M592 {line_y}H820m-270-7 7 7-7 7-7-7Z','fill':'none','stroke':'#AA8A50','stroke-width':'1.2'})
    art = layer(root, 'illustration-temple', '05 · Temple et vache gravée')
    scale=config['art_height']/(1077-405); dy=config['art_top']-405*scale
    art.set('transform',f'translate({550*(1-scale)} {dy}) scale({scale})')
    drawing=deepcopy(art_source.find(tag('g')))
    solar=drawing.find(f"{tag('g')}[@id='poster33-solar-disc']")
    rays=node('path', {'fill':'none','stroke':'#D0A45B','stroke-width':'1.25','opacity':'.65'})
    segments=[]
    for index in range(31):
        angle=math.radians(180+index*6); r1=220; r2=244 if index%2==0 else 234
        segments.append(f'M{550+math.cos(angle)*r1:.2f} {655+math.sin(angle)*r1:.2f}L{550+math.cos(angle)*r2:.2f} {655+math.sin(angle)*r2:.2f}')
    rays.set('d',''.join(segments));solar.insert(0,rays);art.append(drawing)
    event = layer(root, 'date-lieu', '06 · Date, lieu et entrée')
    texts.append(label(event, 'date-fete', '30 janvier 2027', 550, *config['date'], 'Cleopatra', '#FFCB71', 900))
    texts.append(label(event, 'lieu-fete', 'Salle de gym de Saint-Martin', 550, config['venue'], 30 if kind=='story' else 27, max_width=850))
    texts.append(label(event, 'entree-libre', 'Entrée gratuite', 550, config['entry'], 24 if kind=='story' else 22, max_width=850))
    bands=layer(root, 'guggens', '07 · Guggens invitées')
    y=config['bands_label']-32
    add(bands,'path',{'d':f'M180 {y}H920','fill':'none','stroke':'#A78A53','stroke-width':'1','opacity':'.55'})
    texts.append(label(bands, 'invitation-guggens', 'Avec les guggens', 550, config['bands_label'], 21, fill='#C6AA78', max_width=800))
    texts.append(label(bands, 'noms-guggens', 'Les Chenegaudes · Les Gugg’Dragons', 550, config['bands'], 29 if kind=='story' else 27, max_width=900))
    footer=layer(root,'signature','08 · Signature')
    texts.append(label(footer,'site-web','carnadzons.ch',550,config['site'],21,fill='#B8BDB9',max_width=800))
    return root,texts

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--output',type=Path,required=True);args=parser.parse_args()
    args.output.mkdir(parents=True,exist_ok=True); manifest={}
    for name,config in variants.items():
        editable,texts=build(name,config)
        display=outlined_copy(editable)
        write(editable,args.output/f'{name}-modifiable.svg')
        write(display,args.output/f'{name}-diffusion.svg')
        manifest[name]={'width':config['width'],'height':config['height'],'labels':texts}
    (args.output/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
    print(json.dumps({'output':str(args.output),'formats':list(manifest)},ensure_ascii=False))

if __name__ == '__main__': main()
