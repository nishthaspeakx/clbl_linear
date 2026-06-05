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
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Gender, UserType } from '../data/avatarProfiles';
import { ageToGroup } from '../utils/avatarResolver';
import { EquipKey } from '../data/rewards';
import { AvatarFigure, AvatarStyle, styleFor } from './avatar/AvatarFigure';

const AVATAR_H = 80;
const AVATAR_W = Math.round((AVATAR_H * 64) / 120); // figure ratio

interface Props {
  x: SharedValue<number>;
  y: SharedValue<number>;
  walking: SharedValue<number>;
  userType: UserType;
  gender: Gender;
  age: number;
  equipped?: EquipKey[];
  outfit?: Partial<AvatarStyle>;
}

function CharacterAvatar({ x, y, walking, userType, gender, age, equipped = [], outfit }: Props) {
  // A single continuously-advancing phase drives a smooth sine gait (no yoyo
  // easing artefacts), and `walk` smoothly ramps the gait in/out so the start
  // and stop of the walk never pop.
  const phase = useSharedValue(0);
  const idle = useSharedValue(0);
  const walk = useSharedValue(0);
  React.useEffect(() => {
    phase.value = withRepeat(withTiming(1, { duration: 760, easing: Easing.linear }), -1, false);
    idle.value = withRepeat(withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [phase, idle]);
  useAnimatedReaction(
    () => walking.value,
    (w) => {
      'worklet';
      walk.value = withTiming(w, { duration: 220, easing: Easing.inOut(Easing.ease) });
    },
  );

  const containerStyle = useAnimatedStyle(() => {
    const w = walk.value;
    const ph = phase.value * Math.PI * 2;
    const bob = Math.sin(ph) * 3;            // gentle, continuous up-down
    const idleBob = (idle.value - 0.5) * 2.4; // soft breathing when still
    const offsetY = w * bob + (1 - w) * idleBob;
    const lean = w * Math.sin(ph + 0.5) * 2; // subtle sway → reads as a stride
    return {
      transform: [
        { translateX: x.value - AVATAR_W / 2 },
        { translateY: y.value - AVATAR_H + offsetY },
        { rotate: `${lean}deg` },
      ],
    };
  });

  const shadowStyle = useAnimatedStyle(() => {
    const squash = 1 - walk.value * (Math.abs(Math.sin(phase.value * Math.PI * 2)) * 0.16);
    return { transform: [{ scaleX: squash }], opacity: 0.22 };
  });

  const style = styleFor(userType, gender, ageToGroup(age));

  return (
    <Animated.View pointerEvents="none" style={[styles.container, containerStyle]}>
      <Animated.View style={[styles.shadow, shadowStyle]} />
      <Svg width={AVATAR_W} height={AVATAR_H} viewBox="0 0 64 120">
        <AvatarFigure style={style} pose="walking" shadow={false} equipped={equipped} outfit={outfit} />
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
