/**
 * SoundToggle — a small 🔊 / 🔇 button that mutes/unmutes all game feedback
 * (sound + haptics). Reflects and persists the shared preference. Drop it into
 * the map header, the Rewards page, or a settings screen.
 *
 *   <SoundToggle />                 // default round icon button
 *   <SoundToggle variant="ghost" /> // transparent (for dark/photo headers)
 */
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useSoundEffects } from '../../hooks/useSoundEffects';

interface Props {
  size?: number;
  variant?: 'solid' | 'ghost';
  style?: object;
}

export default function SoundToggle({ size = 36, variant = 'solid', style }: Props) {
  const { soundEnabled, toggleSound, playSound, triggerHaptic } = useSoundEffects();

  const onPress = () => {
    // if we're about to turn sound ON, give immediate feedback
    const turningOn = !soundEnabled;
    toggleSound();
    if (turningOn) {
      playSound('button_tap');
      triggerHaptic('light');
    }
  };

  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="switch"
      accessibilityState={{ checked: soundEnabled }}
      accessibilityLabel={soundEnabled ? 'Mute sounds' : 'Unmute sounds'}
      style={({ pressed }) => [
        styles.base,
        { width: size, height: size, borderRadius: size / 3 },
        variant === 'solid' ? styles.solid : styles.ghost,
        pressed && { opacity: 0.7 },
        style,
      ]}
    >
      <Text style={{ fontSize: size * 0.5 }}>{soundEnabled ? '🔊' : '🔇'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  solid: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 3,
  },
  ghost: { backgroundColor: 'rgba(255,255,255,0.16)' },
});
