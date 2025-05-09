import React from 'react'
import Navigation from './routes/Navigation';
import { AppProvider } from './context/AppProvider';
import { MqttProvider } from './context/MqttProvider';

const App = () => {

  return (
    <AppProvider>
      <MqttProvider>
        <Navigation />
      </MqttProvider>
    </AppProvider>
  );
}

export default App;