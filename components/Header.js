import { StyleSheet, Text, View, useColorScheme} from 'react-native'
import React from 'react'

const Header = () => {
    const colorScheme = useColorScheme();
    const styles = getStyles(colorScheme);
    return (
        <View>
            <Text style={styles.logo}>RPI</Text>
        </View>
    )
}

export default Header

const getStyles = (colorScheme) =>{
    return StyleSheet.create({
    logo:{
        color: colorScheme === 'dark' ? 'white' : 'black',
        marginHorizontal: 6,
        marginVertical: 9,
        fontSize: 24,
        letterSpacing: 20,
        fontWeight: 'bold' 
    }
});
}