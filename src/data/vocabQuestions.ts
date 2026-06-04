/**
 * vocabQuestions — 6 dummy Vocabulary questions for the Level-1 prototype.
 * Mirrors the SpeakX vocab flow: listen-and-select (image / word), fill the
 * blank, match meaning, and pick the correct sentence.
 */
export interface VocabOption {
  label: string;
  correct: boolean;
  /** Emoji used as the "image" on image-card questions. */
  emoji?: string;
}

export type VocabKind = 'image' | 'word' | 'fill' | 'match' | 'sentence';

export interface VocabQuestion {
  id: number;
  kind: VocabKind;
  /** Bold English instruction. */
  title: string;
  /** Hindi instruction shown under the title. */
  subtitle: string;
  /** Word "spoken" by the audio button / mascot bubble. */
  audioText?: string;
  /** Main bold prompt (sentence with blank / word / Hindi sentence). */
  prompt?: string;
  /** Small grey translation under the prompt. */
  translation?: string;
  options: VocabOption[];
}

export const VOCAB_QUESTIONS: VocabQuestion[] = [
  {
    id: 1,
    kind: 'image',
    title: 'Listen and select',
    subtitle: 'सुनें और चुनें',
    audioText: 'नया',
    prompt: 'नया',
    options: [
      { label: 'New', correct: true, emoji: '✨' },
      { label: 'Doctor', correct: false, emoji: '🩺' },
    ],
  },
  {
    id: 2,
    kind: 'word',
    title: 'Select the word you hear',
    subtitle: 'सुनो और चुनो',
    audioText: 'meet',
    options: [
      { label: 'Meet', correct: true },
      { label: 'Mall', correct: false },
    ],
  },
  {
    id: 3,
    kind: 'fill',
    title: 'Fill in the blank',
    subtitle: 'सही शब्द चुनें',
    prompt: 'I ___ new here.',
    translation: 'Main yahan nayi hoon.',
    options: [
      { label: 'am', correct: true },
      { label: 'is', correct: false },
    ],
  },
  {
    id: 4,
    kind: 'match',
    title: 'Choose the correct meaning',
    subtitle: 'सही मतलब चुनें',
    prompt: 'Thank you',
    options: [
      { label: 'धन्यवाद', correct: true },
      { label: 'माफ़ कीजिए', correct: false },
    ],
  },
  {
    id: 5,
    kind: 'sentence',
    title: 'Select the correct sentence',
    subtitle: 'सही वाक्य चुनें',
    prompt: 'मैं यहाँ नया हूँ।',
    options: [
      { label: 'I am new here.', correct: true },
      { label: 'I is new here.', correct: false },
    ],
  },
  {
    id: 6,
    kind: 'word',
    title: 'Select the word you hear',
    subtitle: 'सुनो और चुनो',
    audioText: 'friend',
    options: [
      { label: 'Friend', correct: true },
      { label: 'Food', correct: false },
    ],
  },
];

export const COINS_PER_CORRECT = 2;
