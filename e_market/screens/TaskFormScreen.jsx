import { Text, StyleSheet, View } from 'react-native';
import TaskRegister from '../components/TaskRegister';

export default function TaskFormScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.taskContainer}>
                <Text style={styles.title}>Minhas Tarefas</Text>
                <TaskRegister />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    taskContainer: {
        paddingTop: 32,
        backgroundColor: "lightblue",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 16,
    },
})