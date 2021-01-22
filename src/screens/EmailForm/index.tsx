import React, { useEffect, useState, useRef } from 'react';
import { Text, View, KeyboardAvoidingView, Platform, BackHandler } from 'react-native';
import ExitModal from '../../components/ExitModal';
import FeatherButton from '../../components/icons/FeatherButton';
import { ICON, IS_LARGE_SCREEN, MARGIN } from '../../styles/metrics';
import { NavigationType } from '../../types/NavigationType';
import NiInput from '../../components/form/Input';
import NiButton from '../../components/form/Button';
import styles from './styles';
import { GREY, PINK, WHITE } from '../../styles/colors';
import { EMAIL, EMAIL_REGEX, MOBILE } from '../../core/data/constants';
import Users from '../../api/users';
import Authentication from '../../api/authentication';
import ForgotPasswordModal from '../../components/ForgotPasswordModal';

interface EmailFormProps {
  route: { params: { firstConnection: string } },
  navigation: NavigationType,
}

const EmailForm = ({ route, navigation }: EmailFormProps) => {
  const isIOS = Platform.OS === 'ios';
  const [exitConfirmationModal, setExitConfirmationModal] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [unvalidEmail, setUnvalidEmail] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isDisabledBackHandler = useRef(isLoading);
  const [isValidationAttempted, setIsValidationAttempted] = useState<boolean>(false);
  const [forgotPasswordModal, setForgotPasswordModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [error, setError] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [codeRecipient, setCodeRecipient] = useState<string>('');
  const style = styles(isKeyboardOpen && !IS_LARGE_SCREEN);

  const hardwareBackPress = () => {
    if (!isDisabledBackHandler.current) setExitConfirmationModal(true);
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', hardwareBackPress);

    return () => { BackHandler.removeEventListener('hardwareBackPress', hardwareBackPress); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { isDisabledBackHandler.current = isLoading; }, [isLoading]);

  useEffect(() => { setUnvalidEmail(!email.match(EMAIL_REGEX)); }, [email]);

  useEffect(() => { setIsValid(!unvalidEmail); }, [unvalidEmail]);

  const sendEmail = async () => {
    try {
      setIsLoading(true);
      await Authentication.forgotPassword({ email, origin: MOBILE, type: EMAIL });
      setCodeRecipient(email);
    } catch (e) {
      setError(true);
      if (e.response.status === 404) setErrorMessage('Oops, on ne reconnaît pas cet e-mail');
      else setErrorMessage('Oops, erreur lors de la transmission de l\'e-mail.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveEmail = async () => {
    try {
      setIsValidationAttempted(true);
      if (isValid) {
        if (error) setError(false);
        if (!route.params.firstConnection) await setForgotPasswordModal(true);
        else {
          const isExistingUser = await Users.exists({ email });
          if (isExistingUser) await setForgotPasswordModal(true);
          else navigation.navigate('CreateAccount', { email });
        }
      }
    } catch (e) {
      setError(true);
      setErrorMessage('Oops, erreur lors de l\'envoi de l\'e-mail.');
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    if (exitConfirmationModal) setExitConfirmationModal(false);
    navigation.navigate('Authentication');
  };

  const enterEmail = (text) => {
    setErrorMessage('');
    setEmail(text);
  };

  const validationMessage = () => {
    if (unvalidEmail && isValidationAttempted) return 'Votre e-mail n\'est pas valide';
    return '';
  };

  const onRequestClose = () => {
    setForgotPasswordModal(false);
    setCodeRecipient('');
  };

  return (
    <KeyboardAvoidingView behavior={isIOS ? 'padding' : 'height'} style={style.keyboardAvoidingView}
      keyboardVerticalOffset={IS_LARGE_SCREEN ? MARGIN.MD : MARGIN.XS} >
      <View style={style.goBack}>
        <FeatherButton name='x-circle' onPress={() => setExitConfirmationModal(true)} size={ICON.MD} color={GREY[600]}
          disabled={isLoading} />
        <ExitModal onPressConfirmButton={goBack} visible={exitConfirmationModal}
          onPressCancelButton={() => setExitConfirmationModal(false)}
          title={'Êtes-vous sûr de cela ?'} contentText={'Vous reviendrez à la page d\'accueil.'} />
      </View>
      <View style={style.container}>
        <Text style={style.title}>Quelle est votre e-mail ?</Text>
        <View style={style.input}>
          <NiInput caption="E-mail" value={email} type="email" validationMessage={validationMessage()} darkMode={false}
            onChangeText={text => enterEmail(text)} isKeyboardOpen={setIsKeyboardOpen} disabled={isLoading} />
        </View>
        <View style={style.footer}>
          <NiButton caption="Valider" onPress={saveEmail} loading={isLoading} bgColor={PINK[500]}
            color={WHITE} borderColor={PINK[500]} />
        </View>
        <ForgotPasswordModal visible={forgotPasswordModal} isLoading={isLoading} sendEmail={sendEmail}
          onRequestClose={onRequestClose} errorMessage={error ? errorMessage : ''}
          codeRecipient={codeRecipient} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default EmailForm;
