import React from 'react';
import { Text, View, StyleSheet, ImageBackground, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import get from 'lodash/get';
import { NavigationType } from '../types/NavigationType';
import { WHITE, TRANSPARENT_GREY } from '../styles/colors';
import { BORDER_RADIUS, PADDING, PROGRAM_CELL_WIDTH, BORDER_WIDTH } from '../styles/metrics';
import { FIRA_SANS_MEDIUM } from '../styles/fonts';
import { ProgramType } from '../types/ProgramType';

interface ProgramCellProps {
  courseId?: string,
  navigation?: NavigationType,
  program: ProgramType,
  disableNavigation?: boolean,
}

const ProgramCell = ({ courseId, navigation, program, disableNavigation = false }: ProgramCellProps) => {
  const programName = program.name || '';
  const programImage = get(program, 'image.link') || '';

  const source = programImage
    ? { uri: programImage }
    : require('../../assets/images/authentication_background_image.jpg');
  const goToCourse = () => navigation?.navigate(
    'Home',
    { screen: 'Courses', params: { screen: 'CourseProfile', params: { courseId } } }
  );

  return (
    <TouchableOpacity style={styles.courseContainer} disabled={disableNavigation} onPress={goToCourse}>
      <View style={styles.imageContainer}>
        <ImageBackground source={source} imageStyle={styles.image}
          style={{ resizeMode: 'contain' } as StyleProp<ViewStyle>} />
      </View>
      <View style={styles.title}>
        <Text lineBreakMode={'tail'} numberOfLines={2}>{programName}</Text>
      </View>
    </TouchableOpacity>
  );
};

const imageHeight = 100;
const styles = StyleSheet.create({
  courseContainer: {
    borderRadius: BORDER_RADIUS.SM,
    width: PROGRAM_CELL_WIDTH,
    borderWidth: BORDER_WIDTH,
    borderColor: TRANSPARENT_GREY,
    overflow: 'hidden',
  },
  image: {
    height: imageHeight,
  },
  imageContainer: {
    height: imageHeight,
  },
  title: {
    ...FIRA_SANS_MEDIUM.MD,
    padding: PADDING.MD,
    backgroundColor: WHITE,
    borderBottomLeftRadius: BORDER_RADIUS.SM,
    borderBottomRightRadius: BORDER_RADIUS.SM,
  },
});

export default ProgramCell;