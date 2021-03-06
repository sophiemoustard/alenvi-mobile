import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CalendarIcon from '../../CalendarIcon';
import StepCellTitle from '../StepCellTitle';
import styles from './styles';

interface NextStepCellProps {
  nextSlotsStep: NextSlotsStepType,
}

interface NextSlotsStepType {
  _id: string,
  name: string,
  slots: Array<Date>,
  type: string,
  stepIndex: number,
  progress: number,
  courseId: string,
}

const NextStepCell = ({ nextSlotsStep }: NextStepCellProps) => {
  const navigation = useNavigation();
  const { stepIndex, slots, progress, courseId } = nextSlotsStep;

  const goToCourse = () => navigation.navigate('CourseProfile', { courseId });

  return (
    <TouchableOpacity style={styles.container} onPress={goToCourse}>
      <CalendarIcon slots={slots} progress={progress}/>
      <StepCellTitle index={stepIndex} step={nextSlotsStep} />
    </TouchableOpacity>
  );
};

export default NextStepCell;
