
import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:3000/'
});
const endpoint = 'tasks';

const getTasks = async () => {
    const response = await api.get(endpoint);
    console.log(response);
    return response.data;
}

const addTask = async (newTask) => {
    newTask.createdDate = new Date();
    const response = await api.post(endpoint, newTask);
    console.log('[addTask] response: ', response);
    return response.data;
}

const removeTask = async (task) => {
    return (await api.delete(`${endpoint}/${task.id}`)).data;
}

const finishTask = async (taskToBeDone) => {
    taskToBeDone.done = !taskToBeDone.done;
    if (taskToBeDone.done) {
        taskToBeDone.completedDate = new Date();
    } else {
        delete taskToBeDone.completedDate;
    }
    const response = await api.put(`${endpoint}/${taskToBeDone.id}`, taskToBeDone);
    return response.data;
}

const clearTasks = () => {

}

export default {
    getTasks,
    addTask,
    removeTask,
    finishTask,
    clearTasks
};