import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { CartProvider } from './context/CartContext.tsx';
import './i18n.ts'
import BackToTop from './components/BackToTop.tsx';
// import {store} from './app/store.ts'
import { Provider } from 'react-redux'
import { store, persistor } from './app/store.ts';
import { PersistGate } from 'redux-persist/integration/react';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CartProvider>
      <BackToTop />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </CartProvider>
  </StrictMode>
);
