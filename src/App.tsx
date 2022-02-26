/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Colors, Header} from 'react-native/Libraries/NewAppScreen';
import AppleSignIn from './AppleButton';
import {writeUserAge, writeUserName} from './dbWrite';
import {CalendarDotObject, UserData} from './UserData';
import UserInputScreen from './UserInputScreen';
import analytics from '@react-native-firebase/analytics';
import messaging from '@react-native-firebase/messaging';
import GoogleSignIn from './GoogleButton';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const Section: React.FC<{
  title: string;
}> = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [googleSignIn, setGoogleSignIn] = useState<boolean>(false);
  const [user, setUser] = useState<FirebaseAuthTypes.User>();
  const [dogData, setDogData] = useState<UserData>();
  const [query, setQuery] = useState<Record<string, string>>({
    '1': '',
    '2': '',
  });

  useEffect(() => {
    requestUserPermission();
  });

  useEffect(() => {
    const dogCopy = {...dogData};
    dogCopy.user = user;
    setDogData(dogCopy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  async function grabUserData() {
    collectGrabData();
    const dogCopy = {...dogData};
    const userData = await firestore()
      .collection('test-user')
      .doc(user?.uid)
      .get();

    const userFeatures = userData.get('data') as CalendarDotObject;
    dogCopy.features = userFeatures;
    setDogData(dogCopy);
  }

  async function writeUserData() {
    firestore()
      .collection('test-user')
      .doc(user?.uid)
      .set({
        name: '',
        age: '',
        features: ['eyes', 'snout', 'straight ears'],
      })
      .then(() => {
        console.log('User added');
      });
  }

  async function deleteUserData() {
    firestore()
      .collection('test-user')
      .doc(user?.uid)
      .delete()
      .then(() => {
        console.log('User deleted');
      });
  }

  async function collectGrabData() {
    await analytics().logSelectContent({
      content_type: 'grab data',
      item_id: 'grab',
    });
  }

  function submitData() {
    const dogCopy = {...dogData};
    dogCopy.name = query['1'];
    dogCopy.age = query['2'];
    if (user !== undefined) {
      writeUserName(user, query['1']);
      writeUserAge(user, query['2']);
    }
    setDogData(dogCopy);
  }

  const googleSignOut = async () => {
    try {
      await GoogleSignin.signOut();
      setUser(undefined);
      auth().signOut();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          {user === undefined && (
            <View style={{alignItems: 'center'}}>
              <Section title="Step One">
                <AppleSignIn setUser={setUser} />
                <GoogleSignIn
                  setUser={setUser}
                  setGoogleSignIn={setGoogleSignIn}
                />
              </Section>
            </View>
          )}
          {user !== undefined && (
            <>
              {dogData?.name === undefined && dogData?.age === undefined && (
                <>
                  <UserInputScreen setQuery={setQuery} query={query} />
                  <View style={styles.bar}>
                    <Text onPress={() => submitData()}> Submit</Text>
                  </View>
                </>
              )}

              {dogData?.name !== undefined && dogData?.age !== undefined && (
                <>
                  <Section title="UID">
                    <Text>Welcome, {user.uid}</Text>
                    <Text>{`\nAge, ${dogData.age}`}</Text>
                    <Text>{`\nWelcome, ${dogData.name}`}</Text>
                    {dogData.features !== undefined &&
                      dogData.features['9/20/25'].dots.map((item, index) => {
                        return (
                          <Text
                            key={index}>{`\n${item.key} ${item.color}\n`}</Text>
                        );
                      })}
                    {dogData.features !== undefined && (
                      <Text>{'' + dogData.features['9/20/25'].selected}</Text>
                    )}
                  </Section>
                  <Section title="Logout">
                    {googleSignIn === false ? (
                      <Text
                        onPress={() => (setUser(undefined), auth().signOut())}>
                        Logout Here
                      </Text>
                    ) : (
                      <Text onPress={() => googleSignOut()}>Logout Here</Text>
                    )}
                  </Section>
                  <Section title="Grab Data">
                    <Text onPress={() => grabUserData()}>Grab Data</Text>
                  </Section>
                  <Section title="Write Data">
                    <Text onPress={() => writeUserData()}>Write Data</Text>
                  </Section>
                  <Section title="Delete Data">
                    <Text onPress={() => deleteUserData()}>Delete Data</Text>
                  </Section>
                </>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  bar: {
    alignSelf: 'center',
  },
});

export default App;
