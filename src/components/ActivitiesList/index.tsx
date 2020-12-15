import React from 'react';
import { View, FlatList } from 'react-native';
import { StepType } from '../../types/StepType';
import ActivityCell from '../activities/ActivityCell';
import styles from './styles';

interface ActivitiesListProps {
  step: StepType,
  visible: boolean,
  id: string,
  navigation: { navigate: (path: string, activityId: any) => {} },
}

const ActivitiesList = ({ step, visible, id, navigation }: ActivitiesListProps) => {
  const renderActivityCell = activity => <ActivityCell activity={activity} courseId={id} navigation={navigation} />;

  const renderSeparator = () => <View style={styles.separator} />;

  return (
    <>
      {visible &&
        <FlatList horizontal data={step.activities} keyExtractor={item => item._id}
          renderItem={({ item }) => renderActivityCell(item)} ItemSeparatorComponent={renderSeparator}
          contentContainerStyle={styles.activityCellList} showsHorizontalScrollIndicator={false} />}
    </>
  );
};

export default ActivitiesList;