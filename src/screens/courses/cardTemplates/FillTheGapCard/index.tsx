import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { connect } from 'react-redux';
import shuffle from 'lodash/shuffle';
import { DraxProvider, DraxView } from 'react-native-drax';
import { useNavigation } from '@react-navigation/native';
import { StateType } from '../../../../types/store/StoreType';
import Selectors from '../../../../store/cards/selectors';
import { FillTheGapType, footerColorsType } from '../../../../types/CardType';
import CardHeader from '../../../../components/cards/CardHeader';
import styles from './styles';
import QuizCardFooter from '../../../../components/cards/QuizCardFooter';
import { PINK, GREY, GREEN, ORANGE } from '../../../../styles/colors';
import Actions from '../../../../store/cards/actions';
import FillTheGapProposition from '../../../../components/cards/FillTheGapProposition';
import FillTheGapQuestion from '../../../../components/cards/FillTheGapQuestion';
import FillTheGapPropositionList from '../../../../components/cards/FillTheGapPropositionList';
import { quizJingle } from '../../../../core/helpers/utils';

interface FillTheGap {
  card: FillTheGapType,
  index: number,
  isLoading: boolean,
  incGoodAnswersCount: () => void,
  setIsRightSwipeEnabled: (boolean) => void,
}

export interface FillTheGapAnswers {
  text: string
  visible: boolean,
}

const FillTheGapCard = ({ card, index, isLoading, incGoodAnswersCount, setIsRightSwipeEnabled }: FillTheGap) => {
  const [goodAnswers, setGoodAnswers] = useState<Array<string>>([]);
  const [propositions, setPropositions] = useState<Array<FillTheGapAnswers>>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Array<string>>([]);
  const [isValidated, setIsValidated] = useState<boolean>(false);
  const [isAnsweredCorrectly, setIsAnsweredCorrectly] = useState<boolean>(false);
  const areGapsFilled = !selectedAnswers.filter(answer => answer === '').length;
  const [footerColors, setFooterColors] = useState<footerColorsType>({
    buttons: PINK[500],
    text: GREY[100],
    background: GREY[100],
  });
  const navigation = useNavigation();

  useEffect(() => {
    if (!isLoading && !isValidated) {
      setGoodAnswers(card.gappedText.match(/<trou>[^<]*<\/trou>/g)?.map(rep => rep.replace(/<\/?trou>/g, '')) || []);
    }
  }, [card, isLoading, isValidated]);

  useEffect(() => {
    if (!isLoading && !isValidated) {
      setPropositions(shuffle([...card.falsyGapAnswers.map(a => a.text), ...goodAnswers])
        .map(proposition => ({ text: proposition, visible: true })));
      setSelectedAnswers(goodAnswers.map(() => ''));
    }
    setIsRightSwipeEnabled(isValidated);
  }, [card, goodAnswers, isLoading, isValidated, setIsRightSwipeEnabled]);

  useEffect(() => {
    if (!isValidated) {
      return setFooterColors({ buttons: PINK[500], text: GREY[100], background: GREY[100] });
    }

    if (isAnsweredCorrectly) {
      return setFooterColors({ buttons: GREEN[600], text: GREEN[600], background: GREEN[100] });
    }

    return setFooterColors({ buttons: ORANGE[600], text: ORANGE[600], background: ORANGE[100] });
  }, [isValidated, isAnsweredCorrectly]);

  if (isLoading) return null;

  const style = styles(footerColors.background);

  const setAnswersAndPropositions = (event, gapIndex?) => {
    const { payload } = event.dragged;
    const tempPropositions = [...propositions];
    const dropTargetIsGap = Number.isInteger(gapIndex);
    const selectedPropIdx = tempPropositions.map(prop => prop.text).indexOf(payload);
    const payloadIdx = selectedAnswers.indexOf(payload);

    tempPropositions[selectedPropIdx].visible = !dropTargetIsGap;

    if (dropTargetIsGap && selectedAnswers[gapIndex] && selectedAnswers[gapIndex] !== payload) {
      const previousAnswerIdx = tempPropositions.map(prop => prop.text).indexOf(selectedAnswers[gapIndex]);
      tempPropositions[previousAnswerIdx].visible = true;
    }

    if (payloadIdx > -1) setSelectedAnswers(array => Object.assign([], array, { [payloadIdx]: '' }));

    if (dropTargetIsGap) setSelectedAnswers(array => Object.assign([], array, { [gapIndex]: payload }));

    setPropositions(tempPropositions);
  };

  const isGoodAnswer = (text, idx) => {
    if (Number.isInteger(idx)) {
      return card.canSwitchAnswers ? goodAnswers.includes(text) : goodAnswers.indexOf(text) === idx;
    }

    return goodAnswers.includes(text);
  };

  const renderContent = (isVisible, item, text, idx?) => isVisible &&
    <DraxView style={style.answerContainer} draggingStyle={{ opacity: 0 }} dragPayload={text} longPressDelay={0}>
      <FillTheGapProposition item={item} isValidated={isValidated} isSelected={selectedAnswers.includes(text)}
        isGoodAnswer={isGoodAnswer(text, idx)} />
    </DraxView>;

  const renderGap = idx => <DraxView style={style.gapContainer} key={`gap${idx}`}
    onReceiveDragDrop={event => setAnswersAndPropositions(event, idx)}
    renderContent={() => renderContent(
      !!selectedAnswers[idx], { text: selectedAnswers[idx], visible: true }, selectedAnswers[idx], idx
    )} />;

  const onPressFooterButton = () => {
    if (!isValidated) {
      const areAnswersCorrect = card.canSwitchAnswers
        ? selectedAnswers.every(text => goodAnswers.includes(text))
        : selectedAnswers.every((text, idx) => (text === goodAnswers[idx]));

      quizJingle(areAnswersCorrect);
      setIsAnsweredCorrectly(areAnswersCorrect);
      if (areAnswersCorrect) incGoodAnswersCount();

      return setIsValidated(true);
    }
    return navigation.navigate(`card-${index + 1}`);
  };

  return (
    <>
      <CardHeader />
      <ScrollView contentContainerStyle={style.container} showsVerticalScrollIndicator={false}>
        <DraxProvider>
          <FillTheGapQuestion text={card.gappedText} isValidated={isValidated} renderGap={renderGap} />
          <FillTheGapPropositionList isValidated={isValidated} propositions={propositions}
            setProposition={setAnswersAndPropositions} renderContent={renderContent} />
        </DraxProvider>
      </ScrollView>
      <View style={style.footerContainer}>
        <QuizCardFooter isValidated={isValidated} isValid={isAnsweredCorrectly} cardIndex={index}
          buttonDisabled={!areGapsFilled} footerColors={footerColors} explanation={card.explanation}
          onPressFooterButton={onPressFooterButton} />
      </View>
    </>
  );
};

const mapStateToProps = (state: StateType) => ({ card: Selectors.getCard(state), index: state.cards.cardIndex });

const mapDispatchToProps = dispatch => ({
  incGoodAnswersCount: () => dispatch(Actions.incGoodAnswersCount()),
});

export default connect(mapStateToProps, mapDispatchToProps)(FillTheGapCard);
