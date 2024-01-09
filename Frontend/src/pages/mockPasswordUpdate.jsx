import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import PasswordUpdate from './PasswordUpdate';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import userEvent from '@testing-library/user-event';

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
        user: {}, 
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

    userEvent.type(screen.getByPlaceholderText(/password/i), 'oldPassword');
    userEvent.type(screen.getByPlaceholderText(/new password/i), 'newPassword');
    userEvent.type(screen.getByPlaceholderText(/confirm new password/i), 'newPassword');

    userEvent.click(screen.getByRole('button', { name: /update password/i }));

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

    userEvent.selectOptions(subscribeButton, 'free');
    userEvent.click(subscribeButton);

    await waitFor(() => {
      expect(screen.getByText(/subscribed successfully/i)).toBeInTheDocument();
    });

    userEvent.selectOptions(subscribeButton, 'premium');
    userEvent.click(subscribeButton);

    await waitFor(() => {
      expect(screen.getByText(/unsubscribed successfully/i)).toBeInTheDocument();
    });
  });
});
