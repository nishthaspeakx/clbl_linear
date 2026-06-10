import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../../domain/town/map_layout.dart';

/// Draws the roadside town decor (trees, shops, lamps, hedges, flowers, ponds,
/// benches, cars, monument, fountain) ported from LocationScene.tsx primitives
/// + the mapLayout decor generation. Paints in world coordinates.
class TownDecorPainter extends CustomPainter {
  TownDecorPainter(this.decor, {this.night = false});
  final List<Decor> decor;
  final bool night;

  Paint _f(Color c, [double o = 1]) => Paint()..color = c.withValues(alpha: o)..style = PaintingStyle.fill;
  Paint _s(Color c, double w, [double o = 1]) => Paint()
    ..color = c.withValues(alpha: o)
    ..style = PaintingStyle.stroke
    ..strokeWidth = w
    ..strokeCap = StrokeCap.round;
  Color _shade(Color c, int a) => Color.fromARGB(255, (c.r * 255 - a).clamp(0, 255).round(), (c.g * 255 - a).clamp(0, 255).round(), (c.b * 255 - a).clamp(0, 255).round());
  Color _tint(Color c, int a) => Color.fromARGB(255, (c.r * 255 + a).clamp(0, 255).round(), (c.g * 255 + a).clamp(0, 255).round(), (c.b * 255 + a).clamp(0, 255).round());
  void _shadow(Canvas c, double x, double y, double rx, double ry) =>
      c.drawOval(Rect.fromCenter(center: Offset(x, y), width: rx * 2, height: ry * 2), _f(Colors.black, 0.1));

  @override
  void paint(Canvas canvas, Size size) {
    // Painter's order: draw back-to-front roughly by y already in list order.
    for (final d in decor) {
      switch (d.kind) {
        case DecorKind.tree:
          _tree(canvas, d.x, d.y, d.s);
        case DecorKind.bush:
          _bush(canvas, d.x, d.y, d.s);
        case DecorKind.flower:
          _flower(canvas, d.x, d.y, d.color, d.s);
        case DecorKind.hedge:
          _hedge(canvas, d.x, d.y, d.w, d.s);
        case DecorKind.lamp:
          _lamp(canvas, d.x, d.y, d.s);
        case DecorKind.shop:
          _shop(canvas, d.x, d.y, d.s, d.shopLabel, d.shopWall, d.shopRoof);
        case DecorKind.pond:
          _pond(canvas, d.x, d.y, d.s);
        case DecorKind.flowerbed:
          _flowerbed(canvas, d.x, d.y, d.s);
        case DecorKind.bench:
          _bench(canvas, d.x, d.y, d.s);
        case DecorKind.car:
          _car(canvas, d.x, d.y, d.s, d.color);
        case DecorKind.monument:
          _monument(canvas, d.x, d.y, d.s);
        case DecorKind.fountain:
          _fountain(canvas, d.x, d.y, d.s);
        case DecorKind.scooter:
          _scooter(canvas, d.x, d.y, d.s, d.color);
        case DecorKind.cycle:
          _cycle(canvas, d.x, d.y, d.s, d.color);
      }
    }
  }

