import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../domain/exercises/vocab_questions.dart';
import '../widgets/exercise_widgets.dart';

enum _Phase { answering, correct, wrong, streak, complete }

/// Full-screen Vocabulary exercise flow (port of VocabularyExerciseScreen.tsx).
/// 4 questions → tap audio → pick answer → correct advances (+coins); a
/// 3-in-a-row streak shows a celebration; finishing shows the complete screen.
class VocabularyExerciseScreen extends StatefulWidget {
  const VocabularyExerciseScreen({super.key, required this.onComplete});

  /// Called when the user taps "Continue to Reading" on the finish screen.
  final VoidCallback onComplete;

  @override
  State<VocabularyExerciseScreen> createState() => _VocabularyExerciseScreenState();
}

class _VocabularyExerciseScreenState extends State<VocabularyExerciseScreen> {
  // Demo: keep the round short (max 4 questions).
  static final _questions = kVocabQuestions.take(4).toList();

  int _qi = 0;
  int _coins = 0;
  int _streak = 0;
  int? _picked;
  _Phase _phase = _Phase.answering;

  VocabQuestion get _q => _questions[_qi];
  bool get _last => _qi >= _questions.length - 1;

  void _advance() {
    if (_last) {
      setState(() => _phase = _Phase.complete);
    } else {
      setState(() {
        _qi++;
        _picked = null;
        _phase = _Phase.answering;
      });
    }
  }

  void _pick(int i) {
    if (_phase != _Phase.answering) return;
    setState(() => _picked = i);
    if (_q.options[i].correct) {
      _coins += kCoinsPerCorrect;
      final ns = _streak + 1;
      setState(() {
        _streak = ns;
        _phase = _Phase.correct;
      });
      Future.delayed(const Duration(milliseconds: 680), () {
        if (!mounted) return;
        if (ns == 3) {
          setState(() => _phase = _Phase.streak);
          Future.delayed(const Duration(milliseconds: 1600), () {
            if (mounted) _advance();
          });
        } else {
          _advance();
        }
      });
    } else {
      setState(() {
        _streak = 0;
        _phase = _Phase.wrong;
      });
      Future.delayed(const Duration(milliseconds: 950), () {
        if (!mounted) return;
        setState(() {
          _phase = _Phase.answering;
          _picked = null;
        });
      });
    }
  }

  OptionState _stateOf(int i) {
    if (_phase == _Phase.correct || _phase == _Phase.streak) {
      return i == _picked ? OptionState.correct : OptionState.dim;
    }
    if (_phase == _Phase.wrong) {
      return i == _picked ? OptionState.wrong : OptionState.idle;
    }
    return OptionState.idle;
  }

  @override
  Widget build(BuildContext context) {
    final answered = _phase == _Phase.complete
        ? _questions.length
        : _qi + (_phase == _Phase.correct || _phase == _Phase.streak ? 1 : 0);
    final progress = answered / _questions.length;
    final q = _q;
    final showAudio = q.kind == VocabKind.image ||
        q.kind == VocabKind.word ||
        q.kind == VocabKind.fill;
    final isImage = q.kind == VocabKind.image;

    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        children: [
          Column(
            children: [
              ExerciseHeader(
                progress: progress,
                coins: _coins,
                onClose: () => Navigator.of(context).maybePop(),
              ),
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.fromLTRB(22, 18, 22, 120),
                  child: Column(
                    children: [
                      Text(q.title,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                              fontSize: 24, fontWeight: FontWeight.w900, color: AppColors.ink)),
                      const SizedBox(height: 4),
                      Text(q.subtitle,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                              fontSize: 16, color: AppColors.grey, fontWeight: FontWeight.w700)),
                      if (q.kind == VocabKind.fill ||
                          q.kind == VocabKind.match ||
                          q.kind == VocabKind.sentence) ...[
                        const SizedBox(height: 22),
                        Text(q.prompt ?? '',
                            textAlign: TextAlign.center,
                            style: const TextStyle(
                                fontSize: 26, fontWeight: FontWeight.w900, color: AppColors.ink)),
                        if (q.translation != null) ...[
                          const SizedBox(height: 6),
                          Text(q.translation!,
                              textAlign: TextAlign.center,
                              style: const TextStyle(
                                  fontSize: 14, color: AppColors.grey, fontWeight: FontWeight.w600)),
                        ],
                      ],
                      if (showAudio) ...[
                        const SizedBox(height: 26),
                        AudioButton(onPlay: () {}),
                        const SizedBox(height: 6),
                      ],
                      if (q.kind == VocabKind.word) ...[
                        const SizedBox(height: 12),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('🧒', style: TextStyle(fontSize: 56)),
                            if (q.audioText != null) ...[
                              const SizedBox(width: 10),
                              Container(
                                margin: const EdgeInsets.only(top: 8),
                                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                                decoration: BoxDecoration(
                                    color: const Color(0xFFEFF1F4),
                                    borderRadius: BorderRadius.circular(14)),
                                child: Text(q.audioText!,
                                    style: const TextStyle(
                                        fontSize: 16, fontWeight: FontWeight.w700, color: Color(0xFF5A6066))),
                              ),
                            ],
                          ],
                        ),
                      ],
                      const SizedBox(height: 30),
                      if (isImage)
                        IntrinsicHeight(
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              for (var i = 0; i < q.options.length; i++)
                                Expanded(
                                  child: OptionCard(
                                    label: q.options[i].label,
                                    emoji: q.options[i].emoji,
                                    image: true,
                                    state: _stateOf(i),
                                    disabled: _phase != _Phase.answering,
                                    onPress: () => _pick(i),
                                  ),
                                ),
                            ],
                          ),
                        )
                      else
                        Column(
                          children: [
                            for (var i = 0; i < q.options.length; i++)
                              OptionCard(
                                label: q.options[i].label,
                                state: _stateOf(i),
                                disabled: _phase != _Phase.answering,
                                onPress: () => _pick(i),
                              ),
                          ],
                        ),
                    ],
                  ),
                ),
              ),
            ],
          ),

          // feedback bar
          if (_phase == _Phase.correct)
            const _FeedbackBar(text: '✓  CORRECT!', bg: Color(0xFFEAF7EE), fg: Color(0xFF1F8B50)),
          if (_phase == _Phase.wrong)
            const _FeedbackBar(text: 'Try again', bg: Color(0xFFFDECEC), fg: Color(0xFFC0392B)),

          if (_phase == _Phase.streak) const StreakCelebration(count: 3),
          if (_phase == _Phase.complete)
            ExerciseCompleteScreen(
              coins: _coins,
              title: 'Vocabulary Complete!',
              subtitle: 'Great job! You completed ${_questions.length} sentences.',
              ctaLabel: 'Continue to Reading',
              onContinue: widget.onComplete,
            ),
        ],
      ),
    );
  }
}

class _FeedbackBar extends StatelessWidget {
  const _FeedbackBar({required this.text, required this.bg, required this.fg});
  final String text;
  final Color bg;
  final Color fg;
  @override
  Widget build(BuildContext context) {
    return Positioned(
      left: 0,
      right: 0,
      bottom: 0,
      child: Container(
        color: bg,
        padding: const EdgeInsets.fromLTRB(22, 16, 22, 34),
        child: Text(text, style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: fg)),
      ),
    );
  }
}
