import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../application/avatar_controller.dart';
import '../../application/reward_controller.dart';
import '../../domain/avatar/avatar_profiles.dart';
import '../../domain/rewards/reward_items.dart';
import '../widgets/avatar_figure.dart';
import 'dream_home_editor_screen.dart';

/// "My World" rewards page (port of RewardsScreen.tsx core). Avatar identity,
/// next-reward card, 5 category tabs with progress, and a 2-column reward grid
/// with rarity styling. One-tap: wardrobe=Wear(single), lifestyle=Wear(toggle),
/// home/garden/vehicles=Claim(place). Dream-home editor is task #9.
class RewardsScreen extends StatefulWidget {
  const RewardsScreen({
    super.key,
    required this.avatarController,
    required this.rewardController,
    required this.completedCount,
    required this.level,
    required this.coins,
  });

  final AvatarController avatarController;
  final RewardController rewardController;
  final int completedCount;
  final int level;
  final int coins;

  @override
  State<RewardsScreen> createState() => _RewardsScreenState();
}

class _RewardsScreenState extends State<RewardsScreen> {
  RewardCategory _category = RewardCategory.wardrobe;
  String? _toast;

  AvatarController get _avatar => widget.avatarController;
  RewardController get _rewards => widget.rewardController;

  void _showToast(String m) {
    setState(() => _toast = m);
    Future.delayed(const Duration(milliseconds: 1700), () {
      if (mounted) setState(() => _toast = null);
    });
  }

  ({String title, String emoji}) _status(int level) {
    if (level >= 18) return (title: 'Star Speaker', emoji: '🌟');
    if (level >= 12) return (title: 'Good Talker', emoji: '💬');
    if (level >= 6) return (title: 'Rising Voice', emoji: '🔥');
    return (title: 'Beginner', emoji: '🌱');
  }

