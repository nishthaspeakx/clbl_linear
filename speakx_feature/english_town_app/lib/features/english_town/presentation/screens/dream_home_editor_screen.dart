import 'dart:math' as math;
import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../application/avatar_controller.dart';
import '../../application/reward_controller.dart';
import '../../domain/rewards/reward_items.dart';
import '../widgets/avatar_figure.dart';

/// Dream Home decoration mode (port of DreamHomeEditorScreen.tsx). Tap an item
/// to select (orange glow), drag to reposition, resize/rotate/reset via the
/// toolbar; +/-/⟲ zoom the canvas; Add Item drawer for unlocked placeables not
/// yet placed. Positions persist as image percentages (+scale+rotation).
/// NOTE: the DREAM_HOME photo asset is stood in with an illustrated room;
/// pinch/pan is offered via +/- buttons (web can't pinch).
class DreamHomeEditorScreen extends StatefulWidget {
  const DreamHomeEditorScreen({
    super.key,
    required this.rewardController,
    required this.avatarController,
    required this.completedCount,
  });

  final RewardController rewardController;
  final AvatarController avatarController;
  final int completedCount;

  @override
  State<DreamHomeEditorScreen> createState() => _DreamHomeEditorScreenState();
}

class _DreamHomeEditorScreenState extends State<DreamHomeEditorScreen> {
  String? _selectedId;
  bool _drawerOpen = false;
  double _zoom = 1;

  RewardController get _rc => widget.rewardController;

  static const double _objBase = 46;
  static const double _minZoom = 1;
  static const double _maxZoom = 3;

  List<RewardItem> get _available => kAllRewards
      .where((i) =>
          (i.category == RewardCategory.home ||
              i.category == RewardCategory.garden ||
              i.category == RewardCategory.vehicles) &&
          isItemUnlocked(i, widget.completedCount) &&
          !_rc.isPlaced(i.id))
      .toList();

  void _setZoom(double t) => setState(() => _zoom = t.clamp(_minZoom, _maxZoom));

