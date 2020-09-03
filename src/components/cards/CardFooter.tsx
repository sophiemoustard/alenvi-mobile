import React from 'react';
import { View, StyleSheet } from 'react-native';
import ArrowButton from '../ArrowButton';
import { navigate } from '../../navigationRef';
import { CARD_TEMPLATES, QUIZ, LEFT, RIGHT } from '../../core/data/constants';

interface CardFooterProps {
  index: number,
  template: string,
}

interface StylesProps {
  justifyContent: 'flex-end' | 'space-between' | 'flex-start',
}

const CardFooter = ({ index, template }: CardFooterProps) => {
  const cardTemplate = CARD_TEMPLATES.find(card => card.value === template);
  const leftRemoved = index === 0;
  const rightRemoved = cardTemplate?.type === QUIZ;

  let justifyContent;
  if (leftRemoved) justifyContent = 'flex-end';
  else if (rightRemoved) justifyContent = 'flex-start';
  else justifyContent = 'space-between';

  return (
    <View style={styles({ justifyContent }).container}>
      {!leftRemoved && <ArrowButton direction={LEFT} onPress={() => navigate(`card-${index - 1}`)} />}
      {!rightRemoved && <ArrowButton direction={RIGHT} onPress={() => navigate(`card-${index + 1}`)} />}
    </View>
  );
};

const styles = ({ justifyContent }: StylesProps) => StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent,
  },
});

export default CardFooter;