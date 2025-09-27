import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import TaskList from '../components/TaskList';

export default function TaskListScreen() {
    const navigation = useNavigation();

    return (
        <>
            {/* <View style={styles.buttonContainer}>
                <Button mode='contained' icon="backburger"
                    onPress={() => navigation.goBack()}>
                    Voltar
                </Button>
            </View> */}
            <TaskList />
        </>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        padding: 5,
    }
})