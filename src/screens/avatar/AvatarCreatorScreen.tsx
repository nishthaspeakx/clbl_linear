/**
 * AvatarCreatorScreen — a full-screen "create your avatar" page. Pick
 * profession, gender and age, preview live, then "Set as my avatar". Opens as a
 * Modal (kept inside the phone frame on web).
 */
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AGE_GROUPS, GENDERS, USER_TYPES } from '../../data/avatarProfiles';
import { ageToGroup, getAvatarForUser } from '../../utils/avatarResolver';
import { useAvatar } from '../../components/avatar/AvatarContext';
import { AvatarSelection } from '../../storage/avatarStorage';
import UserAvatar from '../../components/avatar/UserAvatar';
import { IS_WEB, VIEWPORT_W, VIEWPORT_H, WEB_SCALE } from '../../utils/viewport';

const PRIMARY = '#FF7A00';

function Chip({ label, active, onPress, wide }: { label: string; active: boolean; onPress: () => void; wide?: boolean }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, wide && styles.chipWide, active && styles.chipOn]}>
      <Text style={[styles.chipText, active && styles.chipTextOn]} numberOfLines={1}>{label}</Text>
    </Pressable>
  );
}

export default function AvatarCreatorScreen({ onClose }: { onClose: () => void }) {
  const { selection, setSelection } = useAvatar();
  const [draft, setDraft] = useState<AvatarSelection>(selection);
  const group = ageToGroup(draft.age);
  const profile = getAvatarForUser(draft);

  const save = () => { setSelection(draft); onClose(); };

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.backdrop}>
        <View style={styles.frame}>
          <View style={styles.header}>
            <View style={{ width: 30 }} />
            <Text style={styles.title}>Create Your Avatar</Text>
            <Pressable onPress={onClose} hitSlop={10} style={styles.close}><Text style={styles.closeX}>✕</Text></Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
            <View style={styles.preview}>
              <View style={styles.stage}>
                <UserAvatar userType={draft.userType} gender={draft.gender} age={draft.age} size={210} />
              </View>
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
          </ScrollView>

          <View style={styles.footer}>
            <Pressable style={({ pressed }) => [styles.cta, pressed && { opacity: 0.9 }]} onPress={save}>
              <Text style={styles.ctaText}>✨  Set as my avatar</Text>
            </Pressable>
          </View>
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
    paddingTop: 52, paddingHorizontal: 16, paddingBottom: 10,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  title: { fontSize: 18, fontWeight: '900', color: '#21242B' },
  close: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  closeX: { fontSize: 18, fontWeight: '800', color: '#2A2E33' },
  body: { paddingHorizontal: 20, paddingBottom: 24 },
  preview: { alignItems: 'center', paddingVertical: 8 },
  stage: {
    width: 220, height: 230, borderRadius: 28, backgroundColor: '#FFF6EC',
    alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 6,
    borderWidth: 1.5, borderColor: '#FFE6CF',
  },
  pLabel: { marginTop: 12, fontSize: 17, fontWeight: '900', color: '#21242B', textAlign: 'center' },
  pOutfit: { marginTop: 3, fontSize: 12.5, color: '#9AA0A6', fontWeight: '600', textAlign: 'center' },
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
