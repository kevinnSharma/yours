import React, { useEffect } from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const LaunchScreen = ({ navigation }) => {
    const colorScheme = useColorScheme();
    const styles = getStyles(colorScheme);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, redirect to HomeScreen
                navigation.replace('BottomTab');
            } else {
                // No user is signed in, redirect to LoginScreen
                navigation.replace('LoginScreen');
            }
        });

        // Clean up subscription on unmount
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        navigation.setOptions({
            headerShown: false
        });
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.head}>R<Text style={styles.body}>ADIO</Text> P<Text style={styles.body}>LAYBACK</Text> I<Text style={styles.body}>NDIA</Text></Text>
            <View style={styles.credits}>
                <Text style={styles.body}>From</Text>
                <Text style={styles.kevin}>kevin</Text>
            </View>
        </View>
    );
};

export default LaunchScreen;

const getStyles = (colorScheme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
            alignItems: 'center',
            justifyContent: 'space-around',
        },
        head: {
            color: colorScheme === 'dark' ? 'white' : 'black',
            fontSize: 26,
            letterSpacing: 3,
            fontWeight: 'bold',
            marginTop: 20
        },
        body: {
            letterSpacing: 6,
            fontWeight: '300',
            fontSize: 16,
            color: colorScheme === 'dark' ? 'white' : 'black',
        },
        credits: {
            alignItems: 'center'
        },
        kevin: {
            fontSize: 24,
            letterSpacing: 5,
            marginVertical: 15,
            fontWeight: '400',
            color: colorScheme === 'dark' ? 'white' : 'black',
        }
    });
};
