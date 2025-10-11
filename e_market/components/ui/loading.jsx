import { ActivityIndicator, MD2Colors } from 'react-native-paper';

const Loading = () => (
  <ActivityIndicator animating={true} color={MD2Colors.blueA400} size={'large'}/>
);

export default Loading;