import { useRoute } from '@react-navigation/native';

import TaskDetail from '../components/TaskDetail';

export default function TaskDetailScreen() {
    const { params } = useRoute();
    const { task } = params;
    return <TaskDetail task={task} />
}