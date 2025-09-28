import { createContext, useState, useContext, useEffect } from "react";

import taskService from '../services/taskService';

export const TaskContext = createContext({
  tasks: [],
  addTask: (task) => { },
  finishTask: (task) => { },
  removeTask: (task) => { },
  clearTasks: () => { },
});

export const TaskContextProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  const addTask = async (task) => {
    task.id = new Date().toISOString();
    task.createdDate = new Date();

    if (await taskService.addTask(task)) {
      setTasks((prevTasks) => {
        return [...prevTasks, {
          ...task,
        }];
      });
    }
  };

  const removeTask = async (task) => {
    setTasks((prevTasks) => {
      return prevTasks.filter((t) => t.id !== task.id);
    });
    await taskService.removeTask(task);
  };

  const finishTask = async (taskToBeDone) => {
    taskToBeDone.done = !taskToBeDone.done;
    if (taskToBeDone.done) {
      taskToBeDone.completedDate = new Date();
    } else {
      delete taskToBeDone.completedDate;
    }

    setTasks((prevTasks) => {
      return [
        ...prevTasks.map((t) => {
          return t.id === taskToBeDone.id
            ? taskToBeDone
            : t;
        }),
      ];
    });
    await taskService.finishTask(taskToBeDone);
  };

  const clearTasks = () => {
    setTasks([]);
    taskService.clearTasks();
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, removeTask, finishTask, clearTasks }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  return useContext(TaskContext);
}
