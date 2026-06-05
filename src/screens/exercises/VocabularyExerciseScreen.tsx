/**
 * VocabularyExerciseScreen — full-screen Vocabulary exercise flow (prototype),
 * styled after the SpeakX app. Renders inside a Modal so it sits above the town
 * map AND the bottom tab bar.
 *
 * Flow: 6 questions → tap audio (pulse) → pick an answer → correct advances
 * after a beat (+coins, +progress); a 3-in-a-row streak shows a celebration;
 * finishing shows a confetti "Vocabulary Complete!" with "Continue to Reading".
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path, Polygon } from 'react-native-svg';

import { VOCAB_QUESTIONS, COINS_PER_CORRECT, VocabQuestion } from '../../data/vocabQuestions';
import { IS_WEB, VIEWPORT_W, VIEWPORT_H, WEB_SCALE } from '../../utils/viewport';
import { playSound } from '../../utils/sound';
import ExerciseHeader from '../../components/exercises/ExerciseHeader';
import AudioButton from '../../components/exercises/AudioButton';
import OptionCard, { OptionState } from '../../components/exercises/OptionCard';
import StreakCelebration from '../../components/exercises/StreakCelebration';
import ExerciseCompleteScreen from '../../components/exercises/ExerciseCompleteScreen';

type Phase = 'answering' | 'correct' | 'wrong' | 'streak' | 'complete';

interface Props {
  onClose: () => void;
  /** Called when the user taps "Continue to Reading" on the finish screen. */
  onComplete: () => void;
}

/** Faded SpeakX watermark (orange asterisk) on the left edge. */
function Watermark() {
  return (
    <Svg width={56} height={56} viewBox="0 0 56 56" style={styles.watermark}>
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return (
          <Path
            key={i}
            d={`M 28 28 L ${28 + Math.cos(a) * 22} ${28 + Math.sin(a) * 22}`}
            stroke="#FF7A00" strokeWidth={9} strokeLinecap="round"
          />
        );
      })}
      <Circle cx={28} cy={28} r={7} fill="#FFFFFF" />
    </Svg>
  );
}

/** Little kid mascot with a speech bubble (for "select the word you hear"). */
function QuestionMascot({ say }: { say?: string }) {
  return (
    <View style={styles.mascotRow}>
      <Svg width={84} height={84} viewBox="0 0 84 84">
        <Circle cx={42} cy={78} r={20} fill="#7FC24A" />
        <Path d="M 24 60 q 18 -14 36 0 v 22 h -36 Z" fill="#7FC24A" />
        <Circle cx={42} cy={40} r={20} fill="#F4C9A0" />
        {/* hair */}
        <Path d="M 22 38 q -2 -22 20 -24 q 22 2 20 24 q -6 -10 -20 -10 q -14 0 -20 10 Z" fill="#8A5A36" />
        <Path d="M 30 22 l 4 8 l 6 -8 l 5 9 l 6 -7" stroke="#8A5A36" strokeWidth={5} fill="none" strokeLinecap="round" />
        {/* face */}
        <Circle cx={35} cy={40} r={2.4} fill="#3A2A1E" />
        <Circle cx={49} cy={40} r={2.4} fill="#3A2A1E" />
        <Circle cx={30} cy={46} r={3} fill="#F4A8A8" opacity={0.7} />
        <Circle cx={54} cy={46} r={3} fill="#F4A8A8" opacity={0.7} />
        <Path d="M 36 47 q 6 6 12 0" stroke="#A8553A" strokeWidth={2} fill="none" strokeLinecap="round" />
      </Svg>
      {say ? (
        <View style={styles.bubble}>
          <View style={styles.bubbleTail} />
          <Text style={styles.bubbleText}>{say}</Text>
        </View>
      ) : null}
    </View>
  );
}

