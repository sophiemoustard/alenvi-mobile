import { StyleSheet } from 'react-native';
import { FIRA_SANS_REGULAR } from '../../../../styles/fonts';
import { ABSOLUTE_BOTTOM_POSITION, INPUT_HEIGHT, MARGIN, PADDING } from '../../../../styles/metrics';

const styles = (textColor: string, backgroundColor: string) => StyleSheet.create({
  container: {
    marginHorizontal: MARGIN.LG,
    flexGrow: 1,
    paddingBottom: PADDING.XL,
  },
  draggableContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  questionContainer: {
    flexGrow: 1,
  },
  question: {
    ...FIRA_SANS_REGULAR.MD,
  },
  explanation: {
    color: textColor,
    minHeight: INPUT_HEIGHT,
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: ABSOLUTE_BOTTOM_POSITION,
    backgroundColor,
  },
  footerContainer: {
    backgroundColor,
  },
});

export default styles;