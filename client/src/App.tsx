import { ContextProvider } from './context';
import Navigation from './navigation';

const App = () => (
  <ContextProvider>
    <Navigation />
  </ContextProvider>
);

export default App;
