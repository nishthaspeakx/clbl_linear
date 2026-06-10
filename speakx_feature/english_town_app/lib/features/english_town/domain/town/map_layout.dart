import 'dart:math' as math;
import 'dart:ui';

import 'subtopics.dart';
import 'topic_zones.dart';

/// Vertical world layout — port of src/utils/mapLayout.ts.
/// Deterministic. Lessons run bottom → top along one winding road.
class LayoutLesson {
  final int id;
  final double px;
  final double py;
  final int topicIndex;
  const LayoutLesson(this.id, this.px, this.py, this.topicIndex);
  Offset get pos => Offset(px, py);
}

class LayoutZone {
  final int topicIndex;
  final String name;
  final Color accent;
  final Color groundTop;
  final Color groundBottom;
  final double top;
  final double bottom;
  final double signY;
  const LayoutZone(this.topicIndex, this.name, this.accent, this.groundTop,
      this.groundBottom, this.top, this.bottom, this.signY);
  double get height => bottom - top;
}

enum DecorKind { tree, bush, flower, hedge, lamp, shop, pond, flowerbed, bench, car, monument, fountain, scooter, cycle }

class Decor {
  final DecorKind kind;
  final double x;
  final double y;
  final double s;
  final double w;
  final Color color;
  final String shopLabel;
  final Color shopWall;
  final Color shopRoof;
  const Decor(this.kind, this.x, this.y,
      {this.s = 1, this.w = 0, this.color = const Color(0xFF7CB257), this.shopLabel = '', this.shopWall = const Color(0xFFF3DDB6), this.shopRoof = const Color(0xFFC0533B)});
}

class TownLayout {
  final double worldW;
  final double worldH;
  final List<LayoutLesson> lessons;
  final List<LayoutZone> zones;
  final Path roadPath;
  final List<Decor> decor;
  const TownLayout(
      this.worldW, this.worldH, this.lessons, this.zones, this.roadPath, this.decor);

  Offset lessonPos(int id) => lessons[id - 1].pos;
}

const _flowerColors = [Color(0xFFE0699A), Color(0xFFFFD24C), Color(0xFF7E6BD0), Color(0xFFE0764B), Color(0xFFFF9FC0)];
const _carColors = [Color(0xFFE0764B), Color(0xFF5BA6C9), Color(0xFF7FB04F), Color(0xFFE0A526)];
const _features = [DecorKind.flowerbed, DecorKind.pond, DecorKind.bench, DecorKind.car];
const _shops = [
  (label: 'BAKERY', wall: Color(0xFFF3DDB6), roof: Color(0xFFC0533B)),
  (label: 'BOOKS', wall: Color(0xFFDCE6F0), roof: Color(0xFF6F9BC0)),
  (label: 'TOYS', wall: Color(0xFFFAD9E2), roof: Color(0xFFE0699A)),
  (label: 'FRUITS', wall: Color(0xFFE7EFD6), roof: Color(0xFF7FB04F)),
  (label: 'SALON', wall: Color(0xFFF3E0EC), roof: Color(0xFFC77FB0)),
  (label: 'PHARMA', wall: Color(0xFFE6F4EC), roof: Color(0xFF3BB273)),
];
List<Decor> _buildDecor(double worldW, List<LayoutLesson> lessons) {
  final d = <Decor>[];
  for (var i = 0; i < lessons.length; i++) {
    final s = kSubtopics[i];
    final py = lessons[i].py;
    final px = lessons[i].px;
    final side = i == 0 || i == 6 ? 'center' : (s.xPercent > 50 ? 'left' : 'right');
    final isCenter = side == 'center';
    if (isCenter) {
      d.add(Decor(DecorKind.monument, worldW * 0.15, py - 6, s: worldW / 480));
      d.add(Decor(DecorKind.tree, worldW * 0.04, py - 26, s: 1.2));
      d.add(Decor(DecorKind.fountain, worldW * 0.85, py - 2, s: worldW / 430));
      d.add(Decor(DecorKind.tree, worldW * 0.96, py - 26, s: 1.2));
      d.add(Decor(DecorKind.hedge, 0, py + 72, s: 1, w: worldW * 0.14));
      d.add(Decor(DecorKind.hedge, worldW * 0.86, py + 72, s: 1, w: worldW * 0.14));
    } else {
      final gx = side == 'left' ? 0.88 : 0.12;
      final opp = gx < 0.5;
      if (i % 2 == 0) {
        final shop = _shops[(i ~/ 2) % _shops.length];
        d.add(Decor(DecorKind.shop, worldW * (opp ? 0.16 : 0.84), py - 10,
            s: worldW / 470, shopLabel: shop.label, shopWall: shop.wall, shopRoof: shop.roof));
        d.add(Decor(DecorKind.flower, worldW * (opp ? 0.06 : 0.94), py + 22, s: 1, color: _flowerColors[i % _flowerColors.length]));
      } else {
        final feat = _features[i % _features.length];
        d.add(Decor(feat, worldW * (opp ? 0.16 : 0.84), py - 2,
            s: feat == DecorKind.car ? 0.95 : 1, color: _carColors[i % _carColors.length]));
        d.add(Decor(DecorKind.tree, worldW * (opp ? 0.06 : 0.94), py - 24, s: 1.15));
      }
      d.add(Decor(DecorKind.bush, worldW * (opp ? gx + 0.04 : gx - 0.04), py + 44, s: 0.75));
      d.add(Decor(DecorKind.hedge, worldW * (opp ? 0 : 0.86), py + 72, s: 1, w: worldW * 0.14));
    }
    d.add(Decor(DecorKind.lamp, px - 46, py + 16, s: 0.95));
    d.add(Decor(DecorKind.lamp, px + 46, py + 16, s: 0.95));
    // Parked scooter/cycle only beside OUTDOOR scenes (interiors = a '-' in the
    // location name, e.g. "Home - Kitchen", or restaurant interiors).
    final isInterior = s.location.contains('-');
    if (!isInterior && i % 3 == 0) d.add(Decor(DecorKind.scooter, px - 52, py + 38, s: 0.7, color: _carColors[(i + 1) % _carColors.length]));
    if (!isInterior && i % 3 == 2) d.add(Decor(DecorKind.cycle, px + 52, py + 38, s: 0.7, color: _carColors[i % _carColors.length]));
  }
  return d;
}

