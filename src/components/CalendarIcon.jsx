import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, StyleSheet } from 'react-native';
import moment from '../core/helpers/moment';
import { capitalize } from '../core/helpers/utils';
import { BORDER_RADIUS, PADDING, BORDER_WIDTH } from '../styles/metrics';
import { PINK, WHITE, GREY } from '../styles/colors';

const CalendarIcon = ({ dates }) => {
  let daysOfWeek, daysOfMonth, months;
  const dateFormat = 'DD/MM/YYY';
  if (dates.length) {
    const datesFormatted = [...new Set(dates.map(date => moment(date).format(dateFormat)))];

    daysOfWeek = capitalize(moment(datesFormatted[0], dateFormat).format('ddd'));
    daysOfMonth = capitalize(moment(datesFormatted[0], dateFormat).format('D'));
    months = capitalize(moment(datesFormatted[0], dateFormat).format('MMM'));

    if (datesFormatted.length > 1) {
      daysOfWeek += `, ${capitalize(moment(datesFormatted[1], dateFormat).format('ddd'))}`;
      daysOfMonth += `, ${capitalize(moment(datesFormatted[1], dateFormat).format('D'))}`;
      const month = capitalize(moment(datesFormatted[1], dateFormat).format('MMM'));
      if (!months.match(month)) months += `, ${month}`;
    }

    if (datesFormatted.length > 2) {
      daysOfWeek += '...';
      daysOfMonth += '...';
      const monthsSet = [... new Set(datesFormatted.map(date => capitalize(moment(date, dateFormat).format('MMM'))))];
      if (monthsSet.length > 2) months += '...';
    }
  }

  return (
    <View style={styles.dateContainer}>
      <View style={styles.dayOfWeekContainer}>
        <Text style={styles.dayOfWeek}>{dates.length ? daysOfWeek : '' }</Text>
      </View>
      {dates.length
        ? <>
          <Text style={styles.dayOfMonth}>{daysOfMonth}</Text>
          <Text style={styles.month}>{months}</Text>
        </>
        : <Text style={styles.toPlan}>?</Text>
      }
    </View>
  );
};

CalendarIcon.propTypes = {
  dates: PropTypes.arrayOf(PropTypes.string),
};

const styles = StyleSheet.create({
  dateContainer: {
    minWidth: 50,
    height: 60,
    // Do not merge the borderWidths params, avoid an unwanted line in android
    borderTopWidth: BORDER_WIDTH,
    borderBottomWidth: BORDER_WIDTH,
    borderLeftWidth: BORDER_WIDTH,
    borderRightWidth: BORDER_WIDTH,
    backgroundColor: WHITE,
    borderRadius: BORDER_RADIUS.SM,
    borderColor: PINK[500],
    alignItems: 'center',
    paddingBottom: PADDING.SM,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: GREY[200],
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  dayOfWeekContainer: {
    backgroundColor: PINK[500],
    width: '100%',
    paddingHorizontal: PADDING.MD,
    justifyContent: 'center',
  },
  dayOfWeek: {
    color: WHITE,
    fontSize: 12,
    textAlign: 'center',
  },
  dayOfMonth: {
    fontSize: 18,
    height: 22,
    paddingHorizontal: PADDING.SM,
  },
  month: {
    color: PINK[500],
    fontSize: 14,
    height: 18,
    paddingHorizontal: PADDING.SM,
  },
  toPlan: {
    fontSize: 24,
    height: 40,
  }
});

export default CalendarIcon;