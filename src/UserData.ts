import {FirebaseAuthTypes} from '@react-native-firebase/auth';

export interface UserData {
  name?: string;
  age?: string;
  features?: CalendarDotObject;
  user?: FirebaseAuthTypes.User;
}

export interface Animal {
  breed: string;
  sound: string;
}

export interface CalendarDotObject {
  [date: string]: {
    dots: {key: string; color: string}[];
    selected: boolean;
  };
}
