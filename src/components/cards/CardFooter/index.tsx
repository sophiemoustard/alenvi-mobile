import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ArrowButton from '../../ArrowButton';
import { LEFT, RIGHT } from '../../../core/data/constants';
import styles from './styles';

interface CardFooterProps {
  index: number,
  color?: string,
  removeRight?: boolean
}

const CardFooter = ({ index, color, removeRight }: CardFooterProps) => {
  const removeLeft = index === 0;
  const navigation = useNavigation();

  let justifyContent;
  if (removeLeft) justifyContent = 'flex-end';
  else if (removeRight) justifyContent = 'flex-start';
  else justifyContent = 'space-between';

  return (
    <View style={styles({ justifyContent }).container}>
      {!removeLeft && <ArrowButton color={color} direction={LEFT}
        onPress={() => navigation.navigate(`card-${index - 1}`)} />}
      {!removeRight && <ArrowButton color={color} direction={RIGHT}
        onPress={() => navigation.navigate(`card-${index + 1}`)} />}
    </View>
  );
};

export default CardFooter;
