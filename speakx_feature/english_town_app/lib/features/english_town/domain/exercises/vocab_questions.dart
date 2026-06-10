/// Vocabulary questions for the Level-1 prototype (ported from
/// src/data/vocabQuestions.ts). Listen-and-select, fill, match, sentence.
enum VocabKind { image, word, fill, match, sentence }

class VocabOption {
  final String label;
  final bool correct;
  final String? emoji;
  const VocabOption(this.label, {this.correct = false, this.emoji});
}

class VocabQuestion {
  final int id;
  final VocabKind kind;
  final String title;
  final String subtitle;
  final String? audioText;
  final String? prompt;
  final String? translation;
  final List<VocabOption> options;
  const VocabQuestion({
    required this.id,
    required this.kind,
    required this.title,
    required this.subtitle,
    this.audioText,
    this.prompt,
    this.translation,
    required this.options,
  });
}

const int kCoinsPerCorrect = 2;

const List<VocabQuestion> kVocabQuestions = [
  VocabQuestion(
    id: 1,
    kind: VocabKind.image,
    title: 'Listen and select',
    subtitle: 'सुनें और चुनें',
    audioText: 'नया',
    prompt: 'नया',
    options: [
      VocabOption('New', correct: true, emoji: '✨'),
      VocabOption('Doctor', emoji: '🩺'),
    ],
  ),
  VocabQuestion(
    id: 2,
    kind: VocabKind.word,
    title: 'Select the word you hear',
    subtitle: 'सुनो और चुनो',
    audioText: 'meet',
    options: [VocabOption('Meet', correct: true), VocabOption('Mall')],
  ),
  VocabQuestion(
    id: 3,
    kind: VocabKind.fill,
    title: 'Fill in the blank',
    subtitle: 'सही शब्द चुनें',
    prompt: 'I ___ new here.',
    translation: 'Main yahan nayi hoon.',
    options: [VocabOption('am', correct: true), VocabOption('is')],
  ),
  VocabQuestion(
    id: 4,
    kind: VocabKind.match,
    title: 'Choose the correct meaning',
    subtitle: 'सही मतलब चुनें',
    prompt: 'Thank you',
    options: [VocabOption('धन्यवाद', correct: true), VocabOption('माफ़ कीजिए')],
  ),
  VocabQuestion(
    id: 5,
    kind: VocabKind.sentence,
    title: 'Select the correct sentence',
    subtitle: 'सही वाक्य चुनें',
    prompt: 'मैं यहाँ नया हूँ।',
    options: [
      VocabOption('I am new here.', correct: true),
      VocabOption('I is new here.'),
    ],
  ),
  VocabQuestion(
    id: 6,
    kind: VocabKind.word,
    title: 'Select the word you hear',
    subtitle: 'सुनो और चुनो',
    audioText: 'friend',
    options: [VocabOption('Friend', correct: true), VocabOption('Food')],
  ),
];
