import AsyncStorage from "@react-native-async-storage/async-storage";

const key = '@TASKS';

const getTasks = async () => {
    // return AsyncStorage
    //     .getItem(key)
    //     .then(tasks => {
    //         console.log('getTasks: ', tasks);
    //         return JSON.parse(tasks) || [];
    //     })
    //     .catch(error => {
    //         console.error(error);
    //         return [];
    //     })
    try {
        const tasks = await AsyncStorage.getItem(key);
        return JSON.parse(tasks) || { tasks: [] };
    } catch (error) {
        console.error(error);
        return [];
    }
}

const addTask = async (newTask) => {
    const currentTasks = await getTasks();
    try {
        const value = JSON.stringify([...currentTasks, newTask]);
        await AsyncStorage.setItem(key, value);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

const removeTask = async (task) => {
    const currentTasks = await getTasks();
    const newValue = currentTasks.filter(t => t.id !== task.id);
    await AsyncStorage.setItem(key, JSON.stringify(newValue));
    return newValue;
}

const finishTask = async (taskDone) => {
    const currentTasks = await getTasks();
    const newValue = currentTasks.map(t => t.id === taskDone.id ? taskDone : t);
    await AsyncStorage.setItem(key, JSON.stringify(newValue));
}

const clearTasks = () => {
    AsyncStorage.removeItem(key);
}

export default {
    getTasks,
    addTask,
    removeTask,
    finishTask,
    clearTasks
};