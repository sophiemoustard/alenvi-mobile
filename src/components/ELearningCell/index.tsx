import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { StepType } from '../../types/StepType';
import { ICON } from '../../styles/metrics';
import { GREY } from '../../styles/colors';
import FeatherButton from '../icons/FeatherButton';
import StepCellTitle from '../steps/StepCellTitle';
import ActivityList from '../activities/ActivityList';
import styles from './styles';
import ProgressPieChart from '../ProgressPieChart';

interface ELearningCellProps {
  step: StepType,
  index: number,
  profileId: string,
  endedActivity?: string,
}

const ELearningCell = ({ step, index, profileId, endedActivity = '' }: ELearningCellProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const onPressChevron = () => { setIsOpen(prevState => !prevState); };
  const [iconButtonStyle, setIconButtonStyle] = useState<object>(styles.iconButtonContainer);

  useEffect(() => {
    if (step && step.activities && endedActivity) {
      setIsOpen(step.activities.map(activity => activity._id).includes(endedActivity));
    }
  }, [endedActivity, step]);

  useEffect(() => {
    if (isOpen) setIconButtonStyle({ ...styles.iconButtonContainer, ...styles.openedIconButtonContainer });
    else setIconButtonStyle(styles.iconButtonContainer);
  }, [isOpen]);

  return (
    <View style={[styles.container, isOpen && styles.openedContainer]}>
      <TouchableOpacity activeOpacity={1} onPress={onPressChevron} style={styles.textContainer}>
        <View style={styles.topContainer}>
          <ProgressPieChart progress={step.progress} />
          <StepCellTitle index={index} step={step} />
          <FeatherButton name={isOpen ? 'chevron-up' : 'chevron-down' } onPress={onPressChevron} size={ICON.MD}
            color={GREY[500]} style={iconButtonStyle} />
        </View>
      </TouchableOpacity>
      {isOpen && <ActivityList step={step} profileId={profileId} />}
    </View>
  );
};

export default ELearningCell;
