import 'package:flutter/material.dart';
import '../../domain/town/map_layout.dart';
import '../../domain/town/subtopics.dart';

/// Draws the 20 bespoke per-location isometric SCENES (town square, cafe, home
/// interiors, restaurant…), ported from LocationScene.tsx. Each scene is
/// authored in a 220×170 local box around origin (GX=110, GY=98) and placed
/// beside the road at its lesson, on the side from the data.
class TownScenePainter extends CustomPainter {
  TownScenePainter(this.layout);
  final TownLayout layout;

  static const double _gx = 110, _gy = 98;

  @override
  void paint(Canvas canvas, Size size) {
    final w = layout.worldW;
    final sc = (w * 0.46) / 220.0;
    for (var i = 0; i < layout.lessons.length; i++) {
      final l = layout.lessons[i];
      final s = kSubtopics[i];
      final side = i == 0 || i == 6 ? 0.5 : (s.xPercent > 50 ? 0.26 : 0.74);
      final cxWorld = w * side;
      final cyWorld = l.py - 6;
      canvas.save();
      canvas.translate(cxWorld - _gx * sc, cyWorld - _gy * sc);
      canvas.scale(sc);
      _Scene(canvas).draw(s.title.isEmpty ? '' : _typeFor(i));
      canvas.restore();
    }
  }

  String _typeFor(int i) => const [
        'town_square', 'park', 'cafe', 'gift', 'home_routine', 'bus', 'gate',
        'living', 'kitchen', 'bedroom', 'doorway', 'dining', 'nbhd_park',
        'balcony', 'r_host', 'r_entrance', 'r_menu', 'r_order', 'r_bill', 'r_exit',
      ][i];

  @override
  bool shouldRepaint(covariant TownScenePainter old) => old.layout != layout;
}

/// Local drawing toolkit (canvas pre-translated to scene origin).
class _Scene {
  _Scene(this.c);
  final Canvas c;
  static const double gx = 110, gy = 98;
  static const _tStone = Color(0xFFE9DFC8);
  static const _tGrass = Color(0xFFBBDD9C);
  static const _tPave = Color(0xFFE3DAC8);
  static const _tWood = Color(0xFFE9CFA6);

  Color _sh(Color x, int a) => Color.fromARGB(255, (x.r * 255 - a).clamp(0, 255).round(), (x.g * 255 - a).clamp(0, 255).round(), (x.b * 255 - a).clamp(0, 255).round());
  Color _ti(Color x, int a) => Color.fromARGB(255, (x.r * 255 + a).clamp(0, 255).round(), (x.g * 255 + a).clamp(0, 255).round(), (x.b * 255 + a).clamp(0, 255).round());
  Paint _f(Color x, [double o = 1]) => Paint()..color = x.withValues(alpha: o);
  Paint _st(Color x, double w, [double o = 1]) => Paint()..color = x.withValues(alpha: o)..style = PaintingStyle.stroke..strokeWidth = w..strokeCap = StrokeCap.round;
  void _rect(double x, double y, double w, double h, Color col, [double r = 0]) {
    final rr = Rect.fromLTWH(x, y, w, h);
    r > 0 ? c.drawRRect(RRect.fromRectAndRadius(rr, Radius.circular(r)), _f(col)) : c.drawRect(rr, _f(col));
  }
  void _circ(double x, double y, double r, Color col, [double o = 1]) => c.drawCircle(Offset(x, y), r, _f(col, o));
  void _oval(double x, double y, double rx, double ry, Color col, [double o = 1]) => c.drawOval(Rect.fromCenter(center: Offset(x, y), width: rx * 2, height: ry * 2), _f(col, o));
  void _poly(List<double> pts, Color col, [double o = 1]) {
    final p = Path()..moveTo(pts[0], pts[1]);
    for (var i = 2; i < pts.length; i += 2) {
      p.lineTo(pts[i], pts[i + 1]);
    }
    c.drawPath(p..close(), _f(col, o));
  }
  void _line(double x1, double y1, double x2, double y2, Color col, double w, [double o = 1]) => c.drawLine(Offset(x1, y1), Offset(x2, y2), _st(col, w, o));
  void _text(String t, double x, double y, double size, Color col) {
    final tp = TextPainter(text: TextSpan(text: t, style: TextStyle(color: col, fontSize: size, fontWeight: FontWeight.w900)), textDirection: TextDirection.ltr)..layout();
    tp.paint(c, Offset(x - tp.width / 2, y - size));
  }

