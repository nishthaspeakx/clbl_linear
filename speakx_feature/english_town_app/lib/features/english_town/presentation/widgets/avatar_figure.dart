import 'dart:math' as math;
import 'package:flutter/material.dart';

import '../../domain/avatar/avatar_profiles.dart';
import '../../domain/avatar/avatar_style.dart';

/// Parametric full-body avatar, ported from AvatarFigure.tsx (64×120 viewBox).
/// Renders all 18 personas + equip overlays (sunglasses/cap/shoes/jacket/
/// backpack). Replaces the emoji stand-in everywhere.
class AvatarFigure extends StatelessWidget {
  const AvatarFigure({
    super.key,
    required this.selection,
    this.size = 120,
    this.shadow = true,
    this.equipped = const {},
  });

  final AvatarSelection selection;
  final double size; // height in px
  final bool shadow;
  final Set<String> equipped; // 'sunglasses','cap','shoes','backpack','jacket'

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size * 64 / 120,
      height: size,
      child: CustomPaint(
        painter: _AvatarPainter(styleForSelection(selection), shadow, equipped),
      ),
    );
  }
}

class _AvatarPainter extends CustomPainter {
  _AvatarPainter(this.s, this.shadow, this.equipped);
  final AvatarStyle s;
  final bool shadow;
  final Set<String> equipped;

  static const double _cx = 32;

  @override
  void paint(Canvas canvas, Size size) {
    final k = size.height / 120.0;
    canvas.scale(k);

    if (shadow) {
      canvas.drawOval(
          Rect.fromCenter(center: const Offset(_cx, 117), width: 32, height: 7.2),
          Paint()..color = Colors.black.withValues(alpha: 0.12));
    }
    _backpack(canvas);
    _legs(canvas);
    _torso(canvas);
    _arms(canvas);
    _backpackStraps(canvas);
    _head(canvas);
    _heldAccessory(canvas);
    _equip(canvas);
  }

  Paint _fill(Color c, [double opacity = 1]) =>
      Paint()..color = c.withValues(alpha: opacity)..style = PaintingStyle.fill;
  Paint _stroke(Color c, double w, [double opacity = 1]) => Paint()
    ..color = c.withValues(alpha: opacity)
    ..style = PaintingStyle.stroke
    ..strokeWidth = w
    ..strokeCap = StrokeCap.round;