const double _step = 250;
const double _topicGap = 96;
const double _bottomPad = 132;
const double _topPad = 210;

TownLayout buildTownLayout(double screenW) {
  final worldW = math.max(380.0, screenW);
  final n = kSubtopics.length;

  // Pass 1: y-from-bottom with a gap at each topic change.
  final yfb = List<double>.filled(n, 0);
  var cur = _bottomPad;
  for (var i = 0; i < n; i++) {
    if (i > 0 && kSubtopics[i].topicIndex != kSubtopics[i - 1].topicIndex) {
      cur += _topicGap;
    }
    yfb[i] = cur;
    cur += _step;
  }
  cur += _topPad;
  final worldH = cur;
  double toY(double fb) => worldH - fb;

  final lessons = List.generate(n, (i) {
    final s = kSubtopics[i];
    return LayoutLesson(
        s.id, (s.xPercent / 100) * worldW, toY(yfb[i]), s.topicIndex);
  });

  final road = _buildCurvedPath([for (final l in lessons) l.pos]);
  final decor = _buildDecor(worldW, lessons);

  // Topic ground bands (present topics, in order).
  final order = <int>[];
  for (final s in kSubtopics) {
    if (!order.contains(s.topicIndex)) order.add(s.topicIndex);
  }
  final firstY = <int, double>{};
  final lastY = <int, double>{};
  for (final l in lessons) {
    firstY.putIfAbsent(l.topicIndex, () => l.py); // entry (largest py)
    lastY[l.topicIndex] = l.py; // exit (smallest py)
  }
  final zones = <LayoutZone>[];
  for (var idx = 0; idx < order.length; idx++) {
    final ti = order[idx];
    final theme = topicZoneOf(ti);
    final bottom =
        idx == 0 ? worldH : (lastY[order[idx - 1]]! + firstY[ti]!) / 2;
    final top = idx == order.length - 1
        ? 0.0
        : (lastY[ti]! + firstY[order[idx + 1]]!) / 2;
    final signY = math.min(bottom - 24, firstY[ti]! + 96);
    zones.add(LayoutZone(ti, theme.name, theme.accent, theme.groundTop,
        theme.groundBottom, top, bottom, signY));
  }

  return TownLayout(worldW, worldH, lessons, zones, road, decor);
}

/// Catmull-Rom → cubic Bézier smooth path through all pins (port of
/// buildCurvedPath in src/utils/position.ts).
Path _buildCurvedPath(List<Offset> pts) {
  final path = Path();
  if (pts.isEmpty) return path;
  path.moveTo(pts[0].dx, pts[0].dy);
  if (pts.length == 1) return path;
  for (var i = 0; i < pts.length - 1; i++) {
    final p0 = i - 1 >= 0 ? pts[i - 1] : pts[i];
    final p1 = pts[i];
    final p2 = pts[i + 1];
    final p3 = i + 2 < pts.length ? pts[i + 2] : p2;
    final cp1 = Offset(p1.dx + (p2.dx - p0.dx) / 6, p1.dy + (p2.dy - p0.dy) / 6);
    final cp2 = Offset(p2.dx - (p3.dx - p1.dx) / 6, p2.dy - (p3.dy - p1.dy) / 6);
    path.cubicTo(cp1.dx, cp1.dy, cp2.dx, cp2.dy, p2.dx, p2.dy);
  }
  return path;
}

double clampD(double v, double lo, double hi) => math.min(math.max(v, lo), hi);
