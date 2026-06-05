/**
 * AvatarSetupScreen — full-screen avatar setup with two paths (Part 1):
 *
 *   Option A · Choose Avatar   → pick from the 18 persona combinations
 *                                (profession × gender × age), preview live.
 *   Option B · Create My Avatar → Upload Photo / Take Selfie → generated
 *                                game-style caricature (PhotoAvatarCreator).
 *
 * Opens as a Modal kept inside the phone frame on web. Replaces the older
 * AvatarCreatorScreen.
 */
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AGE_GROUPS, GENDERS, USER_TYPES } from '../data/avatarProfiles';
import { ageToGroup, getAvatarForUser } from '../utils/avatarResolver';
import { useAvatar } from '../components/avatar/AvatarContext';
import { useRewards } from '../components/avatar/RewardContext';
import { AvatarSelection } from '../storage/avatarStorage';
import AvatarPreview from '../components/avatar/AvatarPreview';
import PhotoAvatarCreator from '../components/avatar/PhotoAvatarCreator';
import { IS_WEB, VIEWPORT_W, VIEWPORT_H, WEB_SCALE } from '../utils/viewport';

const PRIMARY = '#FF7A00';
type Mode = 'choose' | 'create';

function Chip({ label, active, onPress, wide }: { label: string; active: boolean; onPress: () => void; wide?: boolean }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, wide && styles.chipWide, active && styles.chipOn]}>
      <Text style={[styles.chipText, active && styles.chipTextOn]} numberOfLines={1}>{label}</Text>
    </Pressable>
  );
}

