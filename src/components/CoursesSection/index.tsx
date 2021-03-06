import React from 'react';
import { View, Text, FlatList, StyleProp, ViewStyle, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';
import { SubProgramType } from '../../types/SubProgramType';
import { CourseType } from '../../types/CourseType';
import { ProgramType } from '../../types/ProgramType';
import { CourseStepType } from '../../types/StepType';
import { formatWordToPlural } from '../../core/helpers/utils';
import NiPrimaryButton from '../../components/form/PrimaryButton';

export const COURSE_SECTION = 'FORMATION';
export const EVENT_SECTION = 'ÉVÉNEMENT';

interface CoursesSectionProps {
  items: Array<ProgramType | CourseType | SubProgramType | CourseStepType>,
  title: string,
  type?: string,
  countStyle: StyleProp<ViewStyle>
  showCatalogButton?: boolean,
  renderItem: (item) => JSX.Element,
}

const CoursesSection = ({
  items,
  title,
  type = COURSE_SECTION,
  countStyle,
  showCatalogButton = false,
  renderItem,
}: CoursesSectionProps) => {
  const navigation = useNavigation();

  const renderSeparator = () => <View style={styles.separator} />;

  return (
    <>
      <Text style={styles.title}>{title}</Text>
      <Text style={[countStyle, styles.countContainer]}>
        {items.length} {formatWordToPlural(items, type).toUpperCase()}
      </Text>
      <FlatList horizontal data={items} keyExtractor={item => `${title}${item._id}`} style={styles.container}
        renderItem={({ item }) => renderItem(item)} showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={renderSeparator} />
      {showCatalogButton &&
      <TouchableOpacity style={styles.courseContainer} onPress={() => navigation.navigate('Catalog')}>
        <Text style={styles.text}>Vous n’avez pas de formation en cours...</Text>
        <NiPrimaryButton caption="Chercher une formation" onPress={() => navigation.navigate('Catalog')} />
        <Image source={require('../../../assets/images/aux_detective.png')} style={styles.image} resizeMode='contain' />
      </TouchableOpacity>
      }
    </>
  );
};

export default CoursesSection;