  // ── ground plots ──
  void platform(Color top, Color side, {double w = 196, bool paved = false, bool flowers = false}) {
    final x = gx - w / 2;
    final by = gy + 16;
    _oval(gx, by + 6, w * 0.62, 12, Colors.black, 0.1);
    _poly([x, by, x + w, by, x + w + 22, by - 12, x + 22, by - 12], side);
    _poly([x + 22, by - 12, x + w + 22, by - 12, x + w + 22, by - 28, x + 22, by - 28], top);
    // top face
    _poly([x, by, x + w, by, x + w + 22, by - 12, x + 22, by - 12], _ti(top, 4), 0.0);
    c.drawPath(
        (Path()..moveTo(x + 22, by - 12)..lineTo(x + w + 22, by - 12)..lineTo(x + w, by)..lineTo(x, by)..close()),
        _f(top));
    if (paved) {
      for (var i = 1; i < 5; i++) {
        _line(x + w * i / 5, by, x + 22 + w * i / 5, by - 12, _sh(top, 12), 0.6, 0.4);
      }
    }
  }

  void room(Color floor, Color wall, {Color? rug, bool art = true, bool window = true}) {
    const w = 152.0, h = 84.0;
    final x = gx - w / 2;
    final by = gy + 12;
    final ty = by - h;
    const dx = 24.0, dy = 13.0;
    _oval(gx + 6, by + 8, w * 0.64, 12, Colors.black, 0.1);
    _poly([x, by, x + w, by, x + w + dx, by - dy, x + dx, by - dy], floor);
    for (final fr in [0.3, 0.55, 0.8]) {
      _line(x + w * fr, by, x + dx + w * fr, by - dy, _sh(floor, 10), 0.8, 0.5);
    }
    _poly([x + dx, by - dy, x + w + dx, by - dy, x + w + dx, ty - dy, x + dx, ty - dy], wall);
    _poly([x + dx, ty - dy, x + w + dx, ty - dy, x + w + dx, ty - dy + h * 0.3, x + dx, ty - dy + h * 0.3], _ti(wall, 10), 0.5);
    _poly([x, by, x + dx, by - dy, x + dx, ty - dy, x, ty], _sh(wall, 16));
    _poly([x + dx, by - dy, x + w + dx, by - dy, x + w + dx, by - dy - 4, x + dx, by - dy - 4], _sh(wall, 26));
    if (rug != null) _oval(gx + 6, by - 6, w * 0.34, 11, rug, 0.85);
    if (art) {
      _rect(x + dx + 14, ty - dy + 12, 18, 14, const Color(0xFFFFF7EE), 1.5);
      _poly([x + dx + 16, ty - dy + 23, x + dx + 22, ty - dy + 17, x + dx + 30, ty - dy + 23], const Color(0xFF8FC468));
    }
    if (window) {
      _rect(x + w + dx - 34, ty - dy + 14, 24, 20, const Color(0xFFBFE0F2), 2);
      _line(x + w + dx - 22, ty - dy + 14, x + w + dx - 22, ty - dy + 34, Colors.white, 1);
      _poly([x + w + dx - 37, ty - dy + 12, x + w + dx - 29, ty - dy + 12, x + w + dx - 29, ty - dy + 36, x + w + dx - 37, ty - dy + 36], const Color(0xFFE0764B), 0.55);
    }
  }

