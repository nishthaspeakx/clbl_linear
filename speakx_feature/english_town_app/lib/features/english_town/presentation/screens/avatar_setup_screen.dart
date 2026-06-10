import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../domain/avatar/avatar_profiles.dart';
import '../widgets/avatar_figure.dart';

/// Full-screen avatar setup (port of AvatarSetupScreen.tsx). Choose Avatar tab
/// lets you pick persona (type × gender × age) with a live preview. The Create
/// My Avatar (photo/selfie → caricature) path is stubbed — it's device-specific
/// and belongs with the services migration.
class AvatarSetupScreen extends StatefulWidget {
  const AvatarSetupScreen({
    super.key,
    required this.initial,
    required this.onSave,
  });

  final AvatarSelection initial;
  final ValueChanged<AvatarSelection> onSave;

  @override
  State<AvatarSetupScreen> createState() => _AvatarSetupScreenState();
}

class _AvatarSetupScreenState extends State<AvatarSetupScreen> {
  late AvatarSelection _draft = widget.initial;
  bool _createMode = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            // header
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const SizedBox(width: 30),
                  const Text('Create Your Avatar',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: Color(0xFF21242B))),
                  GestureDetector(
                    onTap: () => Navigator.of(context).maybePop(),
                    child: const SizedBox(
                      width: 30,
                      height: 30,
                      child: Center(
                        child: Text('✕', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.ink)),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // segment toggle
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 16),
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(color: const Color(0xFFF1F2F4), borderRadius: BorderRadius.circular(14)),
              child: Row(
                children: [
                  _seg('🎭  Choose Avatar', !_createMode, () => setState(() => _createMode = false)),
                  _seg('📸  Create My Avatar', _createMode, () => setState(() => _createMode = true)),
                ],
              ),
            ),

            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(20, 8, 20, 30),
                child: _createMode ? _createBody() : _chooseBody(),
              ),
            ),

            if (!_createMode)
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 6, 20, 20),
                child: GestureDetector(
                  onTap: () => widget.onSave(_draft),
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    decoration: BoxDecoration(
                      color: AppColors.primary,
                      borderRadius: BorderRadius.circular(18),
                      boxShadow: [
                        BoxShadow(
                            color: AppColors.primary.withValues(alpha: 0.32),
                            blurRadius: 14,
                            offset: const Offset(0, 8)),
                      ],
                    ),
                    alignment: Alignment.center,
                    child: const Text('✨  Set as my avatar',
                        style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 16.5)),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _chooseBody() {
    return Column(
      children: [
        _preview(),
        _group('I am a…'),
        _col([
          for (final u in kUserTypes)
            _chip('${u.emoji}  ${u.label}', _draft.userType == u.value, wide: true,
                onTap: () => setState(() => _draft = _draft.copyWith(userType: u.value))),
        ]),
        _group('Gender'),
        _wrap([
          for (final g in kGenders)
            _chip(g.label, _draft.gender == g.value,
                onTap: () => setState(() => _draft = _draft.copyWith(gender: g.value))),
        ]),
        _group('Age group'),
        _wrap([
          for (final a in kAgeGroups)
            _chip(a.label, ageToGroup(_draft.age) == a.value,
                onTap: () => setState(() => _draft = _draft.copyWith(age: a.age))),
        ]),
      ],
    );
  }

  Widget _createBody() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        const Padding(
          padding: EdgeInsets.fromLTRB(0, 10, 0, 16),
          child: Text(
            'Pick your persona below, then upload a photo or take a selfie to generate a game-style avatar of you.',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 13, color: Color(0xFF6B7177), fontWeight: FontWeight.w600, height: 1.45),
          ),
        ),
        // Photo/selfie creator stub
        Container(
          padding: const EdgeInsets.symmetric(vertical: 26),
          decoration: BoxDecoration(
            color: const Color(0xFFFFF6EC),
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: const Color(0xFFFFE6CF), width: 1.5),
          ),
          child: Column(
            children: const [
              Text('📸', style: TextStyle(fontSize: 40)),
              SizedBox(height: 8),
              Text('Upload Photo · Take Selfie',
                  style: TextStyle(fontWeight: FontWeight.w900, color: AppColors.primary, fontSize: 14)),
              SizedBox(height: 4),
              Text('Caricature generation — wired with services migration',
                  style: TextStyle(color: AppColors.grey, fontSize: 11.5, fontWeight: FontWeight.w600)),
            ],
          ),
        ),
        _group('Base persona'),
        _col([
          for (final u in kUserTypes)
            _chip('${u.emoji}  ${u.label}', _draft.userType == u.value, wide: true,
                onTap: () => setState(() => _draft = _draft.copyWith(userType: u.value))),
        ]),
        const SizedBox(height: 8),
        _wrap([
          for (final g in kGenders)
            _chip(g.label, _draft.gender == g.value,
                onTap: () => setState(() => _draft = _draft.copyWith(gender: g.value))),
          for (final a in kAgeGroups)
            _chip(a.label, ageToGroup(_draft.age) == a.value,
                onTap: () => setState(() => _draft = _draft.copyWith(age: a.age))),
        ]),
      ],
    );
  }

  Widget _preview() {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Column(
        children: [
          Container(
            width: 224,
            height: 224,
            decoration: BoxDecoration(
              color: const Color(0xFFFFF6EC),
              shape: BoxShape.circle,
              border: Border.all(color: const Color(0xFFFFE6CF), width: 1.5),
            ),
            clipBehavior: Clip.antiAlias,
            alignment: Alignment.bottomCenter,
            child: Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: AvatarFigure(selection: _draft, size: 196, shadow: false),
            ),
          ),
          const SizedBox(height: 12),
          Text(profileLabel(_draft),
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w900, color: Color(0xFF21242B))),
          const SizedBox(height: 3),
          Text(profileOutfit(_draft),
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 12.5, color: AppColors.grey, fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }

  Widget _seg(String label, bool on, VoidCallback onTap) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            color: on ? Colors.white : Colors.transparent,
            borderRadius: BorderRadius.circular(11),
            boxShadow: on
                ? const [BoxShadow(color: Color(0x14000000), blurRadius: 6, offset: Offset(0, 2))]
                : null,
          ),
          alignment: Alignment.center,
          child: Text(label,
              style: TextStyle(
                  fontSize: 12.5,
                  fontWeight: FontWeight.w800,
                  color: on ? AppColors.primary : AppColors.grey)),
        ),
      ),
    );
  }

  Widget _group(String text) => Align(
        alignment: Alignment.centerLeft,
        child: Padding(
          padding: const EdgeInsets.only(top: 18, bottom: 8),
          child: Text(text,
              style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: Color(0xFF6B7177))),
        ),
      );

  Widget _wrap(List<Widget> children) =>
      Wrap(spacing: 8, runSpacing: 8, children: children);

  /// Full-width stacked chips (for the "I am a…" rows).
  Widget _col(List<Widget> children) => Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          for (var i = 0; i < children.length; i++) ...[
            if (i > 0) const SizedBox(height: 8),
            children[i],
          ],
        ],
      );

  Widget _chip(String label, bool active, {bool wide = false, required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 11),
        alignment: wide ? Alignment.center : null,
        decoration: BoxDecoration(
          color: active ? AppColors.tintOrange : const Color(0xFFF4F5F7),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: active ? AppColors.primary : const Color(0xFFECEDEF), width: 1.5),
        ),
        child: Text(label,
            maxLines: 1,
            style: TextStyle(
                fontSize: 13.5,
                fontWeight: FontWeight.w800,
                color: active ? AppColors.primary : const Color(0xFF6B7177))),
      ),
    );
  }
}