  @override
  Widget build(BuildContext context) {
    final placedIds = _rc.placements.keys.toList();
    final sel = _selectedId != null ? _rc.placements[_selectedId] : null;

    return Scaffold(
      backgroundColor: const Color(0xFF16181D),
      body: SafeArea(
        child: Column(
          children: [
            // top bar
            Padding(
              padding: const EdgeInsets.fromLTRB(14, 6, 14, 10),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  GestureDetector(
                    onTap: () => Navigator.of(context).maybePop(),
                    child: const SizedBox(
                      width: 64,
                      child: Text('←', style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.w800)),
                    ),
                  ),
                  const Text('🏡  Decorate Home',
                      style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w900)),
                  GestureDetector(
                    onTap: () => Navigator.of(context).maybePop(),
                    child: const SizedBox(
                      width: 64,
                      child: Text('Save',
                          textAlign: TextAlign.right,
                          style: TextStyle(color: Color(0xFFFF9A40), fontSize: 15, fontWeight: FontWeight.w900)),
                    ),
                  ),
                ],
              ),
            ),

            // canvas
            Expanded(
              child: Center(
                child: LayoutBuilder(
                  builder: (context, constraints) {
                    final w = math.min(constraints.maxWidth - 24, 420.0);
                    final h = math.min(w * 1.15, constraints.maxHeight - 24);
                    return Stack(
                      clipBehavior: Clip.none,
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(18),
                          child: SizedBox(
                            width: w,
                            height: h,
                            child: Transform.scale(
                              scale: _zoom,
                              child: GestureDetector(
                                onTap: () => setState(() => _selectedId = null),
                                child: Stack(
                                  children: [
                                    // illustrated room (stand-in for DREAM_HOME photo)
                                    Positioned.fill(child: CustomPaint(painter: _RoomPainter())),
                                    // placed items
                                    for (final id in placedIds)
                                      _buildPlaced(id, _rc.placements[id]!, w, h),
                                    // avatar (context only)
                                    Positioned(
                                      left: 0.44 * w - 22,
                                      top: 0.80 * h - 44,
                                      child: IgnorePointer(
                                        child: Container(
                                          width: 44,
                                          height: 56,
                                          decoration: const BoxDecoration(color: Colors.transparent),
                                          alignment: Alignment.bottomCenter,
                                          child: AvatarFigure(
                                              selection: widget.avatarController.selection, size: 56),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ),
                        // zoom controls
                        Positioned(
                          right: 10,
                          top: h / 2 - 78,
                          child: Column(
                            children: [
                              _zoomBtn('＋', () => _setZoom(_zoom + 0.5)),
                              _zoomBtn('－', () => _setZoom(_zoom - 0.5)),
                              _zoomBtn('⟲', () => _setZoom(1), color: AppColors.primary),
                            ],
                          ),
                        ),
                      ],
                    );
                  },
                ),
              ),
            ),

            // bottom: toolbar (selected) OR add-item + hint
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 6, 16, 16),
              child: sel != null ? _toolbar() : _addRow(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPlaced(String id, Placement p, double w, double h) {
    final item = rewardById(id);
    if (item == null) return const SizedBox.shrink();
    final size = _objBase * p.scale;
    final selected = _selectedId == id;
    return Positioned(
      left: p.xPercent / 100 * w - size / 2,
      top: p.yPercent / 100 * h - size / 2,
      child: GestureDetector(
        onTap: () => setState(() => _selectedId = id),
        onPanUpdate: (d) {
          // zoom-aware: screen delta → canvas delta → percent
          final dxPct = d.delta.dx / _zoom / w * 100;
          final dyPct = d.delta.dy / _zoom / h * 100;
          _rc.updatePlacement(id,
              xPercent: (p.xPercent + dxPct).clamp(0, 100),
              yPercent: (p.yPercent + dyPct).clamp(0, 100));
          setState(() {});
        },
        child: Transform.rotate(
          angle: p.rotation * math.pi / 180,
          child: Container(
            width: size,
            height: size,
            decoration: BoxDecoration(
              color: selected ? Colors.white : Colors.transparent,
              shape: BoxShape.circle,
              border: selected ? Border.all(color: AppColors.primary, width: 3) : null,
              boxShadow: selected
                  ? [BoxShadow(color: AppColors.primary.withValues(alpha: 0.5), blurRadius: 12)]
                  : null,
            ),
            alignment: Alignment.center,
            child: Text(item.icon, style: TextStyle(fontSize: size * 0.7)),
          ),
        ),
      ),
    );
  }

  Widget _zoomBtn(String label, VoidCallback onTap, {Color color = const Color(0xFF21242B)}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 44,
        height: 44,
        margin: const EdgeInsets.only(bottom: 10),
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.94),
          borderRadius: BorderRadius.circular(14),
          boxShadow: const [BoxShadow(color: Color(0x4D000000), blurRadius: 8, offset: Offset(0, 3))],
        ),
        alignment: Alignment.center,
        child: Text(label, style: TextStyle(fontSize: 21, fontWeight: FontWeight.w900, color: color)),
      ),
    );
  }

  Widget _toolbar() {
    final id = _selectedId!;
    final p = _rc.placements[id]!;
    void upd({double? scale, double? rotation, double? x, double? y}) {
      _rc.updatePlacement(id, scale: scale, rotation: rotation, xPercent: x, yPercent: y);
      setState(() {});
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
      decoration: BoxDecoration(color: const Color(0xFF21242B), borderRadius: BorderRadius.circular(16)),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _toolBtn('➖', 'Smaller', () => upd(scale: (p.scale - 0.12).clamp(0.3, 2))),
          _toolBtn('➕', 'Bigger', () => upd(scale: (p.scale + 0.12).clamp(0.3, 2))),
          _toolBtn('🔄', 'Rotate', () => upd(rotation: (p.rotation + 15) % 360)),
          _toolBtn('↺', 'Reset', () => upd(scale: 1, rotation: 0, x: 50, y: 55)),
          _toolBtn('🗑️', 'Remove', () {
            _rc.removePlacement(id);
            setState(() => _selectedId = null);
          }),
          _toolBtn('✓', 'Done', () => setState(() => _selectedId = null), highlight: true),
        ],
      ),
    );
  }

  Widget _toolBtn(String glyph, String label, VoidCallback onTap, {bool highlight = false}) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: highlight ? AppColors.primary : const Color(0xFF2F323A),
              borderRadius: BorderRadius.circular(12),
            ),
            alignment: Alignment.center,
            child: Text(glyph, style: const TextStyle(fontSize: 18)),
          ),
          const SizedBox(height: 4),
          Text(label, style: const TextStyle(color: Color(0xFFC7CDD3), fontSize: 10, fontWeight: FontWeight.w700)),
        ],
      ),
    );
  }

  Widget _addRow() {
    return Column(
      children: [
        Row(
          children: [
            GestureDetector(
              onTap: () {
                _rc.resetPlacements();
                setState(() => _selectedId = null);
              },
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 13),
                decoration: BoxDecoration(
                  color: const Color(0xFF2A2C33),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: const Color(0xFF3A3D45), width: 1.5),
                ),
                child: const Text('↺ Reset all',
                    style: TextStyle(color: Color(0xFFC7CDD3), fontWeight: FontWeight.w800, fontSize: 14)),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: GestureDetector(
                onTap: () => setState(() => _drawerOpen = true),
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  decoration: BoxDecoration(
                    color: AppColors.primary,
                    borderRadius: BorderRadius.circular(14),
                    boxShadow: [
                      BoxShadow(color: AppColors.primary.withValues(alpha: 0.35), blurRadius: 12, offset: const Offset(0, 6)),
                    ],
                  ),
                  alignment: Alignment.center,
                  child: const Text('＋  Add Item',
                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 15)),
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),
        const Text('Tap an item to select  •  Drag to decorate',
            style: TextStyle(color: AppColors.grey, fontWeight: FontWeight.w700, fontSize: 12)),
        if (_drawerOpen) _drawer(),
      ],
    );
  }

  Widget _drawer() {
    final items = _available;
    return Container(
      margin: const EdgeInsets.only(top: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF21242B),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Add to your home',
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 14)),
              GestureDetector(
                onTap: () => setState(() => _drawerOpen = false),
                child: const Text('✕', style: TextStyle(color: Color(0xFFC7CDD3), fontSize: 16, fontWeight: FontWeight.w800)),
              ),
            ],
          ),
          const SizedBox(height: 10),
          if (items.isEmpty)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 14),
              child: Text('All unlocked items are placed. Complete more levels to unlock more!',
                  style: TextStyle(color: AppColors.grey, fontSize: 12, fontWeight: FontWeight.w600)),
            )
          else
            SizedBox(
              height: 84,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: items.length,
                separatorBuilder: (_, _) => const SizedBox(width: 10),
                itemBuilder: (_, i) {
                  final it = items[i];
                  return GestureDetector(
                    onTap: () {
                      _rc.place(it.id);
                      setState(() {
                        _selectedId = it.id;
                        _drawerOpen = false;
                      });
                    },
                    child: Container(
                      width: 72,
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        color: const Color(0xFF2F323A),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(it.icon, style: const TextStyle(fontSize: 28)),
                          const SizedBox(height: 2),
                          Text(it.name,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(color: Color(0xFFC7CDD3), fontSize: 9.5, fontWeight: FontWeight.w700)),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
        ],
      ),
    );
  }
}

