import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

// ── ExerciseHeader ──────────────────────────────────────────────────────────
class ExerciseHeader extends StatelessWidget {
  const ExerciseHeader({
    super.key,
    required this.progress,
    required this.coins,
    required this.onClose,
  });
  final double progress; // 0..1
  final int coins;
  final VoidCallback onClose;

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.fromLTRB(16, 44, 16, 10),
      child: Row(
        children: [
          GestureDetector(
            onTap: onClose,
            child: const SizedBox(
              width: 26,
              height: 26,
              child: Center(
                child: Text('✕',
                    style: TextStyle(
                        fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.ink)),
              ),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: ClipRRect(
              borderRadius: BorderRadius.circular(5),
              child: TweenAnimationBuilder<double>(
                tween: Tween(begin: 0, end: progress.clamp(0, 1)),
                duration: const Duration(milliseconds: 380),
                curve: Curves.easeOutCubic,
                builder: (_, v, _) => LinearProgressIndicator(
                  value: v,
                  minHeight: 8,
                  backgroundColor: const Color(0xFFEFEFF1),
                  valueColor: const AlwaysStoppedAnimation(AppColors.primary),
                ),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Container(
            width: 32,
            height: 32,
            decoration: const BoxDecoration(color: Color(0xFF6C4BD8), shape: BoxShape.circle),
            alignment: Alignment.center,
            child: Row(mainAxisSize: MainAxisSize.min, children: const [
              Text('अ', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 11)),
              Text('A', style: TextStyle(color: Color(0xFFD8CCF5), fontWeight: FontWeight.w900, fontSize: 9)),
            ]),
          ),
          const SizedBox(width: 10),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFEEEFF1), width: 1.5),
            ),
            child: Row(mainAxisSize: MainAxisSize.min, children: [
              _coinDot(),
              const SizedBox(width: 4),
              Text('$coins',
                  style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 14, color: AppColors.ink)),
            ]),
          ),
        ],
      ),
    );
  }
}

Widget _coinDot({double size = 18}) => Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: const Color(0xFFFFC02E),
        shape: BoxShape.circle,
        border: Border.all(color: const Color(0xFFE8A100), width: 1.5),
      ),
      alignment: Alignment.center,
      child: Text('C',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: size * 0.55)),
    );

// ── AudioButton (pulsing ripple) ────────────────────────────────────────────
class AudioButton extends StatefulWidget {
  const AudioButton({super.key, this.size = 76, this.onPlay});
  final double size;
  final VoidCallback? onPlay;
  @override
  State<AudioButton> createState() => _AudioButtonState();
}

class _AudioButtonState extends State<AudioButton> with TickerProviderStateMixin {
  late final AnimationController _ring =
      AnimationController(vsync: this, duration: const Duration(milliseconds: 1900))..repeat();
  late final AnimationController _press =
      AnimationController(vsync: this, duration: const Duration(milliseconds: 350));

  @override
  void dispose() {
    _ring.dispose();
    _press.dispose();
    super.dispose();
  }

  void _tap() {
    _press.forward(from: 0).then((_) => _press.reverse());
    widget.onPlay?.call();
  }

