import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

/// Placeholder for the English Town map (the centerpiece, migrated in a later
/// phase — see FLUTTER_MIGRATION_PLAN.md task: map screen + scenes).
class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFFFDF6EC),
      child: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: const [
            Text('🗺️', style: TextStyle(fontSize: 64)),
            SizedBox(height: 12),
            Text('English Town map',
                style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w800,
                    color: AppColors.ink)),
            SizedBox(height: 6),
            Text('Coming next in the migration',
                style: TextStyle(color: AppColors.grey)),
          ],
        ),
      ),
    );
  }
}
