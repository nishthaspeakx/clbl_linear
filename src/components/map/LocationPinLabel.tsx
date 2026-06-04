/**
 * LocationPinLabel — a small "map pin" chip (drawn teardrop marker + location
 * name) shown under the subtopic title.
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

export function PinMark({ color, size = 13 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 1.5 C7.3 1.5 4 5 4 9.4 C4 15.2 12 22.5 12 22.5 C12 22.5 20 15.2 20 9.4 C20 5 16.7 1.5 12 1.5 Z"
        fill={color}
      />
      <Circle cx={12} cy={9.4} r={3.1} fill="#FFFFFF" />
    </Svg>
  );
}

interface Props {
  location: string;
  pin: string;
  text: string;
  bg: string;
}

export default function LocationPinLabel({ location, pin, text, bg }: Props) {
  return (
    <View style={[styles.chip, { backgroundColor: bg }]}>
      <PinMark color={pin} size={12} />
      <Text style={[styles.loc, { color: text }]} numberOfLines={1}>{location}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 9,
    paddingLeft: 4,
    paddingRight: 8,
    paddingVertical: 2,
    marginTop: 4,
  },
  loc: { fontSize: 11, fontWeight: '800', marginLeft: 3, flexShrink: 1 },
});
