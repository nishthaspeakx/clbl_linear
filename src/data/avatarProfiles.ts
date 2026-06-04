/**
 * avatarProfiles — the 18 avatar combinations
 * (3 user types × 2 genders × 3 age groups) for the learner avatar.
 *
 * Each profile carries display metadata + an `assetKey` so the in-code SVG
 * avatars can later be swapped for PNG/WebP art without touching call sites.
 */
export type UserType = 'working_professional' | 'student' | 'homemaker';
export type Gender = 'female' | 'male';
export type AgeGroup = '18_25' | '25_40' | '40_plus';

export interface AvatarProfile {
  id: string;
  userType: UserType;
  gender: Gender;
  ageGroup: AgeGroup;
  label: string;
  outfit: string;
  assetKey: string;
}

/** Option lists for the selector UI. */
export const USER_TYPES: { value: UserType; label: string; emoji: string }[] = [
  { value: 'working_professional', label: 'Working Professional', emoji: '💼' },
  { value: 'student', label: 'Student', emoji: '🎒' },
  { value: 'homemaker', label: 'Homemaker', emoji: '🏠' },
];
export const GENDERS: { value: Gender; label: string }[] = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
];
export const AGE_GROUPS: { value: AgeGroup; label: string; age: number }[] = [
  { value: '18_25', label: '18–25', age: 21 },
  { value: '25_40', label: '25–40', age: 32 },
  { value: '40_plus', label: '40+', age: 48 },
];

const USER_LABEL: Record<UserType, string> = {
  working_professional: 'Working Professional',
  student: 'Student',
  homemaker: 'Homemaker',
};
const AGE_LABEL: Record<AgeGroup, string> = { '18_25': 'Young', '25_40': '', '40_plus': 'Senior' };
const GENDER_LABEL: Record<Gender, string> = { female: 'Female', male: 'Male' };

const OUTFIT: Record<string, string> = {
  working_professional_female_18_25: 'smart casual blazer + trousers, laptop bag',
  working_professional_female_25_40: 'office kurta-blazer fusion, handbag',
  working_professional_female_40_plus: 'elegant formal kurta/blazer, handbag',
  working_professional_male_18_25: 'smart shirt + chinos, laptop backpack',
  working_professional_male_25_40: 'formal shirt + blazer + tie, laptop bag',
  working_professional_male_40_plus: 'formal shirt + grey blazer, laptop bag',
  student_female_18_25: 'casual top + jeans, backpack',
  student_female_25_40: 'comfortable kurti, tablet',
  student_female_40_plus: 'simple kurta, notebook',
  student_male_18_25: 'hoodie + jeans, backpack',
  student_male_25_40: 'casual shirt + jeans, tablet',
  student_male_40_plus: 'simple shirt + trousers, book',
  homemaker_female_18_25: 'simple kurti, shopping bag',
  homemaker_female_25_40: 'saree, notebook',
  homemaker_female_40_plus: 'elegant saree, book',
  homemaker_male_18_25: 't-shirt + track pants, phone',
  homemaker_male_25_40: 'casual shirt + trousers, notebook',
  homemaker_male_40_plus: 'simple kurta + trousers, book',
};

function build(): AvatarProfile[] {
  const out: AvatarProfile[] = [];
  (['working_professional', 'student', 'homemaker'] as UserType[]).forEach((userType) => {
    (['female', 'male'] as Gender[]).forEach((gender) => {
      (['18_25', '25_40', '40_plus'] as AgeGroup[]).forEach((ageGroup) => {
        const id = `${userType}_${gender}_${ageGroup}`;
        const ageWord = AGE_LABEL[ageGroup];
        const label = `${ageWord ? ageWord + ' ' : ''}${USER_LABEL[userType]} ${GENDER_LABEL[gender]}`.trim();
        out.push({
          id,
          userType,
          gender,
          ageGroup,
          label,
          outfit: OUTFIT[id],
          assetKey: `avatar_${userType.replace('working_professional', 'working')}_${gender}_${ageGroup}`,
        });
      });
    });
  });
  return out;
}

export const avatarProfiles: AvatarProfile[] = build();

export const DEFAULT_PROFILE_ID = 'working_professional_male_25_40';