export default function VocabularyExerciseScreen({ onClose, onComplete }: Props) {
  const [qi, setQi] = useState(0);
  const [coins, setCoins] = useState(0);
  const [streak, setStreak] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>('answering');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => { timers.current.forEach(clearTimeout); }, []);
  const after = (ms: number, fn: () => void) => { timers.current.push(setTimeout(fn, ms)); };

  const q: VocabQuestion = VOCAB_QUESTIONS[qi];
  const last = qi >= VOCAB_QUESTIONS.length - 1;

  const advance = useCallback(() => {
    if (last) {
      playSound('success');
      setPhase('complete');
    } else {
      setQi((i) => i + 1);
      setPicked(null);
      setPhase('answering');
    }
  }, [last]);

  const pick = (i: number) => {
    if (phase !== 'answering') return;
    setPicked(i);
    if (q.options[i].correct) {
      playSound('coin');
      setCoins((c) => c + COINS_PER_CORRECT);
      const ns = streak + 1;
      setStreak(ns);
      setPhase('correct');
      after(680, () => {
        if (ns === 3) {
          setPhase('streak');
          after(1600, advance);
        } else {
          advance();
        }
      });
    } else {
      playSound('tap');
      setStreak(0);
      setPhase('wrong');
      after(950, () => { setPhase('answering'); setPicked(null); });
    }
  };

  const stateOf = (i: number): OptionState => {
    if (phase === 'correct' || phase === 'streak') return i === picked ? 'correct' : 'dim';
    if (phase === 'wrong') return i === picked ? 'wrong' : 'idle';
    return 'idle';
  };

  const answeredCount = phase === 'complete' ? VOCAB_QUESTIONS.length
    : qi + (phase === 'correct' || phase === 'streak' ? 1 : 0);
  const progress = answeredCount / VOCAB_QUESTIONS.length;
  const showAudio = q.kind === 'image' || q.kind === 'word' || q.kind === 'fill';

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.backdrop}>
       <View style={styles.frame}>
        <ExerciseHeader progress={progress} coins={coins} onClose={onClose} />
        <Watermark />

        <ScrollView style={styles.scroll} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>{q.title}</Text>
          <Text style={styles.subtitle}>{q.subtitle}</Text>

          {/* prompt for fill / match / sentence */}
          {(q.kind === 'fill' || q.kind === 'match' || q.kind === 'sentence') && (
            <View style={styles.promptBlock}>
              <Text style={styles.prompt}>{q.prompt}</Text>
              {q.translation ? <Text style={styles.translation}>{q.translation}</Text> : null}
            </View>
          )}

          {showAudio && (
            <View style={styles.audioWrap}>
              <AudioButton onPlay={() => playSound('tap')} />
            </View>
          )}

          {q.kind === 'word' && <QuestionMascot say={q.audioText} />}

          {/* options */}
          {q.kind === 'image' ? (
            <View style={styles.imgRow}>
              {q.options.map((o, i) => (
                <OptionCard key={i} variant="image" label={o.label} emoji={o.emoji} state={stateOf(i)} disabled={phase !== 'answering'} onPress={() => pick(i)} />
              ))}
            </View>
          ) : (
            <View style={styles.optList}>
              {q.options.map((o, i) => (
                <OptionCard key={i} label={o.label} state={stateOf(i)} disabled={phase !== 'answering'} onPress={() => pick(i)} />
              ))}
            </View>
          )}
        </ScrollView>

        {/* feedback bar */}
        {phase === 'correct' && (
          <View style={[styles.feedback, { backgroundColor: '#EAF7EE' }]}>
            <Text style={[styles.feedbackText, { color: '#1F8B50' }]}>✓  CORRECT!</Text>
          </View>
        )}
        {phase === 'wrong' && (
          <View style={[styles.feedback, { backgroundColor: '#FDECEC' }]}>
            <Text style={[styles.feedbackText, { color: '#C0392B' }]}>Try again</Text>
          </View>
        )}

        {phase === 'streak' && <StreakCelebration count={3} />}
        {phase === 'complete' && (
          <ExerciseCompleteScreen
            coins={coins}
            title="Vocabulary Complete!"
            subtitle="Great job! You completed 6 sentences."
            ctaLabel="Continue to Reading"
            onContinue={onComplete}
          />
        )}
       </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // On web, keep the exercise inside the same centred phone frame as the app.
  backdrop: {
    flex: 1,
    backgroundColor: IS_WEB ? '#1A1B1E' : '#FFFFFF',
    alignItems: IS_WEB ? 'center' : 'stretch',
    justifyContent: IS_WEB ? 'center' : 'flex-start',
  },
  frame: IS_WEB
    ? { width: VIEWPORT_W, height: VIEWPORT_H, backgroundColor: '#FFFFFF', overflow: 'hidden', borderRadius: 44, transform: [{ scale: WEB_SCALE }] }
    : { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { flex: 1, alignSelf: 'stretch' },
  watermark: { position: 'absolute', left: -8, top: 96, opacity: 0.12 },
  body: { paddingHorizontal: 22, paddingTop: 18, paddingBottom: 120, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '900', color: '#2A2E33', textAlign: 'center', alignSelf: 'stretch' },
  subtitle: { fontSize: 16, color: '#9AA0A6', fontWeight: '700', textAlign: 'center', marginTop: 4 },
  promptBlock: { marginTop: 22, alignItems: 'center' },
  prompt: { fontSize: 26, fontWeight: '900', color: '#2A2E33', textAlign: 'center' },
  translation: { fontSize: 14, color: '#9AA0A6', fontWeight: '600', marginTop: 6, textAlign: 'center' },
  audioWrap: { marginTop: 26, marginBottom: 6, alignItems: 'center' },
  mascotRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', marginTop: 12, marginBottom: 6 },
  bubble: {
    marginTop: 8, marginLeft: 10, backgroundColor: '#EFF1F4', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 8, alignSelf: 'flex-start',
  },
  bubbleTail: { position: 'absolute', left: -5, top: 12, width: 10, height: 10, backgroundColor: '#EFF1F4', transform: [{ rotate: '45deg' }] },
  bubbleText: { fontSize: 16, fontWeight: '700', color: '#5A6066' },
  imgRow: { flexDirection: 'row', marginTop: 30, alignSelf: 'stretch' },
  optList: { marginTop: 30, alignSelf: 'stretch' },
  feedback: {
    position: 'absolute', left: 0, right: 0, bottom: 0, paddingTop: 16, paddingBottom: 34, paddingHorizontal: 22,
  },
  feedbackText: { fontSize: 20, fontWeight: '900' },
});
