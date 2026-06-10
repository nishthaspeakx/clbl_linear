import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

/// Visual prototype of the SpeakX "Membership" tab.
/// SPEAKX PREMIUM header, Proficiency Progress chart, Subscription Details.
class MembershipScreen extends StatelessWidget {
  const MembershipScreen({super.key});

  static const _levels = ['Beginner', 'Rising Voice', 'Good Talker', 'Star Speaker'];

  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppColors.bg,
      child: ListView(
        padding: const EdgeInsets.fromLTRB(16, 56, 16, 110),
        children: [
          // Top row
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: const [
                      Text('SPEAKX ',
                          style: TextStyle(
                              fontSize: 19,
                              fontWeight: FontWeight.w900,
                              color: AppColors.ink,
                              letterSpacing: 0.5)),
                      Text('👑 ', style: TextStyle(fontSize: 16)),
                      Text('PREMIUM',
                          style: TextStyle(
                              fontSize: 19,
                              fontWeight: FontWeight.w900,
                              color: AppColors.primary,
                              letterSpacing: 0.5)),
                    ],
                  ),
                  const SizedBox(height: 4),
                  const Text('Membership active till 10 Jun 2026',
                      style: TextStyle(
                          fontSize: 12,
                          color: Color(0xFF8A9097),
                          fontWeight: FontWeight.w600)),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: const Color(0xFFECEDEF)),
                ),
                child: const Text('💬 Chat with us',
                    style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: AppColors.primary)),
              ),
            ],
          ),
          const SizedBox(height: 18),

          // Proficiency Progress card
          _card(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Proficiency Progress',
                    style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w800,
                        color: AppColors.ink)),
                const SizedBox(height: 4),
                const Text('Your speaking level grows as you practice every day.',
                    style: TextStyle(fontSize: 12.5, color: AppColors.grey)),
                const SizedBox(height: 6),
                SizedBox(
                  height: 190,
                  child: CustomPaint(
                    size: Size.infinite,
                    painter: _ProficiencyPainter(),
                  ),
                ),
                Row(
                  children: List.generate(_levels.length, (i) {
                    return Expanded(
                      child: Text(
                        _levels[i],
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 10.5,
                          fontWeight: FontWeight.w700,
                          color: i == 0 ? AppColors.primary : AppColors.grey,
                        ),
                      ),
                    );
                  }),
                ),
              ],
            ),
          ),

          const SizedBox(height: 24),
          const Text('Subscription Details',
              style: TextStyle(
                  fontSize: 16, fontWeight: FontWeight.w800, color: AppColors.ink)),
          const SizedBox(height: 12),

          // Subscription card
          _card(
            radius: 18,
            padding: 14,
            child: Row(
              children: [
                Container(
                  width: 46,
                  height: 46,
                  decoration: BoxDecoration(
                    color: AppColors.tintOrange,
                    borderRadius: BorderRadius.circular(14),
                  ),
                  alignment: Alignment.center,
                  child: const Text('🎟️', style: TextStyle(fontSize: 22)),
                ),
                const SizedBox(width: 12),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Trial Plan',
                          style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w800,
                              color: AppColors.ink)),
                      SizedBox(height: 2),
                      Text('₹2 · billed monthly',
                          style: TextStyle(fontSize: 12, color: AppColors.grey)),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 11, vertical: 6),
                  decoration: BoxDecoration(
                    color: AppColors.greenPillBg,
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: const Text('6 days left',
                      style: TextStyle(
                          fontSize: 11.5,
                          fontWeight: FontWeight.w800,
                          color: AppColors.greenPillText)),
                ),
              ],
            ),
          ),

          const SizedBox(height: 22),
          Container(
            decoration: BoxDecoration(
              color: AppColors.primary,
              borderRadius: BorderRadius.circular(18),
              boxShadow: [
                BoxShadow(
                  color: AppColors.primary.withValues(alpha: 0.3),
                  blurRadius: 12,
                  offset: const Offset(0, 6),
                ),
              ],
            ),
            padding: const EdgeInsets.symmetric(vertical: 16),
            alignment: Alignment.center,
            child: const Text('Upgrade Plan',
                style: TextStyle(
                    color: Colors.white, fontSize: 16, fontWeight: FontWeight.w800)),
          ),
        ],
      ),
    );
  }

  Widget _card({required Widget child, double radius = 20, double padding = 18}) {
    return Container(
      padding: EdgeInsets.all(padding),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(radius),
        boxShadow: const [
          BoxShadow(
              color: Color(0x0D000000), blurRadius: 12, offset: Offset(0, 4)),
        ],
      ),
      child: child,
    );
  }
}

/// Rising dashed curve with 4 milestones + gold star on the last — ported from
/// the prototype's react-native-svg ProficiencyChart (viewBox 0 0 360 190).
class _ProficiencyPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final sx = size.width / 360.0;
    final sy = size.height / 190.0;
    Offset p(double x, double y) => Offset(x * sx, y * sy);

    final pts = [p(46, 150), p(142, 116), p(238, 78), p(318, 40)];

    final path = Path()
      ..moveTo(pts[0].dx, pts[0].dy)
      ..cubicTo(100 * sx, 150 * sy, 110 * sx, 120 * sy, pts[1].dx, pts[1].dy)
      ..cubicTo(174 * sx, 104 * sy, 200 * sx, 80 * sy, pts[2].dx, pts[2].dy)
      ..cubicTo(276 * sx, 60 * sy, 300 * sx, 50 * sy, pts[3].dx, pts[3].dy);

    final stroke = Paint()
      ..color = AppColors.primary
      ..style = PaintingStyle.stroke
      ..strokeWidth = 4
      ..strokeCap = StrokeCap.round;
    _drawDashed(canvas, path, stroke, 2, 9);

    for (var i = 0; i < pts.length; i++) {
      final r = i == 0 ? 9.0 : 6.0;
      canvas.drawCircle(
          pts[i], r, Paint()..color = i == 0 ? AppColors.primary : Colors.white);
      canvas.drawCircle(
          pts[i],
          r,
          Paint()
            ..color = AppColors.primary
            ..style = PaintingStyle.stroke
            ..strokeWidth = 3);
    }

    // gold star near the last milestone
    final star = Path();
    const starPts = [
      [318, 24], [322, 34], [333, 34], [324, 41], [327, 52],
      [318, 45], [309, 52], [312, 41], [303, 34], [314, 34],
    ];
    for (var i = 0; i < starPts.length; i++) {
      final o = p(starPts[i][0].toDouble(), starPts[i][1].toDouble());
      i == 0 ? star.moveTo(o.dx, o.dy) : star.lineTo(o.dx, o.dy);
    }
    star.close();
    canvas.drawPath(star, Paint()..color = const Color(0xFFFFC107));
    canvas.drawPath(
        star,
        Paint()
          ..color = const Color(0xFFE0A800)
          ..style = PaintingStyle.stroke
          ..strokeWidth = 1);
  }

  void _drawDashed(Canvas canvas, Path path, Paint paint, double dash, double gap) {
    for (final metric in path.computeMetrics()) {
      var dist = 0.0;
      while (dist < metric.length) {
        final next = dist + dash;
        canvas.drawPath(metric.extractPath(dist, next), paint);
        dist = next + gap;
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
