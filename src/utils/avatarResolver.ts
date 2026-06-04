/**
 * avatarResolver — map a user's profile (userType + gender + age) to one of the
 * 18 avatar profiles, with a safe default fallback.
 */
import {
  AgeGroup, AvatarProfile, Gender, UserType, avatarProfiles, DEFAULT_PROFILE_ID,
} from '../data/avatarProfiles';

/** 18–25 → "18_25", 26–40 → "25_40", >40 → "40_plus". */
export function ageToGroup(age: number): AgeGroup {
  if (age <= 25) return '18_25';
  if (age <= 40) return '25_40';
  return '40_plus';
}

export const DEFAULT_AVATAR: AvatarProfile =
  avatarProfiles.find((p) => p.id === DEFAULT_PROFILE_ID) ?? avatarProfiles[0];

export function getProfileById(id: string | undefined | null): AvatarProfile {
  return avatarProfiles.find((p) => p.id === id) ?? DEFAULT_AVATAR;
}

export function getAvatarForUser(input: {
  userType?: UserType;
  gender?: Gender;
  age?: number;
  ageGroup?: AgeGroup;
}): AvatarProfile {
  const { userType, gender } = input;
  if (!userType || !gender || (input.age == null && !input.ageGroup)) return DEFAULT_AVATAR;
  const ageGroup = input.ageGroup ?? ageToGroup(input.age as number);
  const id = `${userType}_${gender}_${ageGroup}`;
  return getProfileById(id);
}
