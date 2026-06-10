import 'dart:ui';
import 'avatar_profiles.dart';

/// Visual descriptor for the parametric avatar figure (ported from
/// AvatarFigure.tsx `styleFor` + AvatarStyle). Drives one CustomPainter that
/// renders all 18 personas.
enum TopKind { blazer, shirt, tshirt, hoodie, kurta, saree }

enum BottomKind { trousers, jeans, track, sareeSkirt }

enum Accessory { laptopBag, handbag, backpack, notebook, book, tablet, shoppingBag, phone }

enum HairStyle { long, bun, short }

class AvatarStyle {
  final Color skin;
  final Color hair;
  final HairStyle hairStyle;
  final bool grey;
  final TopKind topKind;
  final Color top;
  final Color inner;
  final Color? tie;
  final BottomKind bottomKind;
  final Color bottom;
  final Accessory accessory;
  final Color accent;
  final bool bindi;

  const AvatarStyle({
    required this.skin,
    required this.hair,
    required this.hairStyle,
    required this.grey,
    required this.topKind,
    required this.top,
    required this.inner,
    this.tie,
    required this.bottomKind,
    required this.bottom,
    required this.accessory,
    required this.accent,
    this.bindi = false,
  });

  AvatarStyle _copy({
    TopKind? topKind,
    Color? top,
    Color? inner,
    Color? tie,
    BottomKind? bottomKind,
    Color? bottom,
    Accessory? accessory,
    Color? accent,
    bool? bindi,
  }) =>
      AvatarStyle(
        skin: skin,
        hair: hair,
        hairStyle: hairStyle,
        grey: grey,
        topKind: topKind ?? this.topKind,
        top: top ?? this.top,
        inner: inner ?? this.inner,
        tie: tie ?? this.tie,
        bottomKind: bottomKind ?? this.bottomKind,
        bottom: bottom ?? this.bottom,
        accessory: accessory ?? this.accessory,
        accent: accent ?? this.accent,
        bindi: bindi ?? this.bindi,
      );
}

/// Darken a color by [a] (0-255 per channel).
Color shade(Color c, [int a = 24]) => Color.fromARGB(
      255,
      (c.r * 255 - a).clamp(0, 255).round(),
      (c.g * 255 - a).clamp(0, 255).round(),
      (c.b * 255 - a).clamp(0, 255).round(),
    );

/// Lighten a color by [a].
Color tint(Color c, [int a = 20]) => Color.fromARGB(
      255,
      (c.r * 255 + a).clamp(0, 255).round(),
      (c.g * 255 + a).clamp(0, 255).round(),
      (c.b * 255 + a).clamp(0, 255).round(),
    );

const _skin = {
  AgeGroup.a18_25: Color(0xFFC68A5E),
  AgeGroup.a25_40: Color(0xFFB97E54),
  AgeGroup.a40plus: Color(0xFFA9744B),
};

AvatarStyle styleFor(UserType userType, Gender gender, AgeGroup age) {
  final skin = _skin[age]!;
  final grey = age == AgeGroup.a40plus;
  final hairStyle = gender == Gender.female
      ? (age == AgeGroup.a18_25 ? HairStyle.long : HairStyle.bun)
      : HairStyle.short;

  final base = AvatarStyle(
    skin: skin,
    hair: const Color(0xFF2A201A),
    hairStyle: hairStyle,
    grey: grey,
    topKind: TopKind.shirt,
    top: const Color(0xFF5BA6C9),
    inner: const Color(0xFFF4ECD8),
    bottomKind: BottomKind.trousers,
    bottom: const Color(0xFF3A3E4A),
    accessory: Accessory.notebook,
    accent: const Color(0xFF5A4634),
  );

  switch ((userType, gender, age)) {
    case (UserType.workingProfessional, Gender.female, AgeGroup.a18_25):
      return base._copy(topKind: TopKind.blazer, top: const Color(0xFF2E7D8A), inner: const Color(0xFFF4ECD8), bottom: const Color(0xFF34384A), accessory: Accessory.laptopBag, accent: const Color(0xFF5A4634));
    case (UserType.workingProfessional, Gender.female, AgeGroup.a25_40):
      return base._copy(topKind: TopKind.kurta, top: const Color(0xFF8A3A57), inner: const Color(0xFFF2E7D8), bottom: const Color(0xFF2E3340), accessory: Accessory.handbag, accent: const Color(0xFF7A5A3A));
    case (UserType.workingProfessional, Gender.female, AgeGroup.a40plus):
      return base._copy(topKind: TopKind.blazer, top: const Color(0xFF34553F), inner: const Color(0xFFEFE6D4), bottom: const Color(0xFF33384A), accessory: Accessory.handbag, accent: const Color(0xFF5A4634));
    case (UserType.workingProfessional, Gender.male, AgeGroup.a18_25):
      return base._copy(topKind: TopKind.shirt, top: const Color(0xFF6FA8D6), inner: const Color(0xFFFFFFFF), bottom: const Color(0xFFC8B189), accessory: Accessory.backpack, accent: const Color(0xFF3A6E8C));
    case (UserType.workingProfessional, Gender.male, AgeGroup.a25_40):
      return base._copy(topKind: TopKind.blazer, top: const Color(0xFF2C3550), inner: const Color(0xFFFFFFFF), tie: const Color(0xFF9B2F3A), bottom: const Color(0xFF2C3550), accessory: Accessory.laptopBag, accent: const Color(0xFF3A2E22));
    case (UserType.workingProfessional, Gender.male, AgeGroup.a40plus):
      return base._copy(topKind: TopKind.blazer, top: const Color(0xFF4A4E58), inner: const Color(0xFFEDEFF2), tie: const Color(0xFF3A5A86), bottom: const Color(0xFF3A3E47), accessory: Accessory.laptopBag, accent: const Color(0xFF3A2E22));
    case (UserType.student, Gender.female, AgeGroup.a18_25):
      return base._copy(topKind: TopKind.tshirt, top: const Color(0xFFE0699A), inner: const Color(0xFFE0699A), bottomKind: BottomKind.jeans, bottom: const Color(0xFF3E5C86), accessory: Accessory.backpack, accent: const Color(0xFFE0A526));
    case (UserType.student, Gender.female, AgeGroup.a25_40):
      return base._copy(topKind: TopKind.kurta, top: const Color(0xFF5BA6C9), inner: const Color(0xFFEAF4FA), bottom: const Color(0xFF2E3340), accessory: Accessory.tablet, accent: const Color(0xFF3A3530));
    case (UserType.student, Gender.female, AgeGroup.a40plus):
      return base._copy(topKind: TopKind.kurta, top: const Color(0xFF7E6BD0), inner: const Color(0xFFEFEAFB), bottom: const Color(0xFF3A3E47), accessory: Accessory.notebook, accent: const Color(0xFFC0432F));
    case (UserType.student, Gender.male, AgeGroup.a18_25):
      return base._copy(topKind: TopKind.hoodie, top: const Color(0xFFE0764B), inner: const Color(0xFFF4ECD8), bottomKind: BottomKind.jeans, bottom: const Color(0xFF3E5C86), accessory: Accessory.backpack, accent: const Color(0xFF33508A));
    case (UserType.student, Gender.male, AgeGroup.a25_40):
      return base._copy(topKind: TopKind.shirt, top: const Color(0xFF7FB04F), inner: const Color(0xFFFFFFFF), bottomKind: BottomKind.jeans, bottom: const Color(0xFF3E5C86), accessory: Accessory.tablet, accent: const Color(0xFF3A3530));
    case (UserType.student, Gender.male, AgeGroup.a40plus):
      return base._copy(topKind: TopKind.shirt, top: const Color(0xFF9AA0A6), inner: const Color(0xFFFFFFFF), bottom: const Color(0xFF3A3E47), accessory: Accessory.book, accent: const Color(0xFF7A2E2E));
    case (UserType.homemaker, Gender.female, AgeGroup.a18_25):
      return base._copy(topKind: TopKind.kurta, top: const Color(0xFFE0985F), inner: const Color(0xFFFBEFD8), bottom: const Color(0xFF5A4634), accessory: Accessory.shoppingBag, accent: const Color(0xFF3BB273));
    case (UserType.homemaker, Gender.female, AgeGroup.a25_40):
      return base._copy(topKind: TopKind.saree, top: const Color(0xFFC0567B), inner: const Color(0xFF7A2E4E), bottomKind: BottomKind.sareeSkirt, bottom: const Color(0xFFC0567B), accessory: Accessory.notebook, accent: const Color(0xFF5BA6C9), bindi: true);
    case (UserType.homemaker, Gender.female, AgeGroup.a40plus):
      return base._copy(topKind: TopKind.saree, top: const Color(0xFF34553F), inner: const Color(0xFF7A2E2E), bottomKind: BottomKind.sareeSkirt, bottom: const Color(0xFF34553F), accessory: Accessory.book, accent: const Color(0xFFC8821A), bindi: true);
    case (UserType.homemaker, Gender.male, AgeGroup.a18_25):
      return base._copy(topKind: TopKind.tshirt, top: const Color(0xFF5BA6C9), inner: const Color(0xFF5BA6C9), bottomKind: BottomKind.track, bottom: const Color(0xFF3A3E47), accessory: Accessory.phone, accent: const Color(0xFF2A2E33));
    case (UserType.homemaker, Gender.male, AgeGroup.a25_40):
      return base._copy(topKind: TopKind.shirt, top: const Color(0xFFE0A526), inner: const Color(0xFFFFFFFF), bottom: const Color(0xFF3A3E47), accessory: Accessory.notebook, accent: const Color(0xFF5BA6C9));
    case (UserType.homemaker, Gender.male, AgeGroup.a40plus):
      return base._copy(topKind: TopKind.kurta, top: const Color(0xFFEDE6D4), inner: const Color(0xFFF6F1E4), bottom: const Color(0xFF5A4634), accessory: Accessory.book, accent: const Color(0xFF7A2E2E));
  }
}

AvatarStyle styleForSelection(AvatarSelection s) =>
    styleFor(s.userType, s.gender, ageToGroup(s.age));
