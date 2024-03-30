import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {getAuth} from 'firebase/auth';
const DevNews = ({navigation}) => {
  const auth = getAuth();
  return (
    <View style={styles.main}>
      <Text style={styles.heading}>Developer News</Text>
      <View style={styles.container}>
        {auth.currentUser.uid === 'QM4geYQsLSZ5NPTG9W7BU5GVxlL2' && (
          <TouchableOpacity
            style={styles.PbuttonBody}
            activeOpacity={0.5}
            onPress={() => navigation.navigate('PublishDevNews')}>
            <Text style={styles.Pbutton}>Publish Dev News</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default DevNews;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center'
  },
  PbuttonBody: {
    height: 45,
    width: '90%',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    backgroundColor: '#faad14',
  },
  Pbutton: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
  heading: {
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    textAlign: 'center',
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
    letterSpacing: 1,
    marginVertical: 5,
    padding: 5
  },
});
