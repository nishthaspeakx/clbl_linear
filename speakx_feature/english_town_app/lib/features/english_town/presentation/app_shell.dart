import 'package:flutter/material.dart';

import '../application/avatar_controller.dart';
import '../application/reward_controller.dart';
import 'screens/ai_call_screen.dart';
import 'screens/membership_screen.dart';
import 'screens/progress_screen.dart';
import 'screens/town_map_screen.dart';
import 'widgets/bottom_tab_bar.dart';

/// The app shell — a state-driven 4-tab switcher (Home · Membership · AI Call ·
/// Progress), ported from the prototype's AppTabs. Uses IndexedStack so each
/// tab keeps its state across switches (the prototype keeps Home mounted too).
class AppShell extends StatefulWidget {
  const AppShell({
    super.key,
    required this.avatarController,
    required this.rewardController,
  });

  final AvatarController avatarController;
  final RewardController rewardController;

  @override
  State<AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<AppShell> {
  TabKey _tab = TabKey.home;

  static const _order = [
    TabKey.home,
    TabKey.membership,
    TabKey.aicall,
    TabKey.progress,
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: IndexedStack(
        index: _order.indexOf(_tab),
        children: [
          TownMapScreen(
            avatarController: widget.avatarController,
            rewardController: widget.rewardController,
          ),
          const MembershipScreen(),
          const AICallScreen(),
          const ProgressScreen(),
        ],
      ),
      bottomNavigationBar: BottomTabBar(
        active: _tab,
        onChange: (t) => setState(() => _tab = t),
      ),
    );
  }
}
