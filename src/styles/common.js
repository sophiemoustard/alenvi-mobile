import { StyleSheet } from 'react-native';
import { NEUTRAL_BACKGROUND_COLOR, MAIN_MARGIN_LEFT, GREY } from './variables';
import { BORDER_RADIUS, MARGIN, PADDING, COURSE_CELL_WIDTH } from './metrics';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NEUTRAL_BACKGROUND_COLOR,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 28,
    marginLeft: MAIN_MARGIN_LEFT,
    marginVertical: MARGIN.XL,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: MAIN_MARGIN_LEFT,
  },
  courseCellContainer: {
    borderRadius: BORDER_RADIUS.SM,
    marginRight: MARGIN.SM,
    width: COURSE_CELL_WIDTH,
    borderWidth: 1,
    borderColor: GREY,
  },
  countContainer: {
    marginBottom: MARGIN.SM,
    paddingVertical: PADDING.XS,
    paddingHorizontal: PADDING.SM,
    marginLeft: MARGIN.SM,
    borderRadius: BORDER_RADIUS.XS,
  }
});
