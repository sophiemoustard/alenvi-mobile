import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, Image, ScrollView, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import CardHeader from '../../../components/cards/CardHeader';
import CardFooter from '../../../components/cards/CardFooter';
import { getCard } from '../../../store/activities/selectors';
import { MARGIN } from '../../../styles/metrics';
import cardsStyle from '../../../styles/cards';
import { StateType } from '../../../types/StoreType';
import { TitleTextMediaType } from '../../../types/CardType';
import { TITLE_TEXT_MEDIA } from '../../../core/data/constants';

interface TitleTextMediaCardProps {
  card: TitleTextMediaType,
  index: number,
}

const TitleTextMediaCard = ({ card, index }: TitleTextMediaCardProps) => {
  const [imgHeight, setImgHeight] = useState(0);

  useEffect(() => {
    if (card?.media?.link) {
      Image.getSize(card.media?.link || '', (width, height) => {
        const screenWidth = Dimensions.get('window').width;
        const scaleFactor = width / screenWidth;
        const imageHeight = height / scaleFactor;
        setImgHeight(imageHeight);
      });
    }
  }, [card]);

  if (!card || card.template !== TITLE_TEXT_MEDIA) return null;

  const imageSource = card.media?.link ? { uri: card.media.link } : '';
  const styleWithImgHeight = styles(imgHeight);

  return (
    <>
      <CardHeader />
      <ScrollView style={styleWithImgHeight.container} showsVerticalScrollIndicator={false}>
        <Text style={cardsStyle.title}>{card.title}</Text>
        <Text style={cardsStyle.text}>{card.text}</Text>
        {!!imageSource && <Image source={imageSource} style={styleWithImgHeight.image} />}
      </ScrollView>
      <CardFooter index={index} template={card.template}/>
    </>
  );
};

const styles = (imgHeight : number) => StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: MARGIN.MD,
  },
  image: {
    ...cardsStyle.media,
    height: imgHeight,
  },
});

const mapStateToProps = (state: StateType) => ({ card: getCard(state), index: state.activities.cardIndex });

export default connect(mapStateToProps)(TitleTextMediaCard);
