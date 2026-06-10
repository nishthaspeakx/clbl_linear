import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

const double _topInset = 44;
const double kHeaderHeight = _topInset + 56;

/// SpeakX-style top bar on the Home (map) tab — language pill, A/अ translate
/// card, 🏆 trophy pill, coin pill. Port of src/components/AppHeader.tsx.
class AppHeader extends StatelessWidget {
  const AppHeader({super.key, required this.trophies, required this.coins});

  final int trophies;
  final int coins;

  @override
  Widget build(BuildContext context) {
    return Positioned(
      top: 0,
      left: 0,
      right: 0,
      height: kHeaderHeight,
      child: Container(
        padding: const EdgeInsets.fromLTRB(14, _topInset, 14, 0),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(bottom: Radius.circular(20)),
          boxShadow: [
            BoxShadow(color: Color(0x0F000000), blurRadius: 10, offset: Offset(0, 3)),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            _pill(
              border: true,
              child: Row(mainAxisSize: MainAxisSize.min, children: const [
                Text('हिं',
                    style: TextStyle(
                        fontSize: 15, fontWeight: FontWeight.w800, color: AppColors.ink)),
                SizedBox(width: 6),
                Text('▾', style: TextStyle(fontSize: 12, color: AppColors.grey)),
              ]),
            ),
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 7),
                  decoration: BoxDecoration(
                      color: const Color(0xFFF3EEFF),
                      borderRadius: BorderRadius.circular(12)),
                  child: Row(mainAxisSize: MainAxisSize.min, children: const [
                    Text('A',
                        style: TextStyle(
                            fontSize: 14, fontWeight: FontWeight.w900, color: Color(0xFF7C3AED))),
                    Text('/', style: TextStyle(fontSize: 13, color: Color(0xFFB9A4E8))),
                    Text('अ',
                        style: TextStyle(
                            fontSize: 14, fontWeight: FontWeight.w900, color: Color(0xFF7C3AED))),
                  ]),
                ),
                const SizedBox(width: 8),
                _pill(
                  border: true,
                  child: Row(mainAxisSize: MainAxisSize.min, children: [
                    const Text('🏆', style: TextStyle(fontSize: 14)),
                    const SizedBox(width: 4),
                    Text('$trophies',
                        style: const TextStyle(
                            fontSize: 14, fontWeight: FontWeight.w800, color: AppColors.ink)),
                  ]),
                ),
                const SizedBox(width: 8),
                _pill(
                  border: true,
                  child: Row(mainAxisSize: MainAxisSize.min, children: [
                    Container(
                      width: 18,
                      height: 18,
                      decoration: BoxDecoration(
                        color: const Color(0xFFFFB020),
                        shape: BoxShape.circle,
                        border: Border.all(color: const Color(0xFFE69100), width: 1.5),
                      ),
                      alignment: Alignment.center,
                      child: const Text('C',
                          style: TextStyle(
                              fontSize: 11, fontWeight: FontWeight.w900, color: Colors.white)),
                    ),
                    const SizedBox(width: 5),
                    Text('$coins',
                        style: const TextStyle(
                            fontSize: 14, fontWeight: FontWeight.w800, color: AppColors.ink)),
                  ]),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _pill({required Widget child, bool border = false}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: border ? Border.all(color: const Color(0xFFECEDEF), width: 1.5) : null,
      ),
      child: child,
    );
  }
}