  void build(double x, double base, double w, double h, Color wall, Color roof, {String? label, bool awning = false, bool peak = false, bool steps = false}) {
    final topY = base - h;
    final d = w * 0.34, ddx = d * 0.7, ddy = d * 0.4;
    _oval(x + w / 2 + ddx / 2, base + 4, w * 0.74, 7, Colors.black, 0.1);
    _poly([x + w, base, x + w + ddx, base - ddy, x + w + ddx, topY - ddy, x + w, topY], _sh(wall, 34));
    _rect(x, topY, w, h, wall);
    _rect(x, base - 6, w, 6, _sh(wall, 14));
    // windows
    final cols = w > 64 ? 3 : 2;
    final winW = (w * 0.58) / cols;
    final gap = (w * 0.42) / (cols + 1);
    for (var ci = 0; ci < cols; ci++) {
      final wx = x + gap * (ci + 1) + winW * ci;
      final wy = topY + h * 0.16;
      _rect(wx, wy, winW, winW * 0.92, const Color(0xFFBFE0F2), 2);
      c.drawRect(Rect.fromLTWH(wx, wy, winW, winW * 0.92), _st(Colors.white, 1.3));
    }
    // door
    _rect(x + w / 2 - w * 0.11, base - h * 0.34, w * 0.22, h * 0.34, const Color(0xFF9A744B), 2);
    if (steps) {
      _rect(x + w / 2 - w * 0.16, base - 2, w * 0.32, 3, _sh(wall, 20), 1);
      _rect(x + w / 2 - w * 0.12, base - 5, w * 0.24, 3, _sh(wall, 12), 1);
    }
    if (awning) {
      for (var i = 0; i < 6; i++) {
        _rect(x + (w / 6) * i, topY + h * 0.46, w / 6, 6, i.isEven ? roof : _ti(roof, 30));
      }
    }
    if (peak) {
      _poly([x - 5, topY + 2, x + w / 2, topY - w * 0.42, x + w + 5, topY + 2], roof);
      _poly([x + w / 2, topY - w * 0.42, x + w + 5, topY + 2, x + w + 5 + ddx, topY + 2 - ddy, x + w / 2 + ddx, topY - w * 0.42 - ddy], _sh(roof, 30));
    } else {
      _poly([x, topY, x + w, topY, x + w + ddx, topY - ddy, x + ddx, topY - ddy], roof);
      _rect(x - 2, topY - 7, w + 4, 8, _sh(roof, 24), 2);
    }
    if (label != null) {
      _rect(x + w / 2 - 20, topY - 6, 40, 9, Colors.white, 2);
      _text(label, x + w / 2, topY + 2, 6, _sh(roof, 20));
    }
  }

  void person(double x, double base, {Color skin = const Color(0xFFC68A5E), Color shirt = const Color(0xFFE0764B), Color pants = const Color(0xFF3C4A66), Color hair = const Color(0xFF2A2018), double s = 1, bool wave = false, bool dress = false}) {
    final hi = _ti(shirt, 26);
    _oval(x, base + 2.6 * s, 7.6 * s, 2.6 * s, Colors.black, 0.1);
    if (dress) {
      _poly([x - 6.4 * s, base, x + 6.4 * s, base, x + 4 * s, base - 14 * s, x - 4 * s, base - 14 * s], shirt);
    } else {
      _rect(x - 4 * s, base - 9 * s, 3.3 * s, 8.4 * s, pants, 1.4 * s);
      _rect(x + 0.7 * s, base - 9 * s, 3.3 * s, 8.4 * s, _sh(pants, 12), 1.4 * s);
      _rect(x - 4.6 * s, base - 1.4 * s, 4.4 * s, 2.6 * s, const Color(0xFF3A3A3A), 1.3 * s);
      _rect(x + 0.3 * s, base - 1.4 * s, 4.4 * s, 2.6 * s, const Color(0xFF2E2E2E), 1.3 * s);
    }
    _rect(x - 5.2 * s, base - 19 * s, 10.4 * s, (dress ? 6 : 11) * s, shirt, 4 * s);
    _rect(x - 5.2 * s, base - 19 * s, 4.2 * s, (dress ? 6 : 11) * s, hi, 3.4 * s);
    _rect(x - 7.4 * s, base - 18 * s, 3 * s, 8 * s, _sh(shirt, 14), 1.5 * s);
    if (wave) {
      c.save();
      c.translate(x + 6 * s, base - 20 * s);
      c.rotate(28 * 3.14159 / 180);
      c.translate(-(x + 6 * s), -(base - 20 * s));
      _rect(x + 4.6 * s, base - 25 * s, 3 * s, 9 * s, _sh(shirt, 10), 1.5 * s);
      c.restore();
    } else {
      _rect(x + 4.4 * s, base - 18 * s, 3 * s, 8 * s, _sh(shirt, 10), 1.5 * s);
      _circ(x + 5.9 * s, base - 10.5 * s, 1.5 * s, skin);
    }
    _circ(x - 5.9 * s, base - 10.5 * s, 1.5 * s, skin);
    _circ(x, base - 23 * s, 4.7 * s, skin);
    _circ(x - 1.5 * s, base - 23 * s, 0.7 * s, const Color(0xFF2A2018));
    _circ(x + 1.5 * s, base - 23 * s, 0.7 * s, const Color(0xFF2A2018));
    _poly([x - 4.9 * s, base - 23.5 * s, x, base - 32.5 * s, x + 4.9 * s, base - 23.5 * s, x, base - 26.5 * s], hair);
  }