  void _rrect(Canvas c, double x, double y, double w, double h, double r, Paint p) =>
      c.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(x, y, w, h), Radius.circular(r)), p);

  Path _poly(List<Offset> pts) {
    final p = Path()..moveTo(pts.first.dx, pts.first.dy);
    for (final o in pts.skip(1)) {
      p.lineTo(o.dx, o.dy);
    }
    return p..close();
  }

  // ── Backpack ──
  void _backpack(Canvas c) {
    if (s.accessory != Accessory.backpack) return;
    _rrect(c, 17, 40, 30, 34, 7, _fill(shade(s.accent, 6)));
    _rrect(c, 20, 50, 24, 14, 4, _fill(tint(s.accent, 10), 0.6));
  }

  void _backpackStraps(Canvas c) {
    if (s.accessory != Accessory.backpack) return;
    final col = shade(s.accent, 14);
    final p1 = Path()..moveTo(24, 37)..quadraticBezierTo(22, 52, 24, 66);
    final p2 = Path()..moveTo(40, 37)..quadraticBezierTo(42, 52, 40, 66);
    canvas2(c, p1, _stroke(col, 2.6));
    canvas2(c, p2, _stroke(col, 2.6));
  }

  void canvas2(Canvas c, Path p, Paint paint) => c.drawPath(p, paint);

  // ── Legs ──
  void _legs(Canvas c) {
    if (s.bottomKind == BottomKind.sareeSkirt) {
      c.drawOval(Rect.fromCenter(center: const Offset(28, 116), width: 8, height: 4), _fill(shade(s.skin, 16)));
      c.drawOval(Rect.fromCenter(center: const Offset(36, 116), width: 8, height: 4), _fill(shade(s.skin, 16)));
      return;
    }
    final col = s.bottom;
    const shoe = Color(0xFF3A352F);
    _rrect(c, 25, 76, 6.5, 37, 3, _fill(col));
    _rrect(c, 32.5, 76, 6.5, 37, 3, _fill(shade(col, 12)));
    if (s.bottomKind == BottomKind.track) {
      c.drawRect(const Rect.fromLTWH(25.5, 78, 1.4, 33), _fill(Colors.white, 0.6));
      c.drawRect(const Rect.fromLTWH(37.6, 78, 1.4, 33), _fill(Colors.white, 0.6));
    }
    if (s.bottomKind == BottomKind.jeans) {
      c.drawLine(const Offset(28.2, 78), const Offset(28.2, 110), _stroke(shade(col, 20), 0.7));
    }
    final track = s.bottomKind == BottomKind.track;
    _rrect(c, 23.5, 112, 9, 5, 2.4, _fill(track ? Colors.white : shoe));
    _rrect(c, 31.5, 112, 9, 5, 2.4, _fill(track ? const Color(0xFFEDEDED) : const Color(0xFF2C2823)));
  }

  // ── Torso ──
  void _torso(Canvas c) {
    final t = s.top;
    switch (s.topKind) {
      case TopKind.saree:
        c.drawPath(_poly([const Offset(26, 52), const Offset(38, 52), const Offset(47, 114), const Offset(17, 114)]), _fill(t));
        c.drawPath(_poly([const Offset(26, 52), const Offset(38, 52), const Offset(41, 114), const Offset(23, 114)]), _fill(tint(t, 10), 0.5));
        for (final x in [28.0, 32.0, 36.0]) {
          c.drawLine(Offset(x, 70), Offset(x, 113), _stroke(shade(t, 18), 0.7, 0.6));
        }
        _rrect(c, 21, 36, 22, 18, 5, _fill(s.inner));
        c.drawPath(_poly([const Offset(20, 54), const Offset(30, 40), const Offset(46, 30), const Offset(50, 36), const Offset(30, 52), const Offset(24, 58)]), _fill(t));
        c.drawPath(_poly([const Offset(46, 30), const Offset(50, 36), const Offset(50, 70), const Offset(46, 66)]), _fill(shade(t, 10)));
        _rrect(c, 21, 36, 22, 3, 1.5, _fill(shade(t, 16), 0.5));
      case TopKind.kurta:
        _rrect(c, 19, 35, 26, 54, 7, _fill(t));
        _rrect(c, 19, 35, 9, 54, 7, _fill(tint(t, 12), 0.45));
        c.drawPath(_poly([const Offset(28, 36), const Offset(32, 44), const Offset(36, 36)]), _fill(s.inner));
        c.drawRect(const Rect.fromLTWH(31, 38, 2, 44), _fill(shade(t, 16)));
        c.drawLine(const Offset(20, 78), const Offset(20, 89), _stroke(shade(t, 20), 1));
        c.drawLine(const Offset(44, 78), const Offset(44, 89), _stroke(shade(t, 20), 1));
      case TopKind.hoodie:
        c.drawPath(
            (Path()
              ..moveTo(24, 33)
              ..quadraticBezierTo(32, 28, 40, 33)
              ..lineTo(38, 40)
              ..quadraticBezierTo(32, 36, 26, 40)
              ..close()),
            _fill(shade(t, 14)));
        _rrect(c, 18, 37, 28, 42, 7, _fill(t));
        _rrect(c, 24, 58, 16, 12, 4, _fill(shade(t, 12)));
        c.drawLine(const Offset(29, 38), const Offset(29, 48), _stroke(const Color(0xFFF4ECD8), 1.2));
        c.drawLine(const Offset(35, 38), const Offset(35, 48), _stroke(const Color(0xFFF4ECD8), 1.2));
      case TopKind.tshirt:
        _rrect(c, 19, 37, 26, 40, 8, _fill(t));
        c.drawPath((Path()..moveTo(27, 37)..quadraticBezierTo(32, 42, 37, 37)), _stroke(shade(t, 16), 1.4));
        _rrect(c, 19, 37, 8, 40, 7, _fill(tint(t, 14), 0.4));
      case TopKind.blazer:
      case TopKind.shirt:
        final isBlazer = s.topKind == TopKind.blazer;
        c.drawPath(_poly([const Offset(26, 36), const Offset(38, 36), const Offset(35, 60), const Offset(29, 60)]), _fill(s.inner));
        _rrect(c, 18.5, 35, 27, 44, 6, _fill(t));
        c.drawPath(_poly([const Offset(26, 35), const Offset(32, 52), const Offset(38, 35)]), _fill(s.inner));
        if (isBlazer) {
          c.drawPath(_poly([const Offset(26, 35), const Offset(32, 52), const Offset(28, 40)]), _fill(shade(t, 16)));
          c.drawPath(_poly([const Offset(38, 35), const Offset(32, 52), const Offset(36, 40)]), _fill(shade(t, 16)));
        }
        if (s.tie != null) {
          c.drawPath(_poly([const Offset(31, 40), const Offset(33, 40), const Offset(34, 58), const Offset(30, 58)]), _fill(s.tie!));
        } else if (!isBlazer) {
          c.drawLine(const Offset(32, 38), const Offset(32, 74), _stroke(shade(t, 16), 0.8));
          for (final y in [44.0, 54.0, 64.0]) {
            c.drawCircle(Offset(32, y), 0.9, _fill(shade(t, 22)));
          }
        }
        if (isBlazer) {
          c.drawCircle(const Offset(31, 60), 1, _fill(shade(t, 26)));
          c.drawCircle(const Offset(31, 66), 1, _fill(shade(t, 26)));
        }
        _rrect(c, 18.5, 35, 8, 44, 6, _fill(tint(t, 12), 0.4));
    }
  }

  // ── Arms ──
  void _arms(Canvas c) {
    final longSleeve = s.topKind != TopKind.tshirt;
    final sleeve = s.top;
    void arm(double x, bool right) {
      if (longSleeve) {
        _rrect(c, x, 38, 6, 30, 3, _fill(shade(sleeve, right ? 0 : 12)));
      } else {
        _rrect(c, x, 38, 6, 11, 3, _fill(shade(sleeve, right ? 0 : 10)));
        _rrect(c, x + 0.6, 48, 4.8, 18, 2.4, _fill(s.skin));
      }
      c.drawCircle(Offset(x + 3, 68), 2.6, _fill(s.skin));
    }

    arm(13.5, false);
    arm(44.5, true);
  }

  // ── Head ──
  void _head(Canvas c) {
    final skin = s.skin;
    if (s.hairStyle == HairStyle.long) {
      final p = Path()
        ..moveTo(21, 16)
        ..quadraticBezierTo(16, 30, 19, 48)
        ..lineTo(26, 48)
        ..quadraticBezierTo(23, 30, 25, 16)
        ..close()
        ..moveTo(43, 16)
        ..quadraticBezierTo(48, 30, 45, 48)
        ..lineTo(38, 48)
        ..quadraticBezierTo(41, 30, 39, 16)
        ..close();
      c.drawPath(p, _fill(s.grey ? const Color(0xFF5A5048) : shade(s.hair, 10)));
    }
    if (s.hairStyle == HairStyle.bun) {
      c.drawCircle(const Offset(_cx, 10), 5.6, _fill(s.grey ? const Color(0xFF6A625A) : s.hair));
    }
    _rrect(c, 28.5, 28, 7, 8, 2.5, _fill(shade(skin, 12)));
    c.drawCircle(const Offset(20.6, 21), 2.4, _fill(skin));
    c.drawCircle(const Offset(43.4, 21), 2.4, _fill(skin));
    if (s.hairStyle != HairStyle.short) {
      c.drawCircle(const Offset(20.6, 24.4), 1.1, _fill(const Color(0xFFF4D58A)));
      c.drawCircle(const Offset(43.4, 24.4), 1.1, _fill(const Color(0xFFF4D58A)));
    }
    c.drawCircle(const Offset(_cx, 19.5), 12.5, _fill(skin));
    c.drawOval(Rect.fromCenter(center: const Offset(27.5, 14.5), width: 10, height: 8), _fill(tint(skin, 16), 0.4));
    // hair cap
    final cap = Path()
      ..moveTo(19.5, 21)
      ..quadraticBezierTo(18, 5.5, 32, 5)
      ..quadraticBezierTo(46, 5.5, 44.5, 21)
      ..quadraticBezierTo(43, 16, 40, 13.5)
      ..quadraticBezierTo(36, 11.5, 32, 11.5)
      ..quadraticBezierTo(28, 11.5, 24, 13.5)
      ..quadraticBezierTo(21, 16, 19.5, 21)
      ..close();
    c.drawPath(cap, _fill(s.hair));
    if (s.grey) {
      c.drawPath((Path()..moveTo(20, 20)..quadraticBezierTo(21.5, 11, 27, 9)), _stroke(const Color(0xFFA7A099), 1.6));
      c.drawPath((Path()..moveTo(44, 20)..quadraticBezierTo(42.5, 11, 37, 9)), _stroke(const Color(0xFFA7A099), 1.6));
    }
    // eyes
    c.drawOval(Rect.fromCenter(center: const Offset(27.4, 20.5), width: 3.8, height: 4.8), _fill(Colors.white));
    c.drawOval(Rect.fromCenter(center: const Offset(36.6, 20.5), width: 3.8, height: 4.8), _fill(Colors.white));
    c.drawCircle(const Offset(27.6, 20.9), 1.4, _fill(const Color(0xFF2A2018)));
    c.drawCircle(const Offset(36.4, 20.9), 1.4, _fill(const Color(0xFF2A2018)));
    c.drawCircle(const Offset(28.1, 20.3), 0.5, _fill(Colors.white));
    c.drawCircle(const Offset(36.9, 20.3), 0.5, _fill(Colors.white));
    // eyebrows
    c.drawPath((Path()..moveTo(25, 16.6)..quadraticBezierTo(27.4, 15.2, 29.6, 16.4)), _stroke(shade(s.hair, 6), 1.2));
    c.drawPath((Path()..moveTo(34.4, 16.4)..quadraticBezierTo(36.6, 15.2, 39, 16.6)), _stroke(shade(s.hair, 6), 1.2));
    // nose
    c.drawPath((Path()..moveTo(32, 21.5)..quadraticBezierTo(32.9, 22.9, 31.4, 23.5)), _stroke(shade(skin, 28), 0.8));
    // cheeks
    c.drawCircle(const Offset(25, 24), 2, _fill(const Color(0xFFF7A8A0), 0.45));
    c.drawCircle(const Offset(39, 24), 2, _fill(const Color(0xFFF7A8A0), 0.45));
    // smile
    c.drawPath((Path()..moveTo(28, 25.4)..quadraticBezierTo(32, 29, 36, 25.4)), _stroke(const Color(0xFF9A5238), 1.5));
    if (s.bindi) c.drawCircle(const Offset(_cx, 13.5), 1.2, _fill(const Color(0xFFC0392B)));
  }

  // ── Held accessory ──
  void _heldAccessory(Canvas c) {
    final a = s.accent;
    switch (s.accessory) {
      case Accessory.backpack:
        return;
      case Accessory.laptopBag:
        c.drawPath((Path()..moveTo(22, 39)..lineTo(44, 62)), _stroke(shade(a, 10), 2.4));
        _rrect(c, 40, 58, 13, 14, 2.5, _fill(a));
        _rrect(c, 40, 58, 13, 4, 2, _fill(tint(a, 14)));
        _rrect(c, 45, 56, 3, 3, 1, _fill(shade(a, 16)));
      case Accessory.handbag:
        c.drawPath((Path()..moveTo(44, 56)..quadraticBezierTo(48, 53, 52, 56)), _stroke(shade(a, 12), 1.4));
        _rrect(c, 44, 56, 11, 9, 2, _fill(a));
        _rrect(c, 44, 56, 11, 3, 1.5, _fill(tint(a, 14)));
      case Accessory.shoppingBag:
        c.drawPath((Path()..moveTo(45, 56)..quadraticBezierTo(48.5, 52, 52, 56)), _stroke(shade(a, 14), 1.4));
        c.drawPath(_poly([const Offset(43, 58), const Offset(55, 58), const Offset(53.5, 72), const Offset(44.5, 72)]), _fill(a));
        c.drawRect(const Rect.fromLTWH(43, 58, 12, 3), _fill(tint(a, 12)));
      case Accessory.phone:
        _rrect(c, 45, 58, 5, 9, 1.4, _fill(a));
      case Accessory.tablet:
        c.save();
        c.translate(42, 64);
        c.rotate(-10 * math.pi / 180);
        c.translate(-42, -64);
        _rrect(c, 36, 56, 13, 17, 2, _fill(const Color(0xFF2C2E33)));
        _rrect(c, 37.4, 58, 10, 13, 1, _fill(tint(a, 30)));
        c.restore();
      case Accessory.book:
      case Accessory.notebook:
        c.save();
        c.translate(42, 65);
        c.rotate(-8 * math.pi / 180);
        c.translate(-42, -65);
        _rrect(c, 35, 56, 14, 18, 1.5, _fill(a));
        _rrect(c, 35, 56, 3.5, 18, 1, _fill(shade(a, 22)));
        for (final y in [60.0, 64.0, 68.0]) {
          c.drawLine(Offset(40, y), Offset(47, y - 1), _stroke(Colors.white, 0.7, 0.7));
        }
        c.restore();
    }
  }

  // ── Equip overlays ──
  void _equip(Canvas c) {
    if (equipped.isEmpty) return;
    const jacket = Color(0xFF46566B);
    final saree = s.bottomKind == BottomKind.sareeSkirt;
    if (equipped.contains('jacket')) {
      c.drawPath(_poly([const Offset(19.5, 36), const Offset(30, 39), const Offset(30, 78), const Offset(19.5, 78)]), _fill(jacket));
      c.drawPath(_poly([const Offset(44.5, 36), const Offset(34, 39), const Offset(34, 78), const Offset(44.5, 78)]), _fill(shade(jacket, 12)));
      _rrect(c, 13.2, 37, 6.6, 22, 3, _fill(jacket));
      _rrect(c, 44.2, 37, 6.6, 22, 3, _fill(shade(jacket, 12)));
    }
    if (equipped.contains('backpack')) {
      c.drawPath((Path()..moveTo(24, 37)..quadraticBezierTo(22, 52, 24, 66)), _stroke(const Color(0xFFC2410C), 2.6));
      c.drawPath((Path()..moveTo(40, 37)..quadraticBezierTo(42, 52, 40, 66)), _stroke(const Color(0xFFC2410C), 2.6));
    }
    if (equipped.contains('shoes') && !saree) {
      _rrect(c, 22.6, 111, 10.2, 6, 3, _fill(Colors.white));
      _rrect(c, 31, 111, 10.2, 6, 3, _fill(const Color(0xFFF1F1F1)));
      _rrect(c, 22.6, 115, 10.2, 2, 1, _fill(const Color(0xFFE1473D)));
      _rrect(c, 31, 115, 10.2, 2, 1, _fill(const Color(0xFFC53B32)));
    }
    if (equipped.contains('cap')) {
      final crown = Path()
        ..moveTo(20.4, 16)
        ..quadraticBezierTo(19, 5.2, 32, 4.8)
        ..quadraticBezierTo(45, 5.2, 43.6, 16)
        ..quadraticBezierTo(38, 11.2, 32, 11.2)
        ..quadraticBezierTo(26, 11.2, 20.4, 16)
        ..close();
      c.drawPath(crown, _fill(const Color(0xFFD23A34)));
      final brim = Path()
        ..moveTo(20.6, 15.4)
        ..quadraticBezierTo(32, 24, 43.4, 15.4)
        ..quadraticBezierTo(37.6, 18.8, 32, 19.2)
        ..quadraticBezierTo(26.4, 18.8, 20.6, 15.4)
        ..close();
      c.drawPath(brim, _fill(const Color(0xFF8E1A16)));
    }
    if (equipped.contains('sunglasses')) {
      _rrect(c, 23.4, 18.4, 7.4, 4.4, 2.2, _fill(const Color(0xFF23262B)));
      _rrect(c, 33.2, 18.4, 7.4, 4.4, 2.2, _fill(const Color(0xFF23262B)));
      _rrect(c, 30.6, 19.2, 2.8, 1.4, 0.7, _fill(const Color(0xFF23262B)));
    }
  }

  @override
  bool shouldRepaint(covariant _AvatarPainter old) =>
      old.s != s || old.equipped != equipped || old.shadow != shadow;
}