export default function AvatarSetupScreen({ onClose }: { onClose: () => void }) {
  const { selection, setSelection } = useAvatar();
  const { equippedKeys, setCustomAvatar, useCustomAvatar } = useRewards();
  const [mode, setMode] = useState<Mode>('choose');
  const [draft, setDraft] = useState<AvatarSelection>(selection);
  const group = ageToGroup(draft.age);
  const profile = getAvatarForUser(draft);

  const saveChoose = () => {
    setSelection(draft);
    useCustomAvatar(false); // a chosen persona is not the custom avatar
    onClose();
  };

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.backdrop}>
        <View style={styles.frame}>
          <View style={styles.header}>
            <View style={{ width: 30 }} />
            <Text style={styles.title}>Create Your Avatar</Text>
            <Pressable onPress={onClose} hitSlop={10} style={styles.close}><Text style={styles.closeX}>✕</Text></Pressable>
          </View>

          {/* Option A / Option B toggle */}
          <View style={styles.segment}>
            <Pressable style={[styles.segBtn, mode === 'choose' && styles.segOn]} onPress={() => setMode('choose')}>
              <Text style={[styles.segText, mode === 'choose' && styles.segTextOn]}>🎭  Choose Avatar</Text>
            </Pressable>
            <Pressable style={[styles.segBtn, mode === 'create' && styles.segOn]} onPress={() => setMode('create')}>
              <Text style={[styles.segText, mode === 'create' && styles.segTextOn]}>📸  Create My Avatar</Text>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
            {mode === 'choose' ? (
              <>
                <View style={styles.preview}>
                  <AvatarPreview selection={draft} size={196} equipped={equippedKeys} stageSize={224} />
                  <Text style={styles.pLabel}>{profile.label}</Text>
                  <Text style={styles.pOutfit}>{profile.outfit}</Text>
                </View>

                <Text style={styles.group}>I am a…</Text>
                <View style={styles.row}>
                  {USER_TYPES.map((u) => (
                    <Chip key={u.value} wide label={`${u.emoji}  ${u.label}`} active={draft.userType === u.value}
                      onPress={() => setDraft({ ...draft, userType: u.value })} />
                  ))}
                </View>

                <Text style={styles.group}>Gender</Text>
                <View style={styles.row}>
                  {GENDERS.map((g) => (
                    <Chip key={g.value} label={g.label} active={draft.gender === g.value}
                      onPress={() => setDraft({ ...draft, gender: g.value })} />
                  ))}
                </View>

                <Text style={styles.group}>Age group</Text>
                <View style={styles.row}>
                  {AGE_GROUPS.map((a) => (
                    <Chip key={a.value} label={a.label} active={group === a.value}
                      onPress={() => setDraft({ ...draft, age: a.age })} />
                  ))}
                </View>
              </>
            ) : (
              <>
                <Text style={styles.createHint}>
                  Pick your persona below, then upload a photo or take a selfie to generate a
                  game-style avatar of you.
                </Text>
                <PhotoAvatarCreator
                  profile={draft}
                  onUseAvatar={(gen) => {
                    setSelection(gen.profile);
                    setCustomAvatar(gen.imageUri ?? gen.sourceUri); // store the caricature
                    onClose();
                  }}
                />
                {/* persona pickers also available in create mode so the caricature matches */}
                <Text style={styles.group}>Base persona</Text>
                <View style={styles.row}>
                  {USER_TYPES.map((u) => (
                    <Chip key={u.value} wide label={`${u.emoji}  ${u.label}`} active={draft.userType === u.value}
                      onPress={() => setDraft({ ...draft, userType: u.value })} />
                  ))}
                </View>
                <View style={styles.row}>
                  {GENDERS.map((g) => (
                    <Chip key={g.value} label={g.label} active={draft.gender === g.value}
                      onPress={() => setDraft({ ...draft, gender: g.value })} />
                  ))}
                  {AGE_GROUPS.map((a) => (
                    <Chip key={a.value} label={a.label} active={group === a.value}
                      onPress={() => setDraft({ ...draft, age: a.age })} />
                  ))}
                </View>
              </>
            )}
          </ScrollView>

          {mode === 'choose' && (
            <View style={styles.footer}>
              <Pressable style={({ pressed }) => [styles.cta, pressed && { opacity: 0.9 }]} onPress={saveChoose}>
                <Text style={styles.ctaText}>✨  Set as my avatar</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: IS_WEB ? '#0B0C10' : '#FFFFFF',
    alignItems: IS_WEB ? 'center' : 'stretch',
    justifyContent: IS_WEB ? 'center' : 'flex-start',
  },
  frame: IS_WEB
    ? { width: VIEWPORT_W, height: VIEWPORT_H, backgroundColor: '#FFFFFF', overflow: 'hidden', borderRadius: 44, transform: [{ scale: WEB_SCALE }] }
    : { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    paddingTop: 52, paddingHorizontal: 16, paddingBottom: 8,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  title: { fontSize: 18, fontWeight: '900', color: '#21242B' },
  close: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  closeX: { fontSize: 18, fontWeight: '800', color: '#2A2E33' },
  segment: {
    flexDirection: 'row', marginHorizontal: 16, marginTop: 6, backgroundColor: '#F1F2F4',
    borderRadius: 14, padding: 4,
  },
  segBtn: { flex: 1, borderRadius: 11, paddingVertical: 10, alignItems: 'center' },
  segOn: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  segText: { fontSize: 12.5, fontWeight: '800', color: '#9AA0A6' },
  segTextOn: { color: PRIMARY },
  body: { paddingHorizontal: 20, paddingBottom: 30 },
  preview: { alignItems: 'center', paddingVertical: 8 },
  pLabel: { marginTop: 12, fontSize: 17, fontWeight: '900', color: '#21242B', textAlign: 'center' },
  pOutfit: { marginTop: 3, fontSize: 12.5, color: '#9AA0A6', fontWeight: '600', textAlign: 'center' },
  createHint: { fontSize: 13, color: '#6B7177', fontWeight: '600', textAlign: 'center', marginTop: 10, marginBottom: 16, lineHeight: 19 },
  group: { fontSize: 13, fontWeight: '800', color: '#6B7177', marginTop: 18, marginBottom: 8 },
  row: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4 },
  chip: {
    margin: 4, paddingHorizontal: 14, paddingVertical: 11, borderRadius: 14,
    backgroundColor: '#F4F5F7', borderWidth: 1.5, borderColor: '#ECEDEF',
  },
  chipWide: { flexGrow: 1, alignItems: 'center' },
  chipOn: { backgroundColor: '#FFF1E2', borderColor: PRIMARY },
  chipText: { fontSize: 13.5, fontWeight: '800', color: '#6B7177' },
  chipTextOn: { color: PRIMARY },
  footer: { paddingHorizontal: 20, paddingBottom: 26, paddingTop: 6 },
  cta: {
    backgroundColor: PRIMARY, borderRadius: 18, paddingVertical: 16, alignItems: 'center',
    shadowColor: PRIMARY, shadowOpacity: 0.32, shadowRadius: 14, shadowOffset: { width: 0, height: 8 }, elevation: 5,
  },
  ctaText: { color: '#FFFFFF', fontWeight: '900', fontSize: 16.5 },
});