/// Illustrated room stand-in for the DREAM_HOME photo asset.
class _RoomPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width, h = size.height;
    final floorY = h * 0.66;
    // wall
    canvas.drawRect(Rect.fromLTWH(0, 0, w, floorY),
        Paint()..shader = const LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter, colors: [Color(0xFFEAF1F6), Color(0xFFD9E6EE)]).createShader(Rect.fromLTWH(0, 0, w, floorY)));
    // floor
    canvas.drawRect(Rect.fromLTWH(0, floorY, w, h - floorY),
        Paint()..shader = const LinearGradient(begin: Alignment.topCenter, end: Alignment.bottomCenter, colors: [Color(0xFFE7D2B0), Color(0xFFD8BC92)]).createShader(Rect.fromLTWH(0, floorY, w, h - floorY)));
    // skirting line
    canvas.drawRect(Rect.fromLTWH(0, floorY - 4, w, 4), Paint()..color = const Color(0xFFC9B48E));
    // window
    final win = Rect.fromLTWH(w * 0.12, h * 0.12, w * 0.3, h * 0.28);
    canvas.drawRRect(RRect.fromRectAndRadius(win, const Radius.circular(8)), Paint()..color = const Color(0xFFBFE0F2));
    canvas.drawRRect(RRect.fromRectAndRadius(win, const Radius.circular(8)),
        Paint()..color = const Color(0xFFFFFFFF)..style = PaintingStyle.stroke..strokeWidth = 5);
    canvas.drawLine(Offset(win.center.dx, win.top), Offset(win.center.dx, win.bottom),
        Paint()..color = Colors.white..strokeWidth = 4);
    canvas.drawLine(Offset(win.left, win.center.dy), Offset(win.right, win.center.dy),
        Paint()..color = Colors.white..strokeWidth = 4);
    // framed picture
    final pic = Rect.fromLTWH(w * 0.62, h * 0.16, w * 0.22, h * 0.16);
    canvas.drawRRect(RRect.fromRectAndRadius(pic, const Radius.circular(4)),
        Paint()..color = const Color(0xFFF4C7A1));
    canvas.drawRRect(RRect.fromRectAndRadius(pic.deflate(4), const Radius.circular(2)),
        Paint()..color = const Color(0xFFFCEFE0));
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
