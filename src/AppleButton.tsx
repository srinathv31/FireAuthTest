import React from 'react';
import {AppleButton} from '@invertase/react-native-apple-authentication';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import {User} from '@firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {CalendarDotObject} from './UserData';

export default function AppleSignIn({
  setUser,
}: {
  setUser: (u: FirebaseAuthTypes.User) => void;
}) {
  async function onAppleButtonPress() {
    // Start the sign-in request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    // Ensure Apple returned a user identityToken
    if (!appleAuthRequestResponse.identityToken) {
      throw new Error('Apple Sign-In failed - no identify token returned');
    }

    // Create a Firebase credential from the response
    const {identityToken, nonce} = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      nonce,
    );

    // Sign the user in with the credential
    return auth().signInWithCredential(appleCredential);
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

  //   async function loginAnalytics() {
  //     await analytics().logLogin({
  //       method: 'apple login',
  //     });
  //   }

  return (
    <AppleButton
      buttonStyle={AppleButton.Style.BLACK}
      buttonType={AppleButton.Type.SIGN_IN}
      // eslint-disable-next-line react-native/no-inline-styles
      style={{width: 160, height: 45}}
      onPress={() =>
        onAppleButtonPress().then(
          // eslint-disable-next-line no-sequences
          response => (
            console.log('Success'),
            // loginAnalytics(),
            setUser(response.user),
            writeUserData(response.user)
          ),
        )
      }
    />
  );
}
