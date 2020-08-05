import React, { useContext } from 'react';
import { Text, View } from 'react-native';
import NiButton from '../components/form/Button';
import commonStyles from '../styles/common';
import { Context as AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { signOut } = useContext(AuthContext);

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Mon profil</Text>
      <NiButton caption="Déconnexion" onPress={signOut} />
    </View>
  );
};

export default Profile;
