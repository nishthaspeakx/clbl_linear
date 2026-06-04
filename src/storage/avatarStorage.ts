/**
 * avatarStorage — persists the learner's selected avatar profile
 * (userType + gender + age) so the map character stays consistent.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Gender, UserType } from '../data/avatarProfiles';

const KEY = '@english_town_map/avatar_v1';

export interface AvatarSelection {
  userType: UserType;
  gender: Gender;
  age: number;
}

/** Fallback when no profile is saved. */
export const DEFAULT_SELECTION: AvatarSelection = {
  userType: 'working_professional',
  gender: 'male',
  age: 32, // → 25_40
};

export async function loadAvatar(): Promise<AvatarSelection> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return DEFAULT_SELECTION;
    const p = JSON.parse(raw);
    if (p && p.userType && p.gender && typeof p.age === 'number') return p as AvatarSelection;
  } catch {
    // ignore
  }
  return DEFAULT_SELECTION;
}

export async function saveAvatar(sel: AvatarSelection): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(sel));
  } catch {
    // ignore
  }
}
