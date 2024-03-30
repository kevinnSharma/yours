import { StyleSheet, Text, View, useColorScheme} from 'react-native'
import React from 'react'

const Header = () => {
    const colorScheme = useColorScheme();
    const styles = getStyles(colorScheme);
    return (
        <View style={styles.container}>
            <Text style={styles.logo}>RPI</Text>
        </View>
    )
}

export default Header

const getStyles = (colorScheme) =>{
    return StyleSheet.create({
    container:{
        width: '100%'
    },
    logo:{
        color: colorScheme === 'dark' ? 'white' : 'black',
        marginHorizontal: 6,
        marginVertical: 10,
        fontSize: 24,
        letterSpacing: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    }
});
}