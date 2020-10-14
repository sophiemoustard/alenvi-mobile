import React, { useEffect, useContext } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import pick from 'lodash/pick';
import './ReactotronConfig';
import asyncStorage from './core/helpers/asyncStorage';
import Profile from './screens/Profile';
import { Context as AuthContext } from './context/AuthContext';
import { navigationRef } from './navigationRef';
import Authentication from './screens/Authentication';
import ForgotPassword from './screens/ForgotPassword';
import Explore from './screens/Explore';
import CourseList from './screens/courses/CourseList';
import CourseProfile from './screens/courses/CourseProfile';
import CardContainer from './screens/courses/CardContainer';
import MainActions from './store/main/actions';
import Actions from './store/actions';
import { PINK, WHITE } from './styles/colors';
import { ActionType, ActionWithoutPayloadType, StateType } from './types/store/StoreType';
import Users from './api/users';
import { UserType } from './types/UserType';

interface TabBarIconProps {
  color: string,
  size: number,
}

const CourseStack = createStackNavigator();

const Courses = () => (
  <CourseStack.Navigator headerMode="none">
    <CourseStack.Screen name="CourseList" component={CourseList} />
    <CourseStack.Screen name="CourseProfile" component={CourseProfile} />
  </CourseStack.Navigator>
);

const Tab = createBottomTabNavigator();

const tabBarIcon = route => ({ size, color }: TabBarIconProps) => {
  const icons = { Courses: 'book', Explore: 'search', Profile: 'person-outline' };

  return (
    <MaterialIcons name={icons[route.name]} color={color} size={size} />
  );
};

const Home = () => {
  const screenOptions = ({ route }) => ({ tabBarIcon: tabBarIcon(route) });

  return (
    <Tab.Navigator
      tabBarOptions={{ activeTintColor: PINK[500] }}
      screenOptions={screenOptions}
      initialRouteName="Courses"
    >
      <Tab.Screen name="Explore" component={Explore} options={{ tabBarLabel: 'Explorer' }} />
      <Tab.Screen name="Courses" component={Courses} options={{ tabBarLabel: 'Mes formations' }} />
      <Tab.Screen name="Profile" component={Profile} options={{ tabBarLabel: 'Profil' }} />
    </Tab.Navigator>
  );
};

const MainStack = createStackNavigator();

interface AppContainerProps {
  setLoggedUser: (user: UserType) => void,
  resetAllReducers: () => void,
  statusBarVisible: boolean,
}

const AppContainer = ({ setLoggedUser, resetAllReducers, statusBarVisible }: AppContainerProps) => {
  const { tryLocalSignIn, alenviToken, appIsReady } = useContext(AuthContext);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { tryLocalSignIn(); }, []);

  useEffect(() => {
    async function setUser() {
      const userId = await asyncStorage.getUserId();
      const user = await Users.getById(userId);
      setLoggedUser(pick(user, ['_id', 'identity.firstname', 'identity.lastname', 'local.email']));
    }
    if (alenviToken) setUser();
    else resetAllReducers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alenviToken]);

  if (!appIsReady) return null;

  const styles = style(statusBarVisible);

  return (
    <NavigationContainer ref={navigationRef}>
      <View style={styles.statusBar}>
        <StatusBar hidden={!statusBarVisible} translucent barStyle="dark-content" backgroundColor={WHITE} />
      </View>
      <MainStack.Navigator screenOptions={{ headerShown: false }}>
        {alenviToken === null
          ? <>
            <MainStack.Screen name="Authentication" component={Authentication} />
            <MainStack.Screen name="ForgotPassword" component={ForgotPassword} />
          </>
          : <>
            <MainStack.Screen name="Home" component={Home} />
            <MainStack.Screen name="CardContainer" component={CardContainer} options={{ gestureEnabled: false }} />
          </>
        }
      </MainStack.Navigator>
    </NavigationContainer>
  );
};

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

const style = (statusBarVisible: boolean) => StyleSheet.create({
  statusBar: {
    display: statusBarVisible ? 'flex' : 'none',
    backgroundColor: WHITE,
    height: STATUSBAR_HEIGHT,
  },
});

const mapStateToProps = (state: StateType) => ({
  statusBarVisible: state.main.statusBarVisible,
});

const mapDispatchToProps = (dispatch: ({ type }: ActionType | ActionWithoutPayloadType) => void) => ({
  setLoggedUser: (user: UserType) => dispatch(MainActions.setLoggedUser(user)),
  resetAllReducers: () => dispatch(Actions.resetAllReducers()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
