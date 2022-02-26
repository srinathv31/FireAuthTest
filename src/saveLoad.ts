import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (isLoggedIn: boolean) => {
  try {
    const jsonValue = JSON.stringify(isLoggedIn);
    await AsyncStorage.setItem('login_status', jsonValue);
  } catch (e) {
    console.log(e);
  }
};

export default storeData;