  void seated(double x, double base, {Color shirt = const Color(0xFFE0764B), double s = 1, bool dress = false, Color chair = const Color(0xFFA9764C), Color skin = const Color(0xFFC68A5E)}) {
    _oval(x, base + 2, 8 * s, 2.4 * s, Colors.black, 0.12);
    _rect(x - 7 * s, base - 16 * s, 2.6 * s, 14 * s, chair, 1);
    _rect(x - 7 * s, base - 4 * s, 14 * s, 3 * s, _sh(chair, 14), 1);
    if (!dress) {
      _rect(x - 5 * s, base - 9 * s, 10 * s, 3.2 * s, const Color(0xFF3C4A66), 1.5);
      _rect(x - 4 * s, base - 7 * s, 3 * s, 7 * s, const Color(0xFF34405A), 1.3);
      _rect(x + 1 * s, base - 7 * s, 3 * s, 7 * s, const Color(0xFF3C4A66), 1.3);
    } else {
      _poly([x - 6 * s, base - 2 * s, x + 6 * s, base - 2 * s, x + 4 * s, base - 12 * s, x - 4 * s, base - 12 * s], shirt);
    }
    _rect(x - 5 * s, base - 22 * s, 10 * s, (dress ? 9 : 12) * s, shirt, 4 * s);
    _circ(x, base - 26 * s, 4.6 * s, skin);
    _circ(x - 1.4 * s, base - 26 * s, 0.7 * s, const Color(0xFF2A2018));
    _circ(x + 1.4 * s, base - 26 * s, 0.7 * s, const Color(0xFF2A2018));
    _poly([x - 4.7 * s, base - 26.5 * s, x, base - 35 * s, x + 4.7 * s, base - 26.5 * s], const Color(0xFF2A2018));
  }

  void tree(double x, double base, [double s = 1]) {
    _oval(x + 2 * s, base + 3 * s, 15 * s, 4.2 * s, Colors.black, 0.09);
    _rect(x - 2.6 * s, base - 9 * s, 5.2 * s, 12 * s, const Color(0xFF9A6B43), 2);
    _circ(x, base - 19 * s, 14.5 * s, const Color(0xFF5E9642), 0.6);
    _circ(x, base - 20 * s, 13 * s, const Color(0xFF75AE52));
    _circ(x - 8 * s, base - 13 * s, 8 * s, const Color(0xFF75AE52));
    _circ(x + 8 * s, base - 13 * s, 8 * s, const Color(0xFF5E9642));
    _circ(x - 4 * s, base - 25 * s, 6 * s, const Color(0xFFC4E8A0), 0.8);
  }

  void bush(double x, double y, [double s = 1]) {
    _oval(x, y + 4 * s, 13 * s, 4 * s, Colors.black, 0.08);
    _circ(x, y, 9 * s, const Color(0xFF7CB257));
    _circ(x - 7 * s, y + 2 * s, 6 * s, const Color(0xFF8EC56A));
    _circ(x + 7 * s, y + 2 * s, 6 * s, const Color(0xFF69A047));
  }

  void hedge(double x, double y, double w, [double s = 1]) {
    _rect(x, y - 9 * s, w, 11 * s, const Color(0xFF6FA84E), 5 * s);
    _rect(x, y - 11 * s, w, 6 * s, const Color(0xFF82BC5E), 3 * s);
  }

  void lamp(double x, double base, [double s = 1]) {
    _rect(x - 1.5 * s, base - 32 * s, 3 * s, 32 * s, const Color(0xFF6E7681), 1);
    _circ(x, base - 35 * s, 6 * s, const Color(0xFFFFE49A), 0.4);
    _circ(x, base - 35 * s, 3.6 * s, const Color(0xFFFFE9A8));
  }

