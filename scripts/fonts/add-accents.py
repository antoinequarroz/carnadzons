"""Ajoute de vrais accents à la police Cleopatra.

La police d'origine (scripts/fonts/cleopatra-original.ttf) associe É, è, ç…
à la lettre nue : les accents disparaissent dans les titres. Ce script dessine
des accents dans le style de la police (biseaux, points carrés de la ponctuation),
compose chaque lettre accentuée à partir de sa lettre de base et recopie le
crénage de la base, pour que les titres gardent exactement la même mise en page.

Usage : python3 scripts/fonts/add-accents.py   (requiert fonttools)
"""
import copy, math, pathlib
from fontTools.ttLib import TTFont
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib.tables._g_l_y_f import GlyphComponent
from fontTools.ttLib.tables.otTables import PairValueRecord

here = pathlib.Path(__file__).resolve().parent
src = here / 'cleopatra-original.ttf'
out = here.parent.parent / 'dist/assets/fonts-v8/cleopatra.ttf'
f = TTFont(src)
glyf, hmtx, cmap = f['glyf'], f['hmtx'], f.getBestCmap()
gs = f.getGlyphSet()
order = f.getGlyphOrder()

BASE = 748  # bas des accents (capitale = 700)

def area(pts):
    return sum(x0 * y1 - x1 * y0 for (x0, y0), (x1, y1) in zip(pts, pts[1:] + pts[:1])) / 2

def poly(pen, pts, outer=True):
    # TrueType : contour extérieur dans le sens horaire (aire négative).
    if (area(pts) < 0) != outer:
        pts = pts[::-1]
    pen.moveTo(pts[0])
    for p in pts[1:]:
        pen.lineTo(p)
    pen.closePath()

def arc(cx, cy, r, a0, a1, n=10):
    return [(round(cx + r * math.cos(math.radians(a0 + (a1 - a0) * i / n))),
             round(cy + r * math.sin(math.radians(a0 + (a1 - a0) * i / n)))) for i in range(n + 1)]

def add_glyph(name, glyph, width):
    order.append(name)
    glyf[name] = glyph
    hmtx[name] = (width, 0)

def draw_mark(name, draw):
    pen = TTGlyphPen(None)
    draw(pen)
    add_glyph(name, pen.glyph(), 0)

# Aigu : biseau fin en bas, tête arrondie en haut, comme les terminaisons de la police.
acute = [(-98, BASE), (-24, BASE), (104, BASE + 112)] + arc(70, BASE + 140, 44, -40, 125, 7)
draw_mark('acutecomb.cleo', lambda p: poly(p, acute))
draw_mark('gravecomb.cleo', lambda p: poly(p, [(-x, y) for x, y in acute]))
# Circonflexe : chevron épais à pointe aplatie.
draw_mark('circumflexcomb.cleo', lambda p: poly(p, [(-170, BASE), (-98, BASE), (0, BASE + 88), (98, BASE), (170, BASE), (38, BASE + 160), (-38, BASE + 160)]))

# Tréma : deux points repris du point de la police (même dessin).
rec = RecordingPen(); gs['period'].draw(rec)
pb = BoundsPen(gs); gs['period'].draw(pb)
px0, py0, px1, py1 = pb.bounds
pcx = (px0 + px1) / 2

def dots(spacing, scale):
    def draw(pen):
        for side in (-1, 1):
            t = TransformPen(pen, (scale, 0, 0, scale, side * spacing - pcx * scale, BASE + 6 - py0 * scale))
            rec.replay(t)
    return draw
draw_mark('dieresiscomb.cleo', dots(118, .9))
draw_mark('dieresiscomb.narrow', dots(82, .72))

# Tilde : vague épaisse.
def tilde(pen):
    top = [(x, BASE + 70 + 38 * math.sin(math.radians(x * 1.25))) for x in range(-160, 161, 20)]
    bottom = [(x, y - 58) for x, y in reversed(top)]
    poly(pen, [(round(x), round(y)) for x, y in top + bottom])
draw_mark('tildecomb.cleo', tilde)
# Rond (Å).
def ring(pen):
    poly(pen, arc(0, BASE + 82, 80, 0, 360, 24)[:-1], True)
    poly(pen, arc(0, BASE + 82, 38, 0, 360, 24)[:-1], False)
draw_mark('ringcomb.cleo', ring)

# Cédille : la virgule de la police, glissée sous la lettre.
rec_c = RecordingPen(); gs['comma'].draw(rec_c)
cb = BoundsPen(gs); gs['comma'].draw(cb)
ccx = (cb.bounds[0] + cb.bounds[2]) / 2
def cedilla(pen):
    s = .85
    rec_c.replay(TransformPen(pen, (s, 0, 0, s, -ccx * s, 30 - cb.bounds[3] * s)))
