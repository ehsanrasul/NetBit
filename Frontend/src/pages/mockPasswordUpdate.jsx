import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import PasswordUpdate from './PasswordUpdate';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

jest.mock('../api/modules/user.api', () => ({
  passwordUpdate: jest.fn(() => ({ response: null, err: null })),
  subscribe: jest.fn(() => ({ response: null, err: null })),
  unsubscribe: jest.fn(() => ({ response: null, err: null })),
}));

const mockStore = configureStore([]);

describe('PasswordUpdate Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      user: {
        user: {}, // Mock your user state here
      },
    });
  });

  test('renders PasswordUpdate component correctly', () => {
    render(
      <Provider store={store}>
        <PasswordUpdate />
      </Provider>
    );

    expect(screen.getByText(/update password/i)).toBeInTheDocument();
    expect(screen.getByText(/subscription/i)).toBeInTheDocument();
  });

  test('submits password update form correctly', async () => {
    render(
      <Provider store={store}>
        <PasswordUpdate />
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'oldPassword' } });
    fireEvent.change(screen.getByPlaceholderText(/new password/i), { target: { value: 'newPassword' } });
    fireEvent.change(screen.getByPlaceholderText(/confirm new password/i), { target: { value: 'newPassword' } });

    fireEvent.click(screen.getByRole('button', { name: /update password/i }));

    await waitFor(() => {
      expect(screen.getByText(/update password success/i)).toBeInTheDocument();
    });
  });

  test('subscribes/unsubscribes correctly', async () => {
    render(
      <Provider store={store}>
        <PasswordUpdate />
      </Provider>
    );

    const subscribeButton = screen.getByRole('button', { name: /subscribe/i });

    fireEvent.change(subscribeButton, { target: { value: 'free' } });

    fireEvent.click(subscribeButton);

    await waitFor(() => {
      expect(screen.getByText(/subscribed successfully/i)).toBeInTheDocument();
    });

    fireEvent.change(subscribeButton, { target: { value: 'premium' } });

    fireEvent.click(subscribeButton);

    await waitFor(() => {
      expect(screen.getByText(/unsubscribed successfully/i)).toBeInTheDocument();
    });
  });
});