  void bench(double x, double base, [double s = 1]) {
    _oval(x, base + 3 * s, 14 * s, 3 * s, Colors.black, 0.1);
    _rect(x - 13 * s, base - 4 * s, 26 * s, 4 * s, const Color(0xFFB5824F), 2 * s);
    _rect(x - 13 * s, base - 12 * s, 26 * s, 4 * s, const Color(0xFFC4945E), 2 * s);
    _rect(x - 11 * s, base, 2.5 * s, 6 * s, const Color(0xFF8A5E3C));
    _rect(x + 8.5 * s, base, 2.5 * s, 6 * s, const Color(0xFF8A5E3C));
  }

  void flower(double x, double y, Color col, [double s = 1]) {
    _line(x, y, x, y - 7 * s, const Color(0xFF6FA84E), 1.4);
    _circ(x, y - 7 * s, 2.4 * s, col);
    _circ(x, y - 7 * s, 1.2 * s, const Color(0xFFFFD24C));
  }

  void plant(double x, double base, [double s = 1]) {
    _rect(x - 4 * s, base - 6 * s, 8 * s, 7 * s, const Color(0xFFC0673D), 1.5);
    _circ(x, base - 10 * s, 6 * s, const Color(0xFF6FA84E));
    _circ(x - 4 * s, base - 8 * s, 4 * s, const Color(0xFF82BC5E));
    _circ(x + 4 * s, base - 8 * s, 4 * s, const Color(0xFF5E9642));
  }

  void fountain(double x, double y, [double s = 1]) {
    _oval(x, y + 2 * s, 27 * s, 12 * s, const Color(0xFFAFC8D2));
    _oval(x, y, 22 * s, 10 * s, const Color(0xFFBFE6F5));
    _rect(x - 2.6 * s, y - 24 * s, 5.2 * s, 18 * s, const Color(0xFFCBD8DE), 2);
    _rect(x - 1.5 * s, y - 30 * s, 3 * s, 8 * s, const Color(0xFF9FD0EC), 1.5);
  }

  void umbrella(double x, double base, Color col) {
    _line(x, base, x, base - 26, const Color(0xFFB0875A), 1.6);
    _poly([x - 18, base - 26, x + 18, base - 26, x, base - 38], col);
    _poly([x - 18, base - 26, x, base - 26, x - 6, base - 30, x - 12, base - 28], _ti(col, 20));
  }

  void roundTable(double x, base) {
    _oval(x, base - 4, 11, 4, const Color(0xFFE6D4B4));
    _rect(x - 1, base - 4, 2, 6, const Color(0xFFB0875A));
  }

  void chair(double x, double base) {
    _rect(x - 4, base - 12, 8, 3, const Color(0xFFA9764C), 1);
    _rect(x - 3, base - 9, 2, 9, const Color(0xFF8A5E3C));
  }