draw_mark('cedillacomb.cleo', cedilla)

marks = {'grave': 'gravecomb.cleo', 'acute': 'acutecomb.cleo', 'circumflex': 'circumflexcomb.cleo',
         'tilde': 'tildecomb.cleo', 'dieresis': 'dieresiscomb.cleo', 'ring': 'ringcomb.cleo', 'cedilla': 'cedillacomb.cleo'}
letters = {
    'À': ('A', 'grave'), 'Á': ('A', 'acute'), 'Â': ('A', 'circumflex'), 'Ã': ('A', 'tilde'), 'Ä': ('A', 'dieresis'), 'Å': ('A', 'ring'),
    'Ç': ('C', 'cedilla'), 'È': ('E', 'grave'), 'É': ('E', 'acute'), 'Ê': ('E', 'circumflex'), 'Ë': ('E', 'dieresis'),
    'Ì': ('I', 'grave'), 'Í': ('I', 'acute'), 'Î': ('I', 'circumflex'), 'Ï': ('I', 'dieresis'), 'Ñ': ('N', 'tilde'),
    'Ò': ('O', 'grave'), 'Ó': ('O', 'acute'), 'Ô': ('O', 'circumflex'), 'Õ': ('O', 'tilde'), 'Ö': ('O', 'dieresis'),
    'Ù': ('U', 'grave'), 'Ú': ('U', 'acute'), 'Û': ('U', 'circumflex'), 'Ü': ('U', 'dieresis'), 'Ý': ('Y', 'acute'), 'Ÿ': ('Y', 'dieresis'),
}
for upper in list(letters):
    base, mark = letters[upper]
    letters[upper.lower() if upper != 'Ÿ' else 'ÿ'] = (base.lower(), mark)

new = {}
for ch, (base, mark) in letters.items():
    b = BoundsPen(gs); gs[base].draw(b)
    cx = round((b.bounds[0] + b.bounds[2]) / 2)
    mname = 'dieresiscomb.narrow' if mark == 'dieresis' and base in 'Ii' else marks[mark]
    g = copy.deepcopy(glyf['A'])  # gabarit composite
    g.__dict__.clear()
    g.numberOfContours = -1
    comps = []
    for gname, dx in ((base, 0), (mname, cx)):
        c = GlyphComponent(); c.glyphName = gname; c.x = dx; c.y = 0; c.flags = 0x4 if gname == base else 0
        comps.append(c)
    g.components = comps
    name = f'uni{ord(ch):04X}.cleo'
    add_glyph(name, g, hmtx[base][0])
    new[name] = base
    for table in f['cmap'].tables:
        if table.isUnicode() and ord(ch) in table.cmap:
            table.cmap[ord(ch)] = name

f.setGlyphOrder(order)
gid = {n: i for i, n in enumerate(order)}
for name in list(new) + [m for m in order if m.endswith(('.cleo', '.narrow')) and m not in new]:
    glyf[name].recalcBounds(glyf)
    hmtx[name] = (hmtx[name][0], getattr(glyf[name], 'xMin', 0))

gdef = f['GDEF'].table.GlyphClassDef.classDefs
for name in order:
    if name.endswith(('.cleo', '.narrow')):
        gdef[name] = 1 if name in new else 3

# Crénage : chaque lettre accentuée reprend celui de sa lettre de base.
new_sorted = sorted(new, key=gid.get)
for lookup in f['GPOS'].table.LookupList.Lookup:
    for st in lookup.SubTable:
        cov = st.Coverage.glyphs
        if st.Format == 1:
            for ps in st.PairSet:
                extra = []
                for n in new_sorted:
                    for r in ps.PairValueRecord:
                        if r.SecondGlyph == new[n]:
                            r2 = copy.deepcopy(r); r2.SecondGlyph = n; extra.append(r2)
                ps.PairValueRecord += extra; ps.PairValueCount = len(ps.PairValueRecord)
            for n in new_sorted:
                if new[n] in cov:
                    st.PairSet.append(copy.deepcopy(st.PairSet[cov.index(new[n])])); cov.append(n)
            st.PairSetCount = len(st.PairSet)
        elif st.Format == 2:
            for n in new_sorted:
                if new[n] in cov:
                    cov.append(n)
                c1, c2 = st.ClassDef1.classDefs, st.ClassDef2.classDefs
                if new[n] in c1: c1[n] = c1[new[n]]
                if new[n] in c2: c2[n] = c2[new[n]]

f['maxp'].numGlyphs = len(order)
f['post'].formatType = 2.0
f['post'].extraNames = []
f['post'].mapping = {}
f.save(out)
print(f'{len(new)} lettres accentuées ajoutées → {out}')