  @override
  Widget build(BuildContext context) {
    final sel = _avatar.selection;
    final items = visibleItems(_category, sel);
    final claimed = _rewards.claimedIds;

    return Scaffold(
      backgroundColor: AppColors.bg,
      body: SafeArea(
        child: Stack(
          children: [
            Column(
              children: [
                // header
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
                  child: Row(
                    children: [
                      GestureDetector(
                        onTap: () => Navigator.of(context).maybePop(),
                        child: const SizedBox(
                          width: 40,
                          child: Text('✕', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.ink)),
                        ),
                      ),
                      const Expanded(
                        child: Text('🎁  My World',
                            textAlign: TextAlign.center,
                            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Color(0xFF21242B))),
                      ),
                      const SizedBox(width: 40),
                    ],
                  ),
                ),
                Expanded(
                  child: ListView(
                    padding: const EdgeInsets.fromLTRB(14, 6, 14, 40),
                    children: [
                      _avatarCard(sel, claimed.length),
                      const SizedBox(height: 14),
                      _dreamHomeCard(),
                      const SizedBox(height: 14),
                      _nextRewardCard(),
                      const SizedBox(height: 18),
                      _tabs(sel, claimed),
                      const SizedBox(height: 16),
                      _sectionHead(items, claimed),
                      if (_category == RewardCategory.wardrobe)
                        const Padding(
                          padding: EdgeInsets.only(top: 2, bottom: 8),
                          child: Text("Showing outfits that suit your avatar's profile.",
                              style: TextStyle(fontSize: 11.5, color: AppColors.grey, fontWeight: FontWeight.w600)),
                        )
                      else
                        const SizedBox(height: 10),
                      _grid(items),
                    ],
                  ),
                ),
              ],
            ),
            if (_toast != null)
              Positioned(
                left: 0,
                right: 0,
                bottom: 24,
                child: IgnorePointer(
                  child: Center(
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                      decoration: BoxDecoration(
                          color: const Color(0xF221242B), borderRadius: BorderRadius.circular(12)),
                      child: Text(_toast!,
                          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 13)),
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _avatarCard(AvatarSelection sel, int collected) {
    final st = _status(widget.level);
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: const [BoxShadow(color: Color(0x0D000000), blurRadius: 12, offset: Offset(0, 4))],
      ),
      child: Row(
        children: [
          Container(
            width: 72,
            height: 72,
            decoration: BoxDecoration(
              color: const Color(0xFFFFF6EC),
              shape: BoxShape.circle,
              border: Border.all(color: const Color(0xFFFFE6CF), width: 1.5),
            ),
            clipBehavior: Clip.antiAlias,
            alignment: Alignment.bottomCenter,
            child: AvatarFigure(selection: sel, size: 64, shadow: false),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('${st.emoji}  ${st.title}',
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Color(0xFF21242B))),
                const SizedBox(height: 2),
                Text(profileLabel(sel),
                    style: const TextStyle(fontSize: 12, color: AppColors.grey, fontWeight: FontWeight.w600)),
                const SizedBox(height: 8),
                Row(
                  children: [
                    _statPill('🎁 $collected collected'),
                    const SizedBox(width: 8),
                    _statPill('🪙 ${widget.coins}'),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _dreamHomeCard() {
    final placed = _rewards.placements.length;
    final placeableTotal = kAllRewards
        .where((i) =>
            i.category == RewardCategory.home ||
            i.category == RewardCategory.garden ||
            i.category == RewardCategory.vehicles)
        .length;
    return GestureDetector(
      onTap: () async {
        await Navigator.of(context).push(MaterialPageRoute(
          fullscreenDialog: true,
          builder: (_) => DreamHomeEditorScreen(
            rewardController: _rewards,
            avatarController: _avatar,
            completedCount: widget.completedCount,
          ),
        ));
        if (mounted) setState(() {});
      },
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          gradient: const LinearGradient(colors: [Color(0xFF5B6CF0), Color(0xFF8A4FE0)]),
          borderRadius: BorderRadius.circular(20),
          boxShadow: [BoxShadow(color: const Color(0xFF5B6CF0).withValues(alpha: 0.3), blurRadius: 14, offset: const Offset(0, 6))],
        ),
        child: Row(
          children: [
            const Text('🏡', style: TextStyle(fontSize: 34)),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('My Dream Home',
                      style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w900)),
                  const SizedBox(height: 2),
                  Text('$placed of $placeableTotal items placed · tap to decorate',
                      style: const TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.w600)),
                ],
              ),
            ),
            const Text('✏️', style: TextStyle(fontSize: 20)),
          ],
        ),
      ),
    );
  }

  Widget _statPill(String text) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
        decoration: BoxDecoration(color: AppColors.bg, borderRadius: BorderRadius.circular(12)),
        child: Text(text, style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.w800, color: AppColors.ink)),
      );

  Widget _nextRewardCard() {
    final next = featuredRewardForLevel(widget.completedCount + 1);
    if (next == null) return const SizedBox.shrink();
    final rs = rarityStyle(next.rarity);
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        gradient: const LinearGradient(colors: [Color(0xFFFFF1E2), Color(0xFFFFF8F0)]),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFFFE0C0)),
      ),
      child: Row(
        children: [
          Container(
            width: 50,
            height: 50,
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14)),
            alignment: Alignment.center,
            child: Text(next.icon, style: const TextStyle(fontSize: 26)),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('NEXT REWARD',
                    style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: AppColors.primary, letterSpacing: 0.5)),
                const SizedBox(height: 2),
                Text(next.name,
                    style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: AppColors.ink)),
                Text('Unlocks at Level ${next.unlockLevel} · ${rs.label}',
                    style: TextStyle(fontSize: 11.5, color: rs.color, fontWeight: FontWeight.w700)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _tabs(AvatarSelection sel, Set<String> claimed) {
    return SizedBox(
      height: 78,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: rewardCategoryMeta.length,
        separatorBuilder: (_, _) => const SizedBox(width: 10),
        itemBuilder: (_, i) {
          final c = rewardCategoryMeta[i];
          final list = visibleItems(c.key, sel);
          final claimedN = list.where((it) => claimed.contains(it.id)).length;
          final on = _category == c.key;
          return GestureDetector(
            onTap: () => setState(() => _category = c.key),
            child: Container(
              width: 92,
              padding: const EdgeInsets.symmetric(vertical: 10),
              decoration: BoxDecoration(
                color: on ? AppColors.tintOrange : Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: on ? AppColors.primary : const Color(0xFFECEDEF), width: 1.5),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(c.icon, style: const TextStyle(fontSize: 22)),
                  const SizedBox(height: 4),
                  Text(c.name,
                      style: TextStyle(
                          fontSize: 11.5,
                          fontWeight: FontWeight.w800,
                          color: on ? AppColors.primary : AppColors.ink)),
                  Text('$claimedN/${list.length}',
                      style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: AppColors.grey)),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _sectionHead(List<RewardItem> items, Set<String> claimed) {
    final meta = rewardCategoryMeta.firstWhere((m) => m.key == _category);
    final claimedN = items.where((it) => claimed.contains(it.id)).length;
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text('${meta.icon}  ${meta.name}',
            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Color(0xFF21242B))),
        Text('$claimedN/${items.length} claimed',
            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: AppColors.grey)),
      ],
    );
  }

  Widget _grid(List<RewardItem> items) {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: items.length,
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        mainAxisSpacing: 12,
        crossAxisSpacing: 12,
        childAspectRatio: 0.92,
      ),
      itemBuilder: (_, i) => _card(items[i]),
    );
  }

  Widget _card(RewardItem item) {
    final unlocked = isItemUnlocked(item, widget.completedCount);
    final placeable = item.category == RewardCategory.home ||
        item.category == RewardCategory.garden ||
        item.category == RewardCategory.vehicles;
    final active = placeable
        ? _rewards.isPlaced(item.id)
        : item.category == RewardCategory.wardrobe
            ? _rewards.isWearingWardrobe(item.id)
            : _rewards.isWearingLifestyle(item.id);
    final rs = rarityStyle(item.rarity);

    String actionLabel() {
      if (!unlocked) return '🔒 Lvl ${item.unlockLevel}';
      if (placeable) return active ? 'Claimed ✓' : 'Claim';
      return active ? 'Wearing ✓' : 'Wear';
    }

    void onTap() {
      if (!unlocked) {
        _showToast('Complete Level ${item.unlockLevel} to unlock');
        return;
      }
      switch (item.category) {
        case RewardCategory.wardrobe:
          _rewards.wearWardrobe(item.id);
        case RewardCategory.lifestyle:
          _rewards.toggleLifestyle(item.id);
        default:
          if (!_rewards.isPlaced(item.id)) {
            _rewards.place(item.id);
            _showToast('${item.name} placed in your Dream Home');
          }
      }
      setState(() {});
    }

    return GestureDetector(
      onTap: onTap,
      child: Opacity(
        opacity: unlocked ? 1 : 0.55,
        child: Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: active ? AppColors.primary : rs.color.withValues(alpha: 0.4), width: active ? 2 : 1.5),
            boxShadow: rs.glow && unlocked
                ? [BoxShadow(color: rs.color.withValues(alpha: 0.25), blurRadius: 12, offset: const Offset(0, 4))]
                : const [BoxShadow(color: Color(0x0D000000), blurRadius: 8, offset: Offset(0, 3))],
          ),
          child: Column(
            children: [
              Align(
                alignment: Alignment.topRight,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                  decoration: BoxDecoration(color: rs.tint, borderRadius: BorderRadius.circular(8)),
                  child: Text(rs.sparkle ? '✨ ${rs.label}' : rs.label,
                      style: TextStyle(fontSize: 8.5, fontWeight: FontWeight.w900, color: rs.color)),
                ),
              ),
              const SizedBox(height: 2),
              Expanded(
                child: Center(
                  child: Text(unlocked ? item.icon : '🔒', style: const TextStyle(fontSize: 44)),
                ),
              ),
              Text(item.name,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: AppColors.ink)),
              const SizedBox(height: 8),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 8),
                decoration: BoxDecoration(
                  color: !unlocked
                      ? const Color(0xFFF1F2F4)
                      : active
                          ? AppColors.tintOrange
                          : AppColors.primary,
                  borderRadius: BorderRadius.circular(12),
                ),
                alignment: Alignment.center,
                child: Text(actionLabel(),
                    style: TextStyle(
                        fontSize: 12.5,
                        fontWeight: FontWeight.w900,
                        color: !unlocked
                            ? AppColors.grey
                            : active
                                ? AppColors.primary
                                : Colors.white)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
