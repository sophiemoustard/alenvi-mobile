import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  FlatList,
  YellowBox,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { routeType, navigationType } from 'types/NavigationType';
import Courses from '../../api/courses';
import { WHITE, GREY } from '../../styles/colors';
import { MAIN_MARGIN_LEFT, ICON, MARGIN } from '../../styles/metrics';
import OnSiteCell from '../../components/steps/OnSiteCell';
import ELearningCell from '../../components/steps/ELearningCell';
import { ON_SITE, E_LEARNING } from '../../core/data/constants';
import commonStyles from '../../styles/common';
import { FIRA_SANS_BLACK } from '../../styles/fonts';

YellowBox.ignoreWarnings(['VirtualizedLists should never be nested']);

interface CourseProfileScreenProps {
  route: routeType,
  navigation: navigationType,
}

const CourseProfileScreen = ({ route, navigation }: CourseProfileScreenProps) => {
  const [course, setCourse] = useState(null);
  const getCourse = async () => {
    const fetchedCourse = await Courses.getCourse(route.params.courseId);
    setCourse(fetchedCourse);
  };

  useEffect(() => {
    async function fetchData() { await getCourse(); }
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isFocused = useIsFocused();
  useEffect(() => {
    async function fetchData() { await getCourse(); }
    if (isFocused) fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  const programImage = get(course, 'program.image.link') || '';
  const programName = get(course, 'program.name') || '';
  const source = programImage ? { uri: programImage } : require('../../../assets/authentication_background_image.jpg');
  const goBack = () => navigation.navigate('Home', { screen: 'Courses', params: { screen: 'CourseList' } });

  const renderCells = ({ item, index }) => {
    if (item.type === ON_SITE) return <OnSiteCell step={item} slots={course.slots} index={index} />;

    if (item.type === E_LEARNING) return <ELearningCell step={item} index={index} />;

    return null;
  };

  const renderSeparator = () => <View style={styles.separator} />;

  return course && (
    <ScrollView style={commonStyles.container} nestedScrollEnabled={false} showsVerticalScrollIndicator={false}>
      <ImageBackground source={source} imageStyle={styles.image} style={{ resizeMode: 'contain' }}>
        <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.4)']} style={styles.gradient} />
        <View style={styles.header}>
          <TouchableOpacity style={styles.arrow} onPress={goBack}>
            <Feather name="arrow-left" color={WHITE} size={ICON.MD} />
          </TouchableOpacity>
          <Text style={styles.title}>{programName}</Text>
        </View>
      </ImageBackground>
      <FlatList data={course.program.steps} keyExtractor={item => item._id} renderItem={renderCells}
        ItemSeparatorComponent={renderSeparator} />
    </ScrollView>
  );
};

CourseProfileScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.exact({
      courseId: PropTypes.string.isRequired,
    }),
  }),
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

const imageHeight = 200;
const styles = StyleSheet.create({
  image: {
    height: imageHeight,
    position: 'relative',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: imageHeight * 0.4,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    height: imageHeight,
    position: 'absolute',
  },
  arrow: {
    margin: MAIN_MARGIN_LEFT,
  },
  title: {
    ...FIRA_SANS_BLACK.XL,
    color: WHITE,
    margin: MAIN_MARGIN_LEFT,
    textShadowColor: GREY[800],
    textShadowRadius: 4,
    textShadowOffset: { width: 0, height: 1 },
  },
  separator: {
    marginBottom: MARGIN.MD,
  },
});

export default CourseProfileScreen;
