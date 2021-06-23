import React from 'react';
import { Text, View } from 'react-native';
import styles from './styles';

interface ErrorMessageProps {
  style?: object,
  errorState: any,
}

const ErrorMessage = ({ style, errorState }: ErrorMessageProps) => (
  <View style={style}>
    { errorState.error && <Text style={styles.message}>{errorState.message}</Text> }
  </View>
);

export default ErrorMessage;
