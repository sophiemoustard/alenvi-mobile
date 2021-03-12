/* eslint-disable max-len */
import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import { ICON } from '../../src/styles/metrics';

interface CoursesSelectedIconProps {
  style?: object,
  size?: number,
}

const CoursesSelectedIcon = ({ style, size = ICON.MD }: CoursesSelectedIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
    <Rect x="4" y="4" width="16" height="16" fill="#FBB8D2"/>
    <Rect x="8" y="4" width="8" height="10" fill="#FFEBF1"/>
    <Path d="M7 5H5V19H19V5H17V15C17.0012 15.1713 16.9584 15.3401 16.8756 15.4901C16.7928 15.6401 16.6729 15.7663 16.5274 15.8566C16.3818 15.947 16.2155 15.9984 16.0444 16.006C15.8732 16.0136 15.703 15.9771 15.55 15.9L12 14.11L8.45 15.88C8.29852 15.9563 8.13012 15.9929 7.96062 15.9862C7.79112 15.9796 7.6261 15.9299 7.48109 15.8419C7.33608 15.7539 7.21584 15.6304 7.13168 15.4832C7.04752 15.3359 7.0022 15.1696 7 15V5ZM5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 3.9 3.9 3 5 3ZM9 5V13.38L11.55 12.11C11.6896 12.0397 11.8437 12.003 12 12.003C12.1563 12.003 12.3104 12.0397 12.45 12.11L15 13.38V5H9Z" fill="#C12862"/>
  </Svg>
);

export default CoursesSelectedIcon;