  void _tree(Canvas c, double x, double base, double s) {
    _shadow(c, x + 2 * s, base + 3 * s, 15 * s, 4.2 * s);
    c.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(x - 2.6 * s, base - 9 * s, 5.2 * s, 12 * s), const Radius.circular(2)), _f(const Color(0xFF9A6B43)));
    c.drawCircle(Offset(x, base - 19 * s), 14.5 * s, _f(const Color(0xFF5E9642), 0.6));
    c.drawCircle(Offset(x, base - 20 * s), 13 * s, _f(const Color(0xFF75AE52)));
    c.drawCircle(Offset(x - 8 * s, base - 13 * s), 8 * s, _f(const Color(0xFF75AE52)));
    c.drawCircle(Offset(x + 8 * s, base - 13 * s), 8 * s, _f(const Color(0xFF5E9642)));
    c.drawCircle(Offset(x - 4 * s, base - 25 * s), 6 * s, _f(const Color(0xFFC4E8A0), 0.8));
    c.drawCircle(Offset(x + 3 * s, base - 22 * s), 4 * s, _f(const Color(0xFFDCF3C0), 0.55));
  }

  void _bush(Canvas c, double x, double y, double s) {
    _shadow(c, x, y + 4 * s, 13 * s, 4 * s);
    c.drawCircle(Offset(x, y), 9 * s, _f(const Color(0xFF7CB257)));
    c.drawCircle(Offset(x - 7 * s, y + 2 * s), 6 * s, _f(const Color(0xFF8EC56A)));
    c.drawCircle(Offset(x + 7 * s, y + 2 * s), 6 * s, _f(const Color(0xFF69A047)));
    c.drawCircle(Offset(x + 2 * s, y - 3 * s), 3 * s, _f(const Color(0xFFA9D98A), 0.7));
  }

  void _flower(Canvas c, double x, double y, Color color, double s) {
    c.drawLine(Offset(x, y), Offset(x, y - 7 * s), _s(const Color(0xFF6FA84E), 1.4));
    for (final a in [0, 72, 144, 216, 288]) {
      final r = a * math.pi / 180;
      c.drawCircle(Offset(x + math.cos(r) * 2.6 * s, y - 7 * s + math.sin(r) * 2.6 * s), 2 * s, _f(color));
    }
    c.drawCircle(Offset(x, y - 7 * s), 1.6 * s, _f(const Color(0xFFFFD24C)));
  }

  void _hedge(Canvas c, double x, double y, double w, double s) {
    _shadow(c, x + w / 2, y + 4 * s, w * 0.6, 4 * s);
    c.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(x, y - 9 * s, w, 11 * s), Radius.circular(5 * s)), _f(const Color(0xFF6FA84E)));
    c.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(x, y - 11 * s, w, 6 * s), Radius.circular(3 * s)), _f(const Color(0xFF82BC5E)));
    final n = math.max(2, (w / 14).round());
    for (var i = 0; i < n; i++) {
      c.drawCircle(Offset(x + 8 + i * 14, y - 9 * s), 5 * s, _f(const Color(0xFF79B254)));
    }
  }

  void _lamp(Canvas c, double x, double base, double s) {
    _shadow(c, x, base + 2, 5 * s, 2 * s);
    c.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(x - 1.5 * s, base - 32 * s, 3 * s, 32 * s), const Radius.circular(1)), _f(night ? const Color(0xFF3E4452) : const Color(0xFF6E7681)));
    if (night) {
      c.drawCircle(Offset(x, base - 35 * s), 14 * s, _f(const Color(0xFFFFE49A), 0.22));
      c.drawCircle(Offset(x, base - 35 * s), 9 * s, _f(const Color(0xFFFFE49A), 0.3));
    }
    c.drawCircle(Offset(x, base - 35 * s), 6 * s, _f(const Color(0xFFFFE49A), night ? 0.6 : 0.4));
    c.drawCircle(Offset(x, base - 35 * s), 3.6 * s, _f(night ? const Color(0xFFFFF3C4) : const Color(0xFFFFE9A8)));
    c.drawCircle(Offset(x, base - 35 * s), 3.6 * s, _s(const Color(0xFFE0B85A), 1));
  }

  void _pond(Canvas c, double x, double y, double s) {
    c.drawOval(Rect.fromCenter(center: Offset(x, y), width: 48 * s, height: 22 * s), _f(const Color(0xFFAFC8D2)));
    c.drawOval(Rect.fromCenter(center: Offset(x, y - 1.5 * s), width: 40 * s, height: 18 * s), _f(const Color(0xFF9FD0EC)));
    c.drawOval(Rect.fromCenter(center: Offset(x - 4 * s, y - 2 * s), width: 18 * s, height: 8 * s), _f(const Color(0xFFBFE6F5), 0.7));
    c.drawOval(Rect.fromCenter(center: Offset(x + 8 * s, y + 1 * s), width: 10 * s, height: 4.8 * s), _f(const Color(0xFF7CB257)));
  }

  void _flowerbed(Canvas c, double x, double y, double s) {
    c.drawOval(Rect.fromCenter(center: Offset(x, y + 2 * s), width: 40 * s, height: 12 * s), _f(const Color(0xFF8A5E3C)));
    c.drawOval(Rect.fromCenter(center: Offset(x, y), width: 40 * s, height: 12 * s), _f(const Color(0xFFA9764C)));
    const cols = [Color(0xFFE0699A), Color(0xFFFFD24C), Color(0xFF7E6BD0), Color(0xFFFF9FC0)];
    final dxs = [-12, -4, 4, 12];
    for (var i = 0; i < 4; i++) {
      _flower(c, x + dxs[i] * s, y - 2 * s, cols[i], 0.85 * s);
    }
  }

  void _bench(Canvas c, double x, double y, double s) {
    _shadow(c, x, y + 3 * s, 14 * s, 3 * s);
    c.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(x - 13 * s, y - 4 * s, 26 * s, 4 * s), Radius.circular(2 * s)), _f(const Color(0xFFB5824F)));
    c.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(x - 13 * s, y - 12 * s, 26 * s, 4 * s), Radius.circular(2 * s)), _f(const Color(0xFFC4945E)));
    c.drawRect(Rect.fromLTWH(x - 11 * s, y, 2.5 * s, 6 * s), _f(const Color(0xFF8A5E3C)));
    c.drawRect(Rect.fromLTWH(x + 8.5 * s, y, 2.5 * s, 6 * s), _f(const Color(0xFF8A5E3C)));
  }

  void _car(Canvas c, double x, double y, double s, Color color) {
    _shadow(c, x, y + 4 * s, 20 * s, 4 * s);
    c.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(x - 18 * s, y - 8 * s, 36 * s, 11 * s), Radius.circular(5 * s)), _f(color));
    c.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(x - 10 * s, y - 15 * s, 20 * s, 9 * s), Radius.circular(4 * s)), _f(_tint(color, 16)));
    c.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(x - 7 * s, y - 13 * s, 14 * s, 6 * s), Radius.circular(2 * s)), _f(const Color(0xFFBFE0F2)));
    for (final dx in [-11, 11]) {
      c.drawCircle(Offset(x + dx * s, y + 3 * s), 4.4 * s, _f(const Color(0xFF3F3B37)));
      c.drawCircle(Offset(x + dx * s, y + 3 * s), 1.8 * s, _f(const Color(0xFF7E7873)));
    }
  }

  void _monument(Canvas c, double x, double y, double s) {
    void px(double lx, double ly, double w, double h, Paint p) =>
        c.drawRect(Rect.fromLTWH(x + lx * s, y + ly * s, w * s, h * s), p);
    c.drawOval(Rect.fromCenter(center: Offset(x, y + 7 * s), width: 100 * s, height: 18 * s), _f(Colors.black, 0.12));
    px(-46, -10, 92, 12, _f(const Color(0xFFD8D0BE)));
    for (final cx in [-36, -18, 0, 18, 36]) {
      px(cx - 4, -54, 8, 44, _f(const Color(0xFFECE6D6)));
      px(cx - 4, -54, 2.4, 44, _f(_tint(const Color(0xFFECE6D6), 10)));
    }
    final ped = Path()
      ..moveTo(x - 50 * s, y - 54 * s)
      ..lineTo(x + 50 * s, y - 54 * s)
      ..lineTo(x, y - 78 * s)
      ..close();
    c.drawPath(ped, _f(const Color(0xFFC9BFA6)));
  }

  void _fountain(Canvas c, double x, double y, double s) {
    c.drawOval(Rect.fromCenter(center: Offset(x, y + 5 * s), width: 56 * s, height: 22 * s), _f(Colors.black, 0.1));
    c.drawOval(Rect.fromCenter(center: Offset(x, y + 2 * s), width: 54 * s, height: 24 * s), _f(const Color(0xFFAFC8D2)));
    c.drawOval(Rect.fromCenter(center: Offset(x, y), width: 44 * s, height: 20 * s), _f(const Color(0xFFBFE6F5)));
    c.drawOval(Rect.fromCenter(center: Offset(x, y - 1 * s), width: 24 * s, height: 11 * s), _f(const Color(0xFF9FD0EC)));
    c.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(x - 2.6 * s, y - 24 * s, 5.2 * s, 18 * s), Radius.circular(2 * s)), _f(const Color(0xFFCBD8DE)));
    c.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(x - 1.5 * s, y - 30 * s, 3 * s, 8 * s), Radius.circular(1.5 * s)), _f(const Color(0xFF9FD0EC)));
  }

  void _scooter(Canvas c, double x, double y, double s, Color color) {
    _shadow(c, x, y + 3 * s, 13 * s, 3 * s);
    for (final dx in [-9, 9]) {
      c.drawCircle(Offset(x + dx * s, y), 4.5 * s, _f(const Color(0xFF3F3B37)));
      c.drawCircle(Offset(x + dx * s, y), 1.6 * s, _f(const Color(0xFF7E7873)));
    }
    c.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(x - 9 * s, y - 8 * s, 14 * s, 6 * s), Radius.circular(3 * s)), _f(color));
    c.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(x + 7 * s, y - 18 * s, 2.4 * s, 14 * s), Radius.circular(1 * s)), _f(_shade(color, 20)));
    c.drawLine(Offset(x + 6 * s, y - 18 * s), Offset(x + 11 * s, y - 18 * s), _s(const Color(0xFF3F3B37), 2 * s));
  }

  void _cycle(Canvas c, double x, double y, double s, Color color) {
    _shadow(c, x, y + 3 * s, 13 * s, 3 * s);
    for (final dx in [-9, 9]) {
      c.drawCircle(Offset(x + dx * s, y), 6 * s, _s(const Color(0xFF3F3B37), 1.6 * s));
      c.drawCircle(Offset(x + dx * s, y), 1.2 * s, _f(const Color(0xFF3F3B37)));
    }
    final frame = Path()
      ..moveTo(x - 9 * s, y)
      ..lineTo(x, y - 9 * s)
      ..lineTo(x + 9 * s, y)
      ..moveTo(x, y - 9 * s)
      ..lineTo(x - 2 * s, y);
    c.drawPath(frame, _s(color, 2 * s));
    c.drawLine(Offset(x + 7 * s, y - 13 * s), Offset(x + 11 * s, y - 13 * s), _s(_shade(color, 10), 2 * s));
  }

  void _shop(Canvas c, double x, double y, double s, String label, Color wall, Color roof) {
    void rect(double lx, double ly, double w, double h, Paint p, [double r = 0]) {
      final rr = Rect.fromLTWH(x + lx * s, y + ly * s, w * s, h * s);
      r > 0 ? c.drawRRect(RRect.fromRectAndRadius(rr, Radius.circular(r * s)), p) : c.drawRect(rr, p);
    }
    c.drawOval(Rect.fromCenter(center: Offset(x, y + 6 * s), width: 80 * s, height: 14 * s), _f(Colors.black, 0.12));
    // wall
    rect(-32, -50, 64, 50, _f(wall), 3);
    rect(-32, -50, 18, 50, _f(_tint(wall, 12), 0.5), 3);
    // roof
    final roofP = Path()
      ..moveTo(x - 36 * s, y - 50 * s)
      ..lineTo(x + 36 * s, y - 50 * s)
      ..lineTo(x + 28 * s, y - 64 * s)
      ..lineTo(x - 28 * s, y - 64 * s)
      ..close();
    c.drawPath(roofP, _f(roof));
    // awning stripes
    for (var i = 0; i < 6; i++) {
      rect(-32 + i * 11, -22, 11, 6, _f(i.isEven ? roof : _tint(roof, 30)));
    }
    // door + windows
    rect(-8, -22, 16, 22, _f(_shade(wall, 24)), 2);
    rect(-22, -40, 12, 10, _f(const Color(0xFFBFE0F2)), 1);
    rect(10, -40, 12, 10, _f(const Color(0xFFBFE0F2)), 1);
    // label sign
    rect(-20, -58, 40, 8, _f(Colors.white.withValues(alpha: 0.92).withValues(alpha: 1)), 2);
    final tp = TextPainter(
      text: TextSpan(text: label, style: TextStyle(color: _shade(roof, 20), fontSize: 6 * s, fontWeight: FontWeight.w900, letterSpacing: 0.5)),
      textDirection: TextDirection.ltr,
    )..layout();
    tp.paint(c, Offset(x - tp.width / 2, y - 57 * s));
  }

  @override
  bool shouldRepaint(covariant TownDecorPainter old) => old.night != night || old.decor != decor;
}