  @override
  Widget build(BuildContext context) {
    final s = widget.size;
    return GestureDetector(
      onTap: _tap,
      child: SizedBox(
        width: s + 28,
        height: s + 28,
        child: Stack(
          alignment: Alignment.center,
          children: [
            AnimatedBuilder(
              animation: _ring,
              builder: (_, _) => Opacity(
                opacity: (1 - _ring.value) * 0.45,
                child: Transform.scale(
                  scale: 0.7 + _ring.value * 0.7,
                  child: Container(
                    width: s,
                    height: s,
                    decoration: const BoxDecoration(color: Color(0xFFFFC894), shape: BoxShape.circle),
                  ),
                ),
              ),
            ),
            AnimatedBuilder(
              animation: _press,
              builder: (_, child) =>
                  Transform.scale(scale: 1 + _press.value * 0.12, child: child),
              child: Container(
                width: s,
                height: s,
                decoration: BoxDecoration(
                  color: AppColors.primary,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                        color: AppColors.primary.withValues(alpha: 0.4),
                        blurRadius: 12,
                        offset: const Offset(0, 6)),
                  ],
                ),
                child: const Icon(Icons.volume_up_rounded, color: Colors.white, size: 34),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ── OptionCard ──────────────────────────────────────────────────────────────
enum OptionState { idle, correct, wrong, dim }

class _OptColors {
  final Color border, bg, text;
  const _OptColors(this.border, this.bg, this.text);
}

const _optMap = {
  OptionState.idle: _OptColors(Color(0xFFE7E8EB), Colors.white, AppColors.ink),
  OptionState.correct: _OptColors(Color(0xFF33A867), Color(0xFFEAF7EE), Color(0xFF1F8B50)),
  OptionState.wrong: _OptColors(Color(0xFFE5484D), Color(0xFFFDECEC), Color(0xFFC0392B)),
  OptionState.dim: _OptColors(Color(0xFFEEEFF1), Color(0xFFFAFAFB), Color(0xFFB7BCC2)),
};

class OptionCard extends StatelessWidget {
  const OptionCard({
    super.key,
    required this.label,
    this.emoji,
    this.image = false,
    required this.state,
    this.disabled = false,
    required this.onPress,
  });
  final String label;
  final String? emoji;
  final bool image;
  final OptionState state;
  final bool disabled;
  final VoidCallback onPress;

  @override
  Widget build(BuildContext context) {
    final c = _optMap[state]!;
    final shaking = state == OptionState.wrong;
    final child = image ? _imageCard(c) : _textCard(c);
    // shake on wrong
    return TweenAnimationBuilder<double>(
      key: ValueKey(shaking),
      tween: Tween(begin: 0, end: shaking ? 1 : 0),
      duration: const Duration(milliseconds: 320),
      builder: (_, t, ch) {
        final dx = shaking ? math.sin(t * math.pi * 3) * 5 : 0.0;
        return Transform.translate(offset: Offset(dx, 0), child: ch);
      },
      child: child,
    );
  }

  Widget _textCard(_OptColors c) {
    return GestureDetector(
      onTap: disabled ? null : onPress,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 7),
        constraints: const BoxConstraints(minHeight: 60),
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
        decoration: BoxDecoration(
          color: c.bg,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: c.border, width: 2),
          boxShadow: const [
            BoxShadow(color: Color(0x0D000000), blurRadius: 8, offset: Offset(0, 3)),
          ],
        ),
        child: Stack(
          alignment: Alignment.center,
          children: [
            Text(label,
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: c.text)),
            if (state == OptionState.correct) const Positioned(right: 0, child: _Badge('✓', Color(0xFF33A867))),
            if (state == OptionState.wrong) const Positioned(right: 0, child: _Badge('✕', Color(0xFFE5484D))),
          ],
        ),
      ),
    );
  }

  Widget _imageCard(_OptColors c) {
    return GestureDetector(
        onTap: disabled ? null : onPress,
        child: Container(
          margin: const EdgeInsets.symmetric(horizontal: 7),
          padding: const EdgeInsets.symmetric(vertical: 16),
          decoration: BoxDecoration(
            color: c.bg,
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: c.border, width: 2),
            boxShadow: const [
              BoxShadow(color: Color(0x0D000000), blurRadius: 8, offset: Offset(0, 3)),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 76,
                height: 76,
                decoration: BoxDecoration(
                    color: const Color(0xFFF4F6F8), borderRadius: BorderRadius.circular(16)),
                alignment: Alignment.center,
                child: Text(emoji ?? '', style: const TextStyle(fontSize: 40)),
              ),
              const SizedBox(height: 10),
              Text(label, style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: c.text)),
            ],
          ),
        ),
      );
  }
}

class _Badge extends StatelessWidget {
  const _Badge(this.glyph, this.color);
  final String glyph;
  final Color color;
  @override
  Widget build(BuildContext context) => Container(
        width: 22,
        height: 22,
        decoration: BoxDecoration(color: color, shape: BoxShape.circle),
        alignment: Alignment.center,
        child: Text(glyph, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 12)),
      );
}

// ── StreakCelebration ───────────────────────────────────────────────────────
class StreakCelebration extends StatefulWidget {
  const StreakCelebration({super.key, required this.count});
  final int count;
  @override
  State<StreakCelebration> createState() => _StreakCelebrationState();
}

