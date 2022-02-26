// Source Imports
import React from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import {CalendarDotObject} from './UserData';
import firestore from '@react-native-firebase/firestore';
GoogleSignin.configure({
  webClientId:
    '565212775504-4bo1h6ec9kt2601ls0d478ao3k49qbv7.apps.googleusercontent.com',
});
export default function GoogleSignIn({
  setUser,
  setGoogleSignIn,
}: {
  setUser: (u: FirebaseAuthTypes.User) => void;
  setGoogleSignIn: (g: boolean) => void;
}) {
  async function onGoogleButtonPress() {
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }

  const dataMap: CalendarDotObject = {
    // eslint-disable-next-line prettier/prettier
    '9/13/25': { dots: [{ key: 'supplementCheck', color: 'orange' }], selected: true},
    '9/20/25': {
      dots: [
        {key: 'supplementCheck', color: 'orange'},
        {key: 'journalCheck', color: 'red'},
      ],
      selected: true,
    },
  };

  async function writeUserData(user: FirebaseAuthTypes.User) {
    const userDataExists = (
      await firestore().collection('test-user').doc(user?.uid).get()
    ).exists;
    if (!userDataExists) {
      firestore()
        .collection('test-user')
        .doc(user?.uid)
        .set({
          name: '',
          age: '',
          data: dataMap,
        })
        .then(() => {
          console.log('User added');
        });
    }
  }

  return (
    <GoogleSigninButton
      style={{width: 192, height: 48}}
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Dark}
      onPress={() =>
        onGoogleButtonPress().then(
          response => (
            console.log('Signed in with Google!'),
            setUser(response.user),
            setGoogleSignIn(true),
            writeUserData(response.user)
          ),
        )
      }
    />
  );
}
