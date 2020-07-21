import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import screensStyle from '../styles/screens.style';
import { MAIN_MARGIN_LEFT } from '../styles/variables.js';
import Courses from '../api/courses';
import Blob from '../components/Blob';
import AsyncStorage from '@react-native-community/async-storage';

class CourseListScreen extends Component {
  constructor(props) {
    super(props);

    this.state = { courses: [] };
  }

  async componentDidMount () {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      const courses = await Courses.getMyCourses({ trainees: userId });

      this.setState({ courses });
    } catch (e) {
      this.setState({ courses: [] });
    }
  }

  render () {
    return (
      <View style={screensStyle.container}>
        <Text style={screensStyle.title} testID='header'>Mes formations</Text>
        <View style={styles.blobContainer}>
          <Blob style={styles.blob} color="#FFEA95" />
        </View>
        <View style={styles.contentTitle}>
          <Text style={screensStyle.subtitle}>Formations en cours</Text>
          <Text style={styles.numberWithRound}> {this.state.courses.length} </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  nextEventContainer: {
    paddingLeft: MAIN_MARGIN_LEFT,
  },
  contentTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  blobContainer: { position: 'relative' },
  blob: { position: 'absolute', top: -10 },
  numberWithRound: {
    fontSize: 14,
    marginBottom: 10,
    backgroundColor: '#FFF9DF',
    color: '#D5AD0A',
    fontWeight: 'bold',
    padding: 2,
    marginLeft: 8,
    borderRadius: 8,
  }
});

export default CourseListScreen;