class _StreakCelebrationState extends State<StreakCelebration> with SingleTickerProviderStateMixin {
  late final AnimationController _c =
      AnimationController(vsync: this, duration: const Duration(milliseconds: 600))..forward();
  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final pop = CurvedAnimation(parent: _c, curve: Curves.elasticOut);
    return Positioned.fill(
      child: Container(
        color: Colors.white,
        child: Stack(
          children: [
            Positioned.fill(child: CustomPaint(painter: _RaysPainter())),
            Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  ScaleTransition(
                    scale: pop,
                    child: Text('${widget.count}',
                        style: const TextStyle(
                            fontSize: 96, fontWeight: FontWeight.w900, color: AppColors.primary, height: 1.05)),
                  ),
                  FadeTransition(
                    opacity: _c,
                    child: const Text('correct answers\nin a row',
                        textAlign: TextAlign.center,
                        style: TextStyle(fontSize: 26, fontWeight: FontWeight.w900, color: AppColors.ink)),
                  ),
                  const SizedBox(height: 26),
                  const Text('🎓🥳', style: TextStyle(fontSize: 72)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _RaysPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final cx = size.width / 2, cy = size.height * 0.28;
    final R = math.max(size.width, size.height);
    for (var i = 0; i < 12; i++) {
      final a0 = (i / 12) * math.pi * 2;
      final a1 = a0 + math.pi / 12;
      final path = Path()
        ..moveTo(cx, cy)
        ..lineTo(cx + math.cos(a0) * R, cy + math.sin(a0) * R)
        ..lineTo(cx + math.cos(a1) * R, cy + math.sin(a1) * R)
        ..close();
      canvas.drawPath(
          path, Paint()..color = (i.isEven ? const Color(0xFFFFD79C) : const Color(0xFFFFE3BE)).withValues(alpha: 0.35));
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

// ── ExerciseCompleteScreen ──────────────────────────────────────────────────
class ExerciseCompleteScreen extends StatefulWidget {
  const ExerciseCompleteScreen({
    super.key,
    required this.coins,
    required this.title,
    required this.subtitle,
    required this.ctaLabel,
    required this.onContinue,
  });
  final int coins;
  final String title;
  final String subtitle;
  final String ctaLabel;
  final VoidCallback onContinue;
  @override
  State<ExerciseCompleteScreen> createState() => _ExerciseCompleteScreenState();
}

class _ExerciseCompleteScreenState extends State<ExerciseCompleteScreen> with SingleTickerProviderStateMixin {
  late final AnimationController _c =
      AnimationController(vsync: this, duration: const Duration(milliseconds: 600))..forward();
  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final pop = CurvedAnimation(parent: _c, curve: Curves.elasticOut);
    return Positioned.fill(
      child: Container(
        color: Colors.white,
        child: Stack(
          children: [
            Positioned.fill(child: CustomPaint(painter: _ConfettiPainter())),
            Center(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 30),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    ScaleTransition(scale: pop, child: const Text('🥳', style: TextStyle(fontSize: 88))),
                    const SizedBox(height: 14),
                    FadeTransition(
                      opacity: _c,
                      child: Column(
                        children: [
                          Text(widget.title,
                              textAlign: TextAlign.center,
                              style: const TextStyle(
                                  fontSize: 26, fontWeight: FontWeight.w900, color: AppColors.ink)),
                          const SizedBox(height: 8),
                          Text(widget.subtitle,
                              textAlign: TextAlign.center,
                              style: const TextStyle(
                                  fontSize: 15, color: Color(0xFF8A9097), fontWeight: FontWeight.w600)),
                          const SizedBox(height: 18),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                            decoration: BoxDecoration(
                              color: const Color(0xFFFFF6E8),
                              borderRadius: BorderRadius.circular(18),
                              border: Border.all(color: const Color(0xFFFBE4B8), width: 1.5),
                            ),
                            child: Row(mainAxisSize: MainAxisSize.min, children: [
                              _coinDot(size: 20),
                              const SizedBox(width: 7),
                              Text('+${widget.coins} coins earned',
                                  style: const TextStyle(
                                      fontWeight: FontWeight.w900, fontSize: 15, color: Color(0xFFC8821A))),
                            ]),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            Positioned(
              left: 20,
              right: 20,
              bottom: 40,
              child: GestureDetector(
                onTap: widget.onContinue,
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 17),
                  decoration: BoxDecoration(
                    color: AppColors.primary,
                    borderRadius: BorderRadius.circular(18),
                    boxShadow: [
                      BoxShadow(
                          color: AppColors.primary.withValues(alpha: 0.35),
                          blurRadius: 14,
                          offset: const Offset(0, 8)),
                    ],
                  ),
                  alignment: Alignment.center,
                  child: Text(widget.ctaLabel,
                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 17)),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ConfettiPainter extends CustomPainter {
  static const _colors = [
    Color(0xFFFF7A00), Color(0xFF4FA3E3), Color(0xFF33A867),
    Color(0xFFE0699A), Color(0xFFFFC72C), Color(0xFF7E6BD0),
  ];
  @override
  void paint(Canvas canvas, Size size) {
    for (var i = 0; i < 46; i++) {
      final x = ((i * 53) % 100) / 100 * size.width;
      final y = ((i * 89) % 100) / 100 * (size.height * 0.82);
      final paint = Paint()..color = _colors[i % _colors.length].withValues(alpha: 0.95);
      if (i % 3 == 0) {
        canvas.save();
        canvas.translate(x + 4, y + 4);
        canvas.rotate(((i * 37) % 360) * math.pi / 180);
        canvas.drawRRect(
            RRect.fromRectAndRadius(const Rect.fromLTWH(-4.5, -4.5, 9, 9), const Radius.circular(2)), paint);
        canvas.restore();
      } else {
        canvas.drawCircle(Offset(x, y), 4.5, paint);
      }
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