  // ── 20 scenes ──
  void draw(String t) {
    switch (t) {
      case 'town_square':
        platform(_tStone, const Color(0xFFCBBE9E), paved: true);
        hedge(gx - 96, gy + 6, 30);
        hedge(gx + 66, gy + 6, 30);
        fountain(gx, gy - 2, 1.05);
        lamp(gx - 74, gy - 2);
        lamp(gx + 74, gy - 2);
        bench(gx - 54, gy + 16);
        bench(gx + 58, gy + 16);
        person(gx - 30, gy + 22, shirt: const Color(0xFF5BA6C9), wave: true);
        person(gx - 48, gy + 24, s: 0.9, shirt: const Color(0xFFE0764B), dress: true);
        person(gx - 14, gy + 26, s: 0.85, shirt: const Color(0xFF7FB04F));
        tree(gx - 90, gy + 2, 0.85);
        tree(gx + 92, gy + 4, 0.85);
      case 'park':
      case 'nbhd_park':
        platform(_tGrass, const Color(0xFF9ECB78), flowers: true);
        _line(gx - 84, gy + 22, gx + 84, gy + 22, const Color(0xFFE6DABA), 6);
        tree(gx - 62, gy - 2, 1.05);
        tree(gx + 72, gy + 2, 1.15);
        bench(gx - 18, gy + 12, 1.1);
        person(gx - 20, gy + 8, shirt: const Color(0xFF7E6BD0));
        person(gx + 18, gy + 16, shirt: const Color(0xFFE0A526));
        flower(gx - 40, gy + 22, const Color(0xFFE0699A));
        flower(gx + 4, gy + 24, const Color(0xFFFFD24C));
        flower(gx + 52, gy + 22, const Color(0xFF7E6BD0));
      case 'cafe':
        platform(_tPave, const Color(0xFFCCC0A6), paved: true);
        build(gx + 14, gy - 2, 70, 60, const Color(0xFFF3DDB6), const Color(0xFFC0533B), label: 'CAFE', awning: true);
        umbrella(gx - 34, gy + 4, const Color(0xFFC0533B));
        roundTable(gx - 34, gy + 10);
        chair(gx - 50, gy + 13);
        chair(gx - 18, gy + 13);
        person(gx - 50, gy + 17, shirt: const Color(0xFF5BA6C9));
        person(gx - 18, gy + 17, shirt: const Color(0xFFE0699A), dress: true);
        plant(gx + 84, gy + 12);
      case 'gift':
        platform(_tPave, const Color(0xFFCCC0A6), paved: true);
        build(gx - 6, gy - 2, 72, 60, const Color(0xFFFAD9E2), const Color(0xFFE0699A), label: 'GIFTS', awning: true);
        _circ(gx + 54, gy - 44, 5, const Color(0xFFE0699A));
        _circ(gx + 62, gy - 42, 5, const Color(0xFF5BA6C9));
        _circ(gx + 58, gy - 50, 5, const Color(0xFFFFD24C));
        _rect(gx - 64, gy - 4, 16, 14, const Color(0xFFE0764B), 2);
        person(gx - 22, gy + 16, shirt: const Color(0xFF7FB04F), wave: true);
        person(gx - 40, gy + 18, s: 0.85, shirt: const Color(0xFFE0A526), dress: true);
        plant(gx + 80, gy + 12);
      case 'home_routine':
        room(_tWood, const Color(0xFFF4E3CE), rug: const Color(0xFFC77FB0));
        _rect(gx - 64, gy - 14, 36, 14, const Color(0xFF9CC4D8), 3);
        _circ(gx + 30, gy - 48, 9, Colors.white);
        c.drawCircle(Offset(gx + 30, gy - 48), 9, _st(const Color(0xFFC9B393), 2));
        _rect(gx + 8, gy - 6, 30, 5, const Color(0xFFC99A6B), 2);
        plant(gx + 50, gy + 4, 0.85);
        person(gx - 2, gy + 6, shirt: const Color(0xFF5BA6C9));
      case 'bus':
        platform(_tPave, const Color(0xFFCCC0A6));
        _rect(gx - 86, gy - 4, 64, 26, const Color(0xFFF0B43C), 5);
        _rect(gx - 82, gy - 1, 50, 9, const Color(0xFFBFE0F2), 2);
        _circ(gx - 74, gy + 22, 5, const Color(0xFF3F3B37));
        _circ(gx - 38, gy + 22, 5, const Color(0xFF3F3B37));
        _rect(gx + 2, gy - 26, 48, 18, const Color(0xFFCFE0F0), 2);
        _rect(gx - 4, gy - 28, 3, 28, const Color(0xFF9AA6C7));
        person(gx + 8, gy + 6, shirt: const Color(0xFFE0764B));
        person(gx + 22, gy + 8, shirt: const Color(0xFF7FB04F), wave: true);
        lamp(gx + 78, gy - 4);
      case 'gate':
        platform(_tStone, const Color(0xFFCBBE9E), w: 210, paved: true);
        _rect(gx - 66, gy - 72, 20, 72, const Color(0xFFCDA877), 3);
        _rect(gx + 46, gy - 72, 20, 72, const Color(0xFFCDA877), 3);
        _rect(gx - 72, gy - 88, 144, 22, const Color(0xFFB98E5A), 6);
        _text('TOWN GATE', gx, gy - 73, 11, const Color(0xFFFFF7EE));
        lamp(gx - 80, gy);
        lamp(gx + 80, gy);
        person(gx, gy + 18, shirt: const Color(0xFF5BA6C9), wave: true);
      case 'living':
        room(_tWood, const Color(0xFFEFE0CB), rug: const Color(0xFF5BA6C9));
        _rect(gx + 2, gy + 2, 30, 18, const Color(0xFF4F4945), 3);
        _rect(gx + 6, gy - 4, 22, 12, const Color(0xFF9FD0EC), 2);
        _rect(gx + 40, gy - 26, 16, 30, const Color(0xFFA9764C), 2);
        _rect(gx - 68, gy - 10, 42, 12, const Color(0xFFE0764B), 3);
        _rect(gx - 68, gy - 19, 42, 10, const Color(0xFFE88A63), 3);
        person(gx - 56, gy - 2, shirt: const Color(0xFF7E6BD0));
        person(gx - 4, gy + 10, shirt: const Color(0xFF5BA6C9), wave: true);
      case 'kitchen':
        room(_tWood, const Color(0xFFE6EFDC), art: false);
        _rect(gx - 66, gy - 50, 50, 12, const Color(0xFFD8E0CC), 2);
        _rect(gx - 66, gy - 12, 56, 12, const Color(0xFFC9B393), 2);
        _rect(gx - 66, gy - 16, 56, 4, const Color(0xFFE0D2B0));
        _rect(gx + 22, gy - 44, 22, 44, const Color(0xFFEEF3F6), 3);
        _rect(gx - 18, gy - 48, 16, 14, const Color(0xFFBFE0F2), 1.5);
        person(gx - 40, gy + 2, shirt: const Color(0xFFE0699A), dress: true);
        person(gx + 6, gy + 8, shirt: const Color(0xFF5BA6C9), wave: true);
      case 'bedroom':
        room(_tWood, const Color(0xFFEAE2F3), rug: const Color(0xFF7E6BD0));
        _rect(gx - 68, gy - 12, 50, 14, const Color(0xFF9CC4D8), 3);
        _rect(gx - 62, gy - 18, 15, 7, Colors.white, 2);
        _rect(gx + 30, gy - 6, 22, 15, const Color(0xFFC0673D), 2);
        _rect(gx + 40, gy - 44, 20, 44, const Color(0xFFB98456), 2);
        person(gx + 2, gy + 8, shirt: const Color(0xFF7E6BD0));
        person(gx + 16, gy + 10, s: 0.85, shirt: const Color(0xFFE0A526));
      case 'doorway':
        platform(_tPave, const Color(0xFFCCC0A6));
        build(gx - 30, gy - 2, 72, 52, const Color(0xFFF3E0C8), const Color(0xFFC0673D), peak: true);
        _rect(gx - 6, gy - 28, 18, 28, const Color(0xFF7E5736), 2);
        plant(gx + 24, gy + 2);
        person(gx + 32, gy + 10, shirt: const Color(0xFF5BA6C9));
        person(gx + 48, gy + 12, shirt: const Color(0xFFE0699A), dress: true);
        _text('♥', gx + 40, gy - 14, 11, const Color(0xFFE0699A));
      case 'dining':
        room(_tWood, const Color(0xFFF4E3CE), rug: const Color(0xFFE0A526));
        _oval(gx, gy - 2, 44, 14, const Color(0xFFD8C2A0));
        _oval(gx, gy - 4, 40, 11, const Color(0xFFE6D4B4));
        _circ(gx - 24, gy - 4, 4, Colors.white);
        _circ(gx, gy - 4, 4, Colors.white);
        _circ(gx + 24, gy - 4, 4, Colors.white);
        seated(gx - 40, gy + 8, shirt: const Color(0xFF7E6BD0));
        seated(gx, gy + 14, shirt: const Color(0xFF5BA6C9));
        seated(gx + 40, gy + 8, shirt: const Color(0xFFE0A526), dress: true);
      case 'balcony':
        platform(const Color(0xFFE2D6C0), const Color(0xFFC7B89A));
        _rect(gx - 72, gy - 58, 144, 58, const Color(0xFFF0E2CC), 3);
        _rect(gx - 30, gy - 50, 26, 28, const Color(0xFFBFD9EC), 2);
        for (var i = 0; i < 10; i++) {
          _rect(gx - 64 + i * 14, gy - 4, 3, 18, const Color(0xFFB7A98C));
        }
        _rect(gx - 66, gy - 6, 134, 4, const Color(0xFFA9764C), 2);
        plant(gx - 58, gy - 4, 1.1);
        plant(gx + 58, gy - 4, 1.1);
        person(gx - 12, gy + 8, shirt: const Color(0xFFE0A526), dress: true);
        person(gx + 20, gy + 8, shirt: const Color(0xFF5BA6C9), wave: true);
      case 'r_host':
        platform(const Color(0xFFE9D9C0), const Color(0xFFCDBE9A), paved: true);
        build(gx + 14, gy - 2, 66, 62, const Color(0xFFEFE2C9), const Color(0xFF9B6B4B));
        _rect(gx - 46, gy - 16, 22, 16, const Color(0xFF8A5E3C), 2);
        _rect(gx - 46, gy - 20, 22, 4, const Color(0xFFA9764C));
        person(gx - 35, gy + 4, shirt: const Color(0xFF3C4A66));
        person(gx - 60, gy + 14, s: 0.85, shirt: const Color(0xFF5BA6C9));
        plant(gx + 84, gy + 12, 1.1);
      case 'r_entrance':
        platform(const Color(0xFFE9D9C0), const Color(0xFFCDBE9A), paved: true);
        build(gx - 34, gy - 2, 80, 64, const Color(0xFFEBDDC2), const Color(0xFF9B6B4B), label: 'BISTRO', steps: true);
        _rect(gx - 4, gy - 32, 22, 32, const Color(0xFFBFD9EC), 2);
        person(gx + 32, gy + 10, shirt: const Color(0xFF3C4A66));
        person(gx + 48, gy + 12, shirt: const Color(0xFF5BA6C9), wave: true);
        plant(gx + 70, gy + 12);
      case 'r_menu':
        room(const Color(0xFFE9D9C0), const Color(0xFFF2E6D2), rug: const Color(0xFFC0533B));
        _oval(gx, gy - 2, 42, 14, const Color(0xFFD8C2A0));
        _oval(gx, gy - 4, 38, 11, const Color(0xFFE6D4B4));
        _poly([gx - 15, gy - 11, gx, gy - 15, gx, gy - 4, gx - 15, gy], Colors.white);
        _poly([gx, gy - 15, gx + 15, gy - 11, gx + 15, gy, gx, gy - 4], const Color(0xFFF4ECD8));
        seated(gx - 30, gy + 8, shirt: const Color(0xFF7E6BD0));
        seated(gx + 30, gy + 8, shirt: const Color(0xFFE0699A), dress: true);
        person(gx + 54, gy + 8, shirt: const Color(0xFF3C4A66));
      case 'r_order':
        room(const Color(0xFFE9D9C0), const Color(0xFFF2E6D2), rug: const Color(0xFF7FB04F));
        _oval(gx, gy - 2, 42, 14, const Color(0xFFD8C2A0));
        _oval(gx, gy - 4, 38, 11, const Color(0xFFE6D4B4));
        _circ(gx - 8, gy - 6, 3.6, Colors.white);
        _circ(gx + 10, gy - 6, 3, const Color(0xFFE0764B));
        seated(gx - 30, gy + 8, shirt: const Color(0xFF5BA6C9));
        seated(gx + 30, gy + 8, shirt: const Color(0xFFE0A526), dress: true);
        person(gx + 56, gy + 8, shirt: const Color(0xFF3C4A66));
      case 'r_bill':
        room(const Color(0xFFE9D9C0), const Color(0xFFF2E6D2));
        _rect(gx - 42, gy - 16, 84, 16, const Color(0xFF9B6B4B), 2);
        _rect(gx - 42, gy - 20, 84, 5, const Color(0xFFB98456));
        _rect(gx - 24, gy - 25, 15, 10, const Color(0xFF5B5550), 1.5);
        _rect(gx + 10, gy - 27, 10, 13, const Color(0xFF3C4A66), 2);
        person(gx, gy - 18, shirt: const Color(0xFFE0699A), dress: true);
        person(gx + 36, gy + 6, shirt: const Color(0xFF5BA6C9));
      case 'r_exit':
        platform(const Color(0xFFE9D9C0), const Color(0xFFCDBE9A), paved: true);
        build(gx - 42, gy - 2, 72, 58, const Color(0xFFEBDDC2), const Color(0xFF9B6B4B), steps: true);
        _rect(gx - 14, gy - 30, 22, 30, const Color(0xFFBFD9EC), 2);
        _text('THANK YOU', gx - 3, gy - 36, 7, const Color(0xFF5B4A32));
        person(gx + 8, gy + 10, shirt: const Color(0xFF3C4A66));
        person(gx + 56, gy + 12, shirt: const Color(0xFF5BA6C9), wave: true);
    }
  }
}
