import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

enum TabKey { home, membership, aicall, progress }

/// SpeakX-style bottom navigation (Home · Membership · AI Call · Progress).
/// Selected tab is orange with a soft glow; AI Call is a filled orange CTA.
class BottomTabBar extends StatelessWidget {
  const BottomTabBar({super.key, required this.active, required this.onChange});

  final TabKey active;
  final ValueChanged<TabKey> onChange;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: Color(0xFFF0F1F3))),
        boxShadow: [
          BoxShadow(
            color: Color(0x0F000000),
            blurRadius: 10,
            offset: Offset(0, -3),
          ),
        ],
      ),
      padding: const EdgeInsets.only(top: 8, bottom: 14),
      child: SafeArea(
        top: false,
        child: Row(
          children: [
            _item(TabKey.home, 'Home', Icons.home_outlined),
            _item(TabKey.membership, 'Membership', Icons.workspace_premium_outlined),
            _item(TabKey.aicall, 'AI Call', Icons.phone),
            _item(TabKey.progress, 'Progress', Icons.bar_chart_rounded),
          ],
        ),
      ),
    );
  }

  Widget _item(TabKey key, String label, IconData icon) {
    final on = active == key;
    final color = on ? AppColors.primary : AppColors.grey;

    if (key == TabKey.aicall) {
      // Always a filled orange phone CTA.
      return Expanded(
        child: InkWell(
          onTap: () => onChange(key),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: const BoxDecoration(
                  color: AppColors.primary,
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.phone, color: Colors.white, size: 20),
              ),
              const SizedBox(height: 3),
              Text(label,
                  style: TextStyle(
                      fontSize: 11.5, fontWeight: FontWeight.w700, color: color)),
            ],
          ),
        ),
      );
    }

    return Expanded(
      child: InkWell(
        onTap: () => onChange(key),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            SizedBox(
              height: 30,
              child: Stack(
                alignment: Alignment.center,
                children: [
                  if (on)
                    Container(
                      width: 46,
                      height: 30,
                      decoration: BoxDecoration(
                        color: AppColors.primary.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                  Icon(icon, color: color, size: 26),
                ],
              ),
            ),
            const SizedBox(height: 3),
            Text(label,
                style: TextStyle(
                    fontSize: 11.5, fontWeight: FontWeight.w700, color: color)),
          ],
        ),
      ),
    );
  }
}
