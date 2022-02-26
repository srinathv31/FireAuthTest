import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export async function writeUserName(
  user: FirebaseAuthTypes.User,
  userName: string,
) {
  firestore()
    .collection('test-user')
    .doc(user?.uid)
    .update({
      name: userName,
    })
    .then(() => {
      console.log('User name added');
    });
}

export async function writeUserAge(
  user: FirebaseAuthTypes.User,
  userAge: string,
) {
  firestore()
    .collection('test-user')
    .doc(user?.uid)
    .update({
      age: userAge,
    })
    .then(() => {
      console.log('User age added');
    });
}
