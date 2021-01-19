import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  ImageBackground,
  FlatList,
  ScrollView,
  StyleProp,
  ViewStyle,
  LogBox,
  BackHandler,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import get from 'lodash/get';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { NavigationType } from '../../../types/NavigationType';
import Courses from '../../../api/courses';
import { GREY, WHITE } from '../../../styles/colors';
import { ICON } from '../../../styles/metrics';
import OnSiteCell from '../../../components/steps/OnSiteCell';
import ELearningCell from '../../../components/ELearningCell';
import { Context as AuthContext } from '../../../context/AuthContext';
import { ON_SITE, E_LEARNING } from '../../../core/data/constants';
import commonStyles from '../../../styles/common';
import { CourseType } from '../../../types/CourseType';
import styles from './styles';
import MainActions from '../../../store/main/actions';
import CoursesActions from '../../../store/courses/actions';
import FeatherButton from '../../../components/icons/FeatherButton';
import ProgressBar from '../../../components/cards/ProgressBar';
import { getLoggedUserId } from '../../../store/main/selectors';

LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

interface CourseProfileProps {
  route: { params: { courseId: string, endedActivity: string} },
  navigation: NavigationType,
  userId: string,
  setStatusBarVisible: (boolean) => void,
  resetCourseReducer: () => void,
}

const CourseProfile = ({ route, navigation, userId, setStatusBarVisible, resetCourseReducer }: CourseProfileProps) => {
  const [course, setCourse] = useState<CourseType | null>(null);
  const { signOut } = useContext(AuthContext);

  const getCourse = async () => {
    try {
      const fetchedCourse = await Courses.getCourse(route.params.courseId);
      setCourse(fetchedCourse);
    } catch (e) {
      if (e.status === 401) signOut();
      setCourse(null);
    }
  };

  useEffect(() => {
    async function fetchData() { await getCourse(); }
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isFocused = useIsFocused();
  useEffect(() => {
    async function fetchData() { await getCourse(); }
    if (isFocused) {
      setStatusBarVisible(true);
      fetchData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  const hardwareBackPress = () => {
    goBack();
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', hardwareBackPress);

    return () => { BackHandler.removeEventListener('hardwareBackPress', hardwareBackPress); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const programImage = get(course, 'subProgram.program.image.link') || '';
  const programName = get(course, 'subProgram.program.name') || '';
  const source = programImage
    ? { uri: programImage }
    : require('../../../../assets/images/authentication_background_image.jpg');

  const goBack = () => {
    resetCourseReducer();
    navigation.navigate('Home', { screen: 'Courses', params: { screen: 'CourseList' } });
  };

  const renderCells = ({ item, index }) => {
    if (item.type === ON_SITE) {
      return (
        <OnSiteCell step={item} slots={course?.slots} index={index} navigation={navigation}
          profileId={route.params.courseId} />
      );
    }

    if (item.type === E_LEARNING) {
      return <ELearningCell step={item} index={index} navigation={navigation} profileId={route.params.courseId}
        endedActivity={route.params.endedActivity} />;
    }

    return null;
  };

  const renderSeparator = () => <View style={styles.separator} />;

  const goToAbout = () => {
    const program = {
      ...course?.subProgram.program,
      subPrograms: [{ ...course?.subProgram, courses: [{ ...course, trainees: [userId] }] }],
    };
    navigation.navigate('About', { program, isFromCourses: true });
  };

  return course && (
    <ScrollView style={commonStyles.container} nestedScrollEnabled={false} showsVerticalScrollIndicator={false}>
      <ImageBackground source={source} imageStyle={styles.image}
        style={{ resizeMode: 'cover' } as StyleProp<ViewStyle>}>
        <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.4)']} style={styles.gradient} />
        <View style={styles.header}>
          <FeatherButton style={styles.arrow} onPress={goBack} name="arrow-left" color={WHITE} size={ICON.MD}
            iconStyle={styles.arrowShadow} />
          <Text style={styles.title}>{programName}{course.misc ? ` - ${course.misc}` : ''}</Text>
        </View>
      </ImageBackground>
      <View style={styles.aboutContainer}>
        <TouchableOpacity style={styles.aboutContent} onPress={goToAbout}>
          <Feather name={'info'} color={GREY[600]} size={ICON.MD} />
          <Text style={styles.aboutText}>A propos</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.progressBarContainer}>
        <Text style={styles.progressBarText}>ÉTAPES</Text>
        <ProgressBar progress={course.progress * 100} />
        <Text style={styles.progressBarText}>{(course.progress * 100).toFixed(0)}%</Text>
      </View>
      <FlatList style={styles.flatList} data={course.subProgram.steps} keyExtractor={item => item._id}
        renderItem={renderCells} ItemSeparatorComponent={renderSeparator} />
    </ScrollView>
  );
};

const mapStateToProps = state => ({ userId: getLoggedUserId(state) });

const mapDispatchToProps = dispatch => ({
  setStatusBarVisible: statusBarVisible => dispatch(MainActions.setStatusBarVisible(statusBarVisible)),
  resetCourseReducer: () => dispatch(CoursesActions.resetCourseReducer()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CourseProfile);
