import React, { useEffect, useRef, useState, useContext, useReducer } from 'react';
import {
  Text,
  ScrollView,
  View,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
} from 'react-native';
import FeatherButton from '../icons/FeatherButton';
import NiPrimaryButton from '../form/PrimaryButton';
import { GREY } from '../../styles/colors';
import { ICON, IS_LARGE_SCREEN, MARGIN } from '../../styles/metrics';
import styles from './styles';
import NiInput from '../form/Input';
import { Context as AuthContext } from '../../context/AuthContext';
import ExitModal from '../ExitModal';
import NiErrorMessage from '../ErrorMessage';
import { CORRECT, ERROR, errorReducer } from '../../reducers/errors';
import { combineReducers } from 'redux';

interface PasswordFormProps {
  goBack: () => void,
  onPress: (password: string) => void,
}

export const SET_PASSWORD = 'set_password';
export const SET_UNVALID = 'set_unvalid';

const initialState = {
  newPassword: '',
  confirmedPassword: '',
  unvalid: {
    newPassword: '',
    confirmedPassword: '',
  },
  isLoading: false,
};

export const reducer = (state, action) => {
  switch (action.type) {
    case SET_PASSWORD:
      return { ...state, ...action.payload };
    case SET_UNVALID:
      return {
        ...state,
        unvalid: {
          newPassword: state.newPassword.length < 6,
          confirmedPassword: state.confirmedPassword !== state.newPassword,
        },
      };
    default:
      return initialState;
  }
};

export const extendedReducer = (state, action) => {
  switch (action.type) {
    case ERROR:
      return { error: true, message: '', valid: 'maybe' };
    default:
      return null;
  }
};


const PasswordForm = ({ onPress, goBack }: PasswordFormProps) => {
  const isIOS = Platform.OS === 'ios';
  const { signOut } = useContext(AuthContext);
  const [exitConfirmationModal, setExitConfirmationModal] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isValidationAttempted, setIsValidationAttempted] = useState<boolean>(false);
  const scrollRef = useRef<ScrollView>(null);

  const [state, dispatch] = useReducer(reducer, initialState);
  const [errorState, errorDispatch] = useReducer(errorReducer, { error: false, message: '' });

  const keyboardDidHide = () => Keyboard.dismiss();

  useEffect(() => {
    Keyboard.addListener('keyboardDidHide', keyboardDidHide);
    return () => { Keyboard.removeListener('keyboardDidHide', keyboardDidHide); };
  });

  const hardwareBackPress = () => {
    setExitConfirmationModal(true);
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', hardwareBackPress);

    return () => { BackHandler.removeEventListener('hardwareBackPress', hardwareBackPress); };
  }, []);

  useEffect(() => {
    dispatch({ type: SET_UNVALID });
  }, [state]);

  useEffect(() => {
    const { newPassword, confirmedPassword } = state.unvalid;
    setIsValid(!(newPassword || confirmedPassword));
  }, [state.unvalid]);

  const toggleModal = () => {
    if (exitConfirmationModal) setExitConfirmationModal(false);
    goBack();
  };

  const savePassword = async () => {
    try {
      setIsValidationAttempted(true);
      if (isValid) {
        errorDispatch({ type: CORRECT });

        await onPress(state.newPassword);
      }
    } catch (e) {
      if (e.status === 401) signOut();
      errorDispatch({ type: ERROR, payload: 'Erreur, si le problème persiste, contactez le support technique.' });
    } finally {
      setIsLoading(false);
    }
  };

  const setPasswordField = (text, key) => { dispatch({ type: SET_PASSWORD, payload: { [key]: text } }); };

  return (
    <KeyboardAvoidingView behavior={isIOS ? 'padding' : 'height'} style={styles.keyboardAvoidingView}
      keyboardVerticalOffset={IS_LARGE_SCREEN ? MARGIN.MD : MARGIN.XS} >
      <View style={styles.goBack}>
        <FeatherButton name='x-circle' onPress={() => setExitConfirmationModal(true)} size={ICON.MD}
          color={GREY[600]} disabled={isLoading} />
        <ExitModal onPressConfirmButton={toggleModal} visible={exitConfirmationModal} title={'Êtes-vous sûr de cela ?'}
          onPressCancelButton={() => setExitConfirmationModal(false)}
          contentText={'Vos modifications ne seront pas enregistrées.'} />
      </View>
      <ScrollView contentContainerStyle={styles.container} ref={scrollRef} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Modifier mon mot de passe</Text>
        <View style={styles.input}>
          <NiInput caption="Nouveau mot de passe" value={state.newPassword}
            type="password" onChangeText={text => setPasswordField(text, 'newPassword')}
            validationMessage={state.unvalid.newPassword && isValidationAttempted
              ? 'Le mot de passe doit comporter au minimum 6 caractères'
              : ''} />
        </View>
        <View style={styles.input}>
          <NiInput caption="Confirmer mot de passe" value={state.confirmedPassword}
            type="password" onChangeText={text => setPasswordField(text, 'confirmedPassword')}
            validationMessage={state.unvalid.confirmedPassword && isValidationAttempted
              ? 'Votre nouveau mot de passe et sa confirmation ne correspondent pas'
              : ''} />
        </View>
        <View style={styles.footer}>
          <NiErrorMessage errorState={errorState} />
          <NiPrimaryButton caption="Valider" onPress={savePassword} loading={isLoading} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PasswordForm;
