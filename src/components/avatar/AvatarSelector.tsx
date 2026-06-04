/**
 * AvatarSelector — pick user type / gender / age group and preview the avatar
 * live. Writes to the shared AvatarContext (persisted), so the map character
 * updates immediately.
 */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AGE_GROUPS, GENDERS, USER_TYPES } from '../../data/avatarProfiles';
import { ageToGroup, getAvatarForUser } from '../../utils/avatarResolver';
import { useAvatar } from './AvatarContext';
import UserAvatar from './UserAvatar';

const PRIMARY = '#FF7A00';

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipOn]}>
      <Text style={[styles.chipText, active && styles.chipTextOn]} numberOfLines={1}>{label}</Text>
    </Pressable>
  );
}

export default function AvatarSelector() {
  const { selection, setSelection } = useAvatar();
  const group = ageToGroup(selection.age);
  const profile = getAvatarForUser(selection);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Your Avatar</Text>
      <Text style={styles.sub}>Changes by profession, gender & age.</Text>

      <View style={styles.preview}>
        <UserAvatar userType={selection.userType} gender={selection.gender} age={selection.age} size={150} />
        <Text style={styles.previewLabel}>{profile.label}</Text>
        <Text style={styles.previewOutfit}>{profile.outfit}</Text>
      </View>

      <Text style={styles.group}>I am a…</Text>
      <View style={styles.row}>
        {USER_TYPES.map((u) => (
          <Chip key={u.value} label={`${u.emoji} ${u.label}`} active={selection.userType === u.value}
            onPress={() => setSelection({ ...selection, userType: u.value })} />
        ))}
      </View>

      <Text style={styles.group}>Gender</Text>
      <View style={styles.row}>
        {GENDERS.map((g) => (
          <Chip key={g.value} label={g.label} active={selection.gender === g.value}
            onPress={() => setSelection({ ...selection, gender: g.value })} />
        ))}
      </View>

      <Text style={styles.group}>Age group</Text>
      <View style={styles.row}>
        {AGE_GROUPS.map((a) => (
          <Chip key={a.value} label={a.label} active={group === a.value}
            onPress={() => setSelection({ ...selection, age: a.age })} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 22, padding: 18, marginTop: 16,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 14, shadowOffset: { width: 0, height: 5 }, elevation: 3,
  },
  title: { fontSize: 17, fontWeight: '900', color: '#2A2E33' },
  sub: { fontSize: 12.5, color: '#9AA0A6', marginTop: 3 },
  preview: { alignItems: 'center', paddingVertical: 14 },
  previewLabel: { marginTop: 8, fontSize: 15, fontWeight: '800', color: '#2A2E33', textAlign: 'center' },
  previewOutfit: { marginTop: 2, fontSize: 11.5, color: '#9AA0A6', fontWeight: '600', textAlign: 'center' },
  group: { fontSize: 12.5, fontWeight: '800', color: '#6B7177', marginTop: 12, marginBottom: 7 },
  row: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4 },
  chip: {
    margin: 4, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 14,
    backgroundColor: '#F4F5F7', borderWidth: 1.5, borderColor: '#ECEDEF',
  },
  chipOn: { backgroundColor: '#FFF1E2', borderColor: PRIMARY },
  chipText: { fontSize: 13, fontWeight: '700', color: '#6B7177' },
  chipTextOn: { color: PRIMARY },
});
