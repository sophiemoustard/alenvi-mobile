import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { BLENDED_COURSE_REGISTRATION, GRANTED, DENIED } from '../data/constants';
import { navigationRef } from '../../navigationRef';
import asyncStorage from './asyncStorage';
import Users from '../../api/users';

export const registerForPushNotificationsAsync = async () => {
  if (!Constants.isDevice) return { token: null, status: DENIED };

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== GRANTED) {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;

  if (finalStatus !== GRANTED) return { token, status: DENIED };

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync(
      'default',
      {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      }
    );
  }

  return { token, status: GRANTED };
};

export const handleNotificationResponse = (response) => {
  const { type, _id } = response.notification.request.content.data;

  switch (type) {
    case BLENDED_COURSE_REGISTRATION:
      return navigationRef.current?.navigate('CourseProfile', { courseId: _id });
    default:
      return null;
  }
};

export const handleExpoToken = async (data) => {
  try {
    const userId = await asyncStorage.getUserId();
    if (!userId) return;

    const { token, status } = data;
    if (token && status === GRANTED) await Users.updateById(userId, { formationExpoToken: token });
  } catch (e) {
    console.error(e);
  }
};