import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Input } from 'react-native-elements';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const RegisterScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        navigation.setOptions({
            headerShown: false
        });
    }, []);

    const signUp = async () => {
        if (password !== confirmPassword) {
            Alert.alert('Passwords do not match');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await updateProfile(user, { displayName: username });

            // Upload user information to Firestore
            await addDoc(collection(db, 'users'), {
                uid: user.uid,
                username: username,
                email: email,
            });

            navigation.navigate('BottomTab');
        } catch (error) {
            Alert.alert(error.message);
        }
    };

    return (
        <View style={styles.main}>
            <Text style={styles.heading}>Register</Text>
            <View style={styles.inputContainer}>
                <Input
                    placeholder='Username'
                    value={username}
                    onChangeText={(text) => setUsername(text)}
                    placeholderTextColor='#FFFFFF'
                    inputStyle={{ color: '#FFFFFF' }}
                />

                <Input
                    placeholder='Email'
                    keyboardType='email-address'
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    placeholderTextColor='#FFFFFF'
                    inputStyle={{ color: '#FFFFFF' }}
                />
                <Input
                    placeholder='Password'
                    secureTextEntry
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    placeholderTextColor='#FFFFFF'
                    inputStyle={{ color: '#FFFFFF' }}
                />

                <Input
                    placeholder='Confirm Password'
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={(text) => setConfirmPassword(text)}
                    placeholderTextColor='#FFFFFF'
                    inputStyle={{ color: '#FFFFFF' }}
                />

                <TouchableOpacity activeOpacity={0.5} style={styles.button} onPress={signUp}>
                    <Text style={styles.buttonText}>Register Now</Text>
                </TouchableOpacity>
                <Text style={{ color: '#fff', textAlign: 'center', fontSize: 16, marginVertical: 10 }}>Or</Text>
                <TouchableOpacity activeOpacity={0.5} style={styles.button2} onPress={() => navigation.goBack()}>
                    <Text style={styles.buttonText}>Go Back to Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: '#080808',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    heading: {
        color: '#FFFFFF',
        fontSize: 28,
        textAlign: 'center',
        marginVertical: 20
    },
    inputContainer: {
        width: 350,
        alignItems: 'center',
        marginBottom: 15
    },
    button: {
        backgroundColor: '#faad14',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        borderRadius: 50,
        width: 300,
        marginTop: 10
    },
    buttonText: {
        fontWeight: '700',
        color: '#000000',
        fontSize: 17
    },
    button2: {
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        width: 270,
        height: 40,
        borderRadius: 50,
    }
});
