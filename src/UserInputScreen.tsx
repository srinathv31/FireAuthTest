// Source Imports
import React, {useEffect, useState} from 'react';
import {StyleSheet, TextInput, View} from 'react-native';

export default function UserInputScreen({
  setQuery,
  query,
}: {
  setQuery: (s: Record<string, string>) => void;
  query: Record<string, string>;
}): JSX.Element {
  const [name, setName] = useState<string>('');
  const [age, setAge] = useState<string>('');

  useEffect(() => {
    const queryCopy = {...query};
    queryCopy['1'] = name;
    setQuery(queryCopy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  useEffect(() => {
    const queryCopy = {...query};
    queryCopy['2'] = age;
    setQuery(queryCopy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [age]);

  return (
    <>
      <View style={styles.bar}>
        <TextInput
          style={styles.input}
          onChangeText={setName}
          value={name}
          placeholder="Enter Name"
        />
      </View>
      <View style={styles.bar}>
        <TextInput
          style={styles.input}
          onChangeText={setAge}
          value={age}
          placeholder="Enter Age"
        />
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  input: {
    height: 40,
    minWidth: '65%',
    margin: 12,
    borderWidth: 1,
    padding: 10,
    paddingTop: 10,
    backgroundColor: 'white',
    textAlign: 'center',
  },
  bar: {
    alignSelf: 'center',
  },
});
