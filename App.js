import { PaperProvider, Appbar } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import Ostoslista from './Ostoslista';

export default function App() {
  return (
    <PaperProvider>
      <Appbar mode="medium" elevated>
        <Appbar.Content title="Ostoslista" style= {{alignItems: 'center'}}/>
      </Appbar>
      <Ostoslista />
      <StatusBar style="auto" />
    </PaperProvider>
  );
}