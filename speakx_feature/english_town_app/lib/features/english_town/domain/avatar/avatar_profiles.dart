/// Avatar persona system — 18 combinations (3 user types × 2 genders × 3 ages).
/// Ported from src/data/avatarProfiles.ts + avatarResolver.ts.
enum UserType { workingProfessional, student, homemaker }

enum Gender { female, male }

enum AgeGroup { a18_25, a25_40, a40plus }

class UserTypeOption {
  final UserType value;
  final String label;
  final String emoji;
  const UserTypeOption(this.value, this.label, this.emoji);
}

const kUserTypes = [
  UserTypeOption(UserType.workingProfessional, 'Working Professional', '💼'),
  UserTypeOption(UserType.student, 'Student', '🎒'),
  UserTypeOption(UserType.homemaker, 'Homemaker', '🏠'),
];

const kGenders = [
  (value: Gender.female, label: 'Female'),
  (value: Gender.male, label: 'Male'),
];

const kAgeGroups = [
  (value: AgeGroup.a18_25, label: '18–25', age: 21),
  (value: AgeGroup.a25_40, label: '25–40', age: 32),
  (value: AgeGroup.a40plus, label: '40+', age: 48),
];

/// The learner's chosen avatar (persisted).
class AvatarSelection {
  final UserType userType;
  final Gender gender;
  final int age;
  const AvatarSelection({
    required this.userType,
    required this.gender,
    required this.age,
  });

  static const initial = AvatarSelection(
    userType: UserType.workingProfessional,
    gender: Gender.male,
    age: 32,
  );

  AvatarSelection copyWith({UserType? userType, Gender? gender, int? age}) =>
      AvatarSelection(
        userType: userType ?? this.userType,
        gender: gender ?? this.gender,
        age: age ?? this.age,
      );

  Map<String, dynamic> toJson() =>
      {'userType': userType.name, 'gender': gender.name, 'age': age};

  static AvatarSelection fromJson(Map<String, dynamic> m) => AvatarSelection(
        userType: UserType.values.firstWhere((e) => e.name == m['userType'],
            orElse: () => UserType.workingProfessional),
        gender: Gender.values.firstWhere((e) => e.name == m['gender'],
            orElse: () => Gender.male),
        age: (m['age'] as num?)?.toInt() ?? 32,
      );
}

AgeGroup ageToGroup(int age) {
  if (age <= 25) return AgeGroup.a18_25;
  if (age <= 40) return AgeGroup.a25_40;
  return AgeGroup.a40plus;
}

const _userLabel = {
  UserType.workingProfessional: 'Working Professional',
  UserType.student: 'Student',
  UserType.homemaker: 'Homemaker',
};
const _ageWord = {AgeGroup.a18_25: 'Young', AgeGroup.a25_40: '', AgeGroup.a40plus: 'Senior'};
const _genderLabel = {Gender.female: 'Female', Gender.male: 'Male'};

/// Display label, e.g. "Senior Working Professional Female".
String profileLabel(AvatarSelection s) {
  final age = _ageWord[ageToGroup(s.age)]!;
  final prefix = age.isEmpty ? '' : '$age ';
  return '$prefix${_userLabel[s.userType]} ${_genderLabel[s.gender]}'.trim();
}

const _outfit = {
  'working_professional_female_18_25': 'smart casual blazer + trousers, laptop bag',
  'working_professional_female_25_40': 'office kurta-blazer fusion, handbag',
  'working_professional_female_40_plus': 'elegant formal kurta/blazer, handbag',
  'working_professional_male_18_25': 'smart shirt + chinos, laptop backpack',
  'working_professional_male_25_40': 'formal shirt + blazer + tie, laptop bag',
  'working_professional_male_40_plus': 'formal shirt + grey blazer, laptop bag',
  'student_female_18_25': 'casual top + jeans, backpack',
  'student_female_25_40': 'comfortable kurti, tablet',
  'student_female_40_plus': 'simple kurta, notebook',
  'student_male_18_25': 'hoodie + jeans, backpack',
  'student_male_25_40': 'casual shirt + jeans, tablet',
  'student_male_40_plus': 'simple shirt + trousers, book',
  'homemaker_female_18_25': 'simple kurti, shopping bag',
  'homemaker_female_25_40': 'saree, notebook',
  'homemaker_female_40_plus': 'elegant saree, book',
  'homemaker_male_18_25': 't-shirt + track pants, phone',
  'homemaker_male_25_40': 'casual shirt + trousers, notebook',
  'homemaker_male_40_plus': 'simple kurta + trousers, book',
};

String profileOutfit(AvatarSelection s) {
  const userKey = {
    UserType.workingProfessional: 'working_professional',
    UserType.student: 'student',
    UserType.homemaker: 'homemaker',
  };
  const ageKey = {AgeGroup.a18_25: '18_25', AgeGroup.a25_40: '25_40', AgeGroup.a40plus: '40_plus'};
  final id = '${userKey[s.userType]}_${s.gender.name}_${ageKey[ageToGroup(s.age)]}';
  return _outfit[id] ?? '';
}

/// Persona emoji stand-in for the 459-line parametric AvatarFigure SVG
/// (deferred — same approach as the town scenes).
String avatarEmoji(AvatarSelection s) {
  final f = s.gender == Gender.female;
  switch (s.userType) {
    case UserType.workingProfessional:
      return f ? '👩‍💼' : '👨‍💼';
    case UserType.student:
      return f ? '👩‍🎓' : '👨‍🎓';
    case UserType.homemaker:
      return f ? '👩' : '👨';
  }
}
