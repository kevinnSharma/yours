import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const LaunchScreen = ({ navigation }) => {
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    head: {
        color: '#FFFFFF',
        fontSize: 26,
        letterSpacing: 3,
        fontWeight: 'bold',
        marginTop: 20
    },
    body: {
        letterSpacing: 6,
        fontWeight: '300',
        fontSize: 16,
        color: '#FFFFFF'
    },
    credits: {
        alignItems: 'center'
    },
    kevin: {
        color: '#FFFFFF',
        fontSize: 24,
        letterSpacing: 5,
        marginVertical: 15
    }
});
