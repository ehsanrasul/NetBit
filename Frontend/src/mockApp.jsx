import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import MainLayout from './components/layout/MainLayout';
import routes from './routes/routes';
import themeConfigs from './configs/theme.configs';
import 'react-toastify/dist/ReactToastify.css';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

describe('App Component', () => {
  test('renders App component correctly', () => {
    useSelector.mockReturnValue({ themeMode: 'light' });

    render(
      <Provider store={{}}>
        <ThemeProvider theme={themeConfigs.custom({ mode: 'light' })}>
          <CssBaseline />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                {routes.map((route, index) => (
                  route.index ? (
                    <Route
                      index
                      key={index}
                      element={route.state ? (
                        <div>{route.element}</div>
                      ) : <div>{route.element}</div>}
                    />
                  ) : (
                    <Route
                      path={route.path}
                      key={index}
                      element={route.state ? (
                        <div>{route.element}</div>
                      ) : <div>{route.element}</div>}
                    />
                  )
                ))}
              </Route>
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
        <ToastContainer />
      </Provider>
    );
  });
});