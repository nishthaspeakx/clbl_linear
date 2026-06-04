/**
 * CharacterAvatar — the learner walking the map. Renders the persona-resolved
 * avatar (profession + gender + age) and bobs while walking. Position is driven
 * by Reanimated shared values owned by the screen, so the walk stays on the UI
 * thread and smooth.
 */
import React from 'react';
import { StyleSheet } from 'react-native';
import Svg from 'react-native-svg';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Gender, UserType } from '../data/avatarProfiles';
import { ageToGroup } from '../utils/avatarResolver';
import { AvatarFigure, styleFor } from './avatar/AvatarFigure';

const AVATAR_H = 80;
const AVATAR_W = Math.round((AVATAR_H * 64) / 120); // figure ratio

interface Props {
  x: SharedValue<number>;
  y: SharedValue<number>;
  walking: SharedValue<number>;
  userType: UserType;
  gender: Gender;
  age: number;
}

function CharacterAvatar({ x, y, walking, userType, gender, age }: Props) {
  const idle = useSharedValue(0);
  const bob = useSharedValue(0);
  React.useEffect(() => {
    idle.value = withRepeat(withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }), -1, true);
    bob.value = withRepeat(withTiming(1, { duration: 300, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [idle, bob]);

  const containerStyle = useAnimatedStyle(() => {
    const idleOffset = (idle.value - 0.5) * 4;
    const walkOffset = (bob.value - 0.5) * 12;
    const offset = walking.value * walkOffset + (1 - walking.value) * idleOffset;
    return {
      transform: [
        { translateX: x.value - AVATAR_W / 2 },
        { translateY: y.value - AVATAR_H + offset },
      ],
    };
  });

  const shadowStyle = useAnimatedStyle(() => {
    const squash = 1 - walking.value * (bob.value * 0.25) - (1 - walking.value) * idle.value * 0.08;
    return { transform: [{ scaleX: squash }], opacity: 0.24 };
  });

  const style = styleFor(userType, gender, ageToGroup(age));

  return (
    <Animated.View pointerEvents="none" style={[styles.container, containerStyle]}>
      <Animated.View style={[styles.shadow, shadowStyle]} />
      <Svg width={AVATAR_W} height={AVATAR_H} viewBox="0 0 64 120">
        <AvatarFigure style={style} pose="walking" shadow={false} />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: AVATAR_W,
    height: AVATAR_H,
    alignItems: 'center',
  },
  shadow: {
    position: 'absolute',
    bottom: 1,
    width: AVATAR_W * 0.66,
    height: 9,
    borderRadius: 9,
    backgroundColor: '#000',
  },
});

export default CharacterAvatar;
