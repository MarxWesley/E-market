import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';

export default function TaskHomeScreen() {

    const navigation = useNavigation();
    
    const navigate = (screen) => {
        navigation.navigate(screen);        
    }

    return <View>
        <View style={styles.homeButtons}> 
            <Button mode='contained' onPress={() => navigate('TaskList') }>
                Lista
            </Button>
            <Button mode='contained' onPress={() => navigate('TaskForm')}>
                Cadastro
            </Button>
        </View>
    </View>
}

const styles = StyleSheet.create({
    homeButtons: {
        marginTop: 10, 
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'center'
    }
})