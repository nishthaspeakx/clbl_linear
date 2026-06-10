import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';

/// Visual prototype of the SpeakX "AI Call" tab — blue/purple hero +
/// horizontal "Talk to Family & Friends" scenario list. Static/mock only.
class AICallScreen extends StatelessWidget {
  const AICallScreen({super.key});

  static const _scenarios = <_Scenario>[
    _Scenario('🤝', Color(0xFFE8F0FF), 'Make new friends', '7 Mins', 'Easy',
        'Most Viewed', Color(0xFFFFF1E2), Color(0xFFE07B1E)),
    _Scenario('🍽️', Color(0xFFFDEBF1), 'Plan a family dinner', '5 Mins',
        'Medium', 'Trending Now', Color(0xFFEAF7EE), Color(0xFF2E9E63)),
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppColors.bg,
      child: ListView(
        padding: const EdgeInsets.only(top: 56, bottom: 110),
        children: [
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 16),
            child: Text('AI Call',
                style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w900,
                    color: AppColors.ink)),
          ),
          const Padding(
            padding: EdgeInsets.fromLTRB(16, 2, 16, 16),
            child: Text('Practice real conversations, anytime.',
                style: TextStyle(fontSize: 13, color: AppColors.grey)),
          ),

          // Hero
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 16),
            height: 188,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(24),
              gradient: const LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [Color(0xFF5B6CF0), Color(0xFF8A4FE0)],
              ),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF5B6CF0).withValues(alpha: 0.3),
                  blurRadius: 16,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            padding: const EdgeInsets.all(20),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text('TALK ABOUT\nANYTHING',
                          style: TextStyle(
                              fontSize: 22,
                              fontWeight: FontWeight.w900,
                              color: Colors.white,
                              height: 1.18)),
                      const SizedBox(height: 10),
                      Row(
                        children: const [
                          _Dot(),
                          SizedBox(width: 6),
                          Flexible(
                            child: Text('Available 24x7 · Anytime, Anywhere',
                                style: TextStyle(
                                    fontSize: 11.5,
                                    color: Colors.white70,
                                    fontWeight: FontWeight.w600)),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Container(
                        decoration: BoxDecoration(
                          color: AppColors.primary,
                          borderRadius: BorderRadius.circular(16),
                        ),
                        padding: const EdgeInsets.symmetric(
                            vertical: 12, horizontal: 22),
                        child: const Text('📞 TALK NOW',
                            style: TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.w900,
                                fontSize: 14)),
                      ),
                    ],
                  ),
                ),
                Container(
                  width: 92,
                  height: 92,
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.22),
                    shape: BoxShape.circle,
                  ),
                  alignment: Alignment.center,
                  child: const Text('👩🏻', style: TextStyle(fontSize: 46)),
                ),
              ],
            ),
          ),

          const Padding(
            padding: EdgeInsets.fromLTRB(16, 26, 16, 14),
            child: Text('Talk to Family & Friends',
                style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.w800,
                    color: AppColors.ink)),
          ),

          SizedBox(
            height: 250,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: _scenarios.length,
              separatorBuilder: (_, _) => const SizedBox(width: 14),
              itemBuilder: (_, i) => _ScenarioCard(_scenarios[i]),
            ),
          ),
        ],
      ),
    );
  }
}

class _Dot extends StatelessWidget {
  const _Dot();
  @override
  Widget build(BuildContext context) => Container(
        width: 8,
        height: 8,
        decoration:
            const BoxDecoration(color: Color(0xFF4ADE80), shape: BoxShape.circle),
      );
}

class _Scenario {
  final String emoji;
  final Color bg;
  final String title;
  final String mins;
  final String level;
  final String badge;
  final Color badgeBg;
  final Color badgeColor;
  const _Scenario(this.emoji, this.bg, this.title, this.mins, this.level,
      this.badge, this.badgeBg, this.badgeColor);
}

class _ScenarioCard extends StatelessWidget {
  const _ScenarioCard(this.s);
  final _Scenario s;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 200,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: const [
          BoxShadow(
              color: Color(0x0F000000), blurRadius: 12, offset: Offset(0, 4)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            height: 110,
            decoration: BoxDecoration(
              color: s.bg,
              borderRadius: BorderRadius.circular(14),
            ),
            child: Stack(
              children: [
                Center(child: Text(s.emoji, style: const TextStyle(fontSize: 40))),
                Positioned(
                  top: 8,
                  left: 8,
                  child: Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: s.badgeBg,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Text(s.badge,
                        style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w800,
                            color: s.badgeColor)),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 10),
          Text(s.title,
              style: const TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w800,
                  color: AppColors.ink)),
          const SizedBox(height: 6),
          Row(
            children: [
              Text('⏱ ${s.mins}',
                  style: const TextStyle(
                      fontSize: 11.5,
                      color: AppColors.grey,
                      fontWeight: FontWeight.w600)),
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 6),
                child: Text('·', style: TextStyle(color: Color(0xFFC7CDD3))),
              ),
              Text('📊 ${s.level}',
                  style: const TextStyle(
                      fontSize: 11.5,
                      color: AppColors.grey,
                      fontWeight: FontWeight.w600)),
            ],
          ),
          const SizedBox(height: 12),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 9),
            decoration: BoxDecoration(
              color: AppColors.tintOrange,
              borderRadius: BorderRadius.circular(12),
            ),
            alignment: Alignment.center,
            child: const Text('Start →',
                style: TextStyle(
                    color: AppColors.primary,
                    fontWeight: FontWeight.w800,
                    fontSize: 13)),
          ),
        ],
      ),
    );
  }
}
