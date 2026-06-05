/**
 * PhotoAvatarCreator — "Create My Avatar" flow (Part 1, Option B).
 *
 * Upload a photo or take a selfie → a short "Creating your game avatar…"
 * loading state → a generated-style caricature avatar (built from the selected
 * persona) → "Your custom avatar is ready!" → use it.
 *
 * PROTOTYPE: no real camera/file picker or AI call. Both buttons feed a
 * placeholder photo URI into avatarGenerationService, which simulates the
 * generation. The architecture is ready for a real selfie→avatar API — see
 * services/avatarGenerationService.ts.
 */
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { AvatarSelection } from '../../storage/avatarStorage';
import {
  GeneratedAvatar,
  generateAvatarFromPhoto,
  pickPhoto,
} from '../../services/avatarGenerationService';
import AvatarPreview from './AvatarPreview';

type Phase = 'idle' | 'generating' | 'ready';

interface Props {
  /** Persona the caricature is based on (profession/gender/age). */
  profile: AvatarSelection;
  /** Called when the learner accepts the generated custom avatar. */
  onUseAvatar: (generated: GeneratedAvatar) => void;
}

export default function PhotoAvatarCreator({ profile, onUseAvatar }: Props) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [result, setResult] = useState<GeneratedAvatar | null>(null);
  const alive = useRef(true);
  useEffect(() => () => { alive.current = false; }, []);

  const start = async (source: 'upload' | 'selfie') => {
    // 1. let the learner pick a real photo / take a selfie
    const photoUri = await pickPhoto(source);
    if (!photoUri) return; // cancelled — stay on the idle screen
    if (!alive.current) return;
    // 2. show the loading state while we caricature it
    setPhase('generating');
    const gen = await generateAvatarFromPhoto(photoUri, profile);
    if (!alive.current) return;
    setResult(gen);
    setPhase('ready');
  };

  if (phase === 'generating') {
    return (
      <View style={styles.center}>
        <View style={styles.spinnerStage}>
          <ActivityIndicator size="large" color="#FF7A00" />
        </View>
        <Text style={styles.creatingTitle}>Creating your game avatar…</Text>
        <Text style={styles.creatingSub}>Turning your photo into a game-style character.</Text>
      </View>
    );
  }

  if (phase === 'ready' && result) {
    return (
      <View style={styles.center}>
        <AvatarPreview selection={result.profile} size={190} generated stageSize={224} imageUri={result.imageUri} />
        <Text style={styles.readyTitle}>Your custom avatar is ready!</Text>
        <Text style={styles.readySub}>A caricature of you, generated from your photo.</Text>
        <Pressable style={({ pressed }) => [styles.useBtn, pressed && { opacity: 0.9 }]} onPress={() => onUseAvatar(result)}>
          <Text style={styles.useText}>✨  Use this avatar</Text>
        </Pressable>
        <Pressable style={styles.retake} onPress={() => { setResult(null); setPhase('idle'); }}>
          <Text style={styles.retakeText}>↺  Try another photo</Text>
        </Pressable>
      </View>
    );
  }

  // idle
  return (
    <View style={styles.center}>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderEmoji}>📸</Text>
        <Text style={styles.placeholderText}>Add a photo to create{'\n'}your game avatar</Text>
      </View>
      <Pressable style={({ pressed }) => [styles.optBtn, pressed && { opacity: 0.9 }]} onPress={() => start('upload')}>
        <Text style={styles.optEmoji}>🖼️</Text>
        <Text style={styles.optText}>Upload Photo</Text>
      </Pressable>
      <Pressable style={({ pressed }) => [styles.optBtn, styles.optBtnAlt, pressed && { opacity: 0.9 }]} onPress={() => start('selfie')}>
        <Text style={styles.optEmoji}>🤳</Text>
        <Text style={[styles.optText, styles.optTextAlt]}>Take Selfie</Text>
      </Pressable>
      <Text style={styles.disclaimer}>Prototype — your photo isn't uploaded anywhere yet.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', paddingTop: 6 },
  // idle
  placeholder: {
    width: 200, height: 200, borderRadius: 28, backgroundColor: '#F6F7F9',
    borderWidth: 2, borderColor: '#E6E8EB', borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center', marginBottom: 22,
  },
  placeholderEmoji: { fontSize: 48, marginBottom: 10 },
  placeholderText: { fontSize: 13.5, color: '#9AA0A6', fontWeight: '700', textAlign: 'center', lineHeight: 19 },
  optBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    alignSelf: 'stretch', backgroundColor: '#FF7A00', borderRadius: 16,
    paddingVertical: 15, marginTop: 12,
    shadowColor: '#FF7A00', shadowOpacity: 0.28, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 4,
  },
  optBtnAlt: { backgroundColor: '#FFF1E2', borderWidth: 1.5, borderColor: '#FFC78F', shadowOpacity: 0 },
  optEmoji: { fontSize: 18, marginRight: 8 },
  optText: { color: '#FFFFFF', fontWeight: '900', fontSize: 16 },
  optTextAlt: { color: '#E07B1E' },
  disclaimer: { marginTop: 16, fontSize: 11.5, color: '#A9AFB5', fontWeight: '600', textAlign: 'center' },
  // generating
  spinnerStage: {
    width: 200, height: 200, borderRadius: 100, backgroundColor: '#FFF6EC',
    borderWidth: 3, borderColor: '#FFD8B0',
    alignItems: 'center', justifyContent: 'center', marginBottom: 22,
  },
  creatingTitle: { fontSize: 18, fontWeight: '900', color: '#21242B', marginTop: 4 },
  creatingSub: { fontSize: 13, color: '#9AA0A6', fontWeight: '600', marginTop: 6, textAlign: 'center' },
  // ready
  readyTitle: { fontSize: 19, fontWeight: '900', color: '#1F8B50', marginTop: 16, textAlign: 'center' },
  readySub: { fontSize: 13, color: '#9AA0A6', fontWeight: '600', marginTop: 5, textAlign: 'center' },
  useBtn: {
    alignSelf: 'stretch', backgroundColor: '#FF7A00', borderRadius: 16, paddingVertical: 15, alignItems: 'center', marginTop: 20,
    shadowColor: '#FF7A00', shadowOpacity: 0.3, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 4,
  },
  useText: { color: '#FFFFFF', fontWeight: '900', fontSize: 16 },
  retake: { marginTop: 12, paddingVertical: 6 },
  retakeText: { color: '#9AA0A6', fontWeight: '800', fontSize: 13.5 },
});
