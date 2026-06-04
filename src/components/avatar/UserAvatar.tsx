/**
 * UserAvatar — render the learner avatar for a persona at any size.
 * The single entry point for avatar art (swap the SVG figure for image assets
 * here later without touching call sites).
 */
import React from 'react';
import Svg from 'react-native-svg';
import { AgeGroup, Gender, UserType } from '../../data/avatarProfiles';
import { ageToGroup } from '../../utils/avatarResolver';
import { AvatarFigure, AvatarPose, styleFor } from './AvatarFigure';

const VB_W = 64;
const VB_H = 120;

interface Props {
  userType: UserType;
  gender: Gender;
  /** Provide either a numeric age or an explicit ageGroup. */
  age?: number;
  ageGroup?: AgeGroup;
  /** Rendered height in px (width is derived from the figure ratio). */
  size?: number;
  pose?: AvatarPose;
  shadow?: boolean;
}

export default function UserAvatar({
  userType, gender, age, ageGroup, size = 96, pose = 'standing', shadow = true,
}: Props) {
  const group = ageGroup ?? ageToGroup(age ?? 32);
  const style = styleFor(userType, gender, group);
  const w = Math.round((size * VB_W) / VB_H);
  return (
    <Svg width={w} height={size} viewBox={`0 0 ${VB_W} ${VB_H}`}>
      <AvatarFigure style={style} pose={pose} shadow={shadow} />
    </Svg>
  );
}
