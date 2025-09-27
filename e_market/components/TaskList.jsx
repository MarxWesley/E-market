import { View, ScrollView, Text, StyleSheet } from "react-native";
import { Button as PButton, ActivityIndicator } from "react-native-paper";

import { globalStyles } from "../styles/globalStyles.jsx";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { finishTask, initTasks, removeAllTasks, removeTask, selectTasks, selectError, selectLoading } from '../store/features/taskSlice.js'
import { useEffect } from "react";
import taskService from "../services/taskService.js";

export default function TaskList() {
  const navigation = useNavigation();
  const tasks = useSelector(selectTasks);
  const error = useSelector(selectError);
  const loading = useSelector(selectLoading)

  const dispatch = useDispatch();
  console.log('tasks: ', tasks);
  console.log('error: ', error);
  console.log('loading: ', loading);

  useEffect(() => {
    dispatch(initTasks());
  }, [dispatch]);


  const onClickTaskHandler = (task) => {
    dispatch(finishTask(task))
  };

  const onRemoveTaskHandler = (task) => {
    dispatch(removeTask(task))
  };

  const onClickDetailHandler = (task) => {
    navigation.navigate('TaskDetail', {
      task,
    })
  }

  const onRemoveAllHandler = () => dispatch(removeAllTasks());

  return (
    <>
      {error && <View>
        <Text> {error} </Text>
      </View>}
      <View style={styles.removeAllContainer}>
        <PButton icon="plus" mode="contained" onPress={
          () => navigation.navigate('TaskForm')
        }>
          Adicionar
        </PButton>
        <PButton icon="trash-can" mode="contained" onPress={onRemoveAllHandler}>
          Excluir tudo
        </PButton>
      </View>
      {loading && <View style={styles.loadingIndicator}>
        <ActivityIndicator animating={true} />
      </View>}
      <View style={styles.taskListContainer}>
        <ScrollView>
          {tasks?.map((task) => {
            return (
              <View style={styles.taskItem(task)} key={task.id}>
                <Text style={styles.taskItemText(task)}> {task.name}</Text>
                <View style={globalStyles.taskItemButtons}>
                  <PButton
                    mode="contained-tonal"
                    onPress={() => onClickDetailHandler(task)}>
                    Detalhes
                  </PButton>
                  <PButton
                    mode="contained-tonal"
                    onPress={() => onClickTaskHandler(task)}
                  >
                    {task.done ? "Para fazer" : "Concluir"}
                  </PButton>
                  <PButton
                    mode="contained-tonal"
                    onPress={() => onRemoveTaskHandler(task)}
                  >
                    Remover
                  </PButton>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </>
  );
}

const finishedTask = "darkseagreen";
const pendingTask = "indianred";
const taskStatus = (task, pending, finished) => task.done ? finished : pending;

const styles = StyleSheet.create({
  loadingIndicator: {
    marginBottom: 16,
  },  
  taskItem: (task) => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    borderWidth: 1,
    padding: 16,
    marginLeft: 16,
    marginRight: 16,
    borderRadius: 16,
    marginBottom: 8,
    borderColor: taskStatus(task, pendingTask, finishedTask),
    backgroundColor: taskStatus(task, pendingTask, finishedTask),
  }),
  taskItemText: (task) => ({
    marginTop: 10,
    textDecorationLine: taskStatus(task, 'none', "line-through"),
    marginLeft: 10,
  }),
  taskListContainer: {
    backgroundColor: "lightyellow",
    flex: 6,
    paddingTop: 16,
  },
  removeAllContainer: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10
  }
})
