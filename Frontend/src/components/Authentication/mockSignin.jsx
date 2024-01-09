import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import SigninForm from './SigninForm';
import userApi from '../../api/modules/user.api';
import { setAuthModalOpen } from '../../redux/features/authModalSlice';
import { setUser } from '../../redux/features/userSlice';

jest.mock('../../api/modules/user.api');
jest.mock('../../redux/features/authModalSlice', () => ({
  setAuthModalOpen: jest.fn(),
}));

jest.mock('../../redux/features/userSlice', () => ({
  setUser: jest.fn(),
}));

describe('SigninForm Component', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.fn();
    jest.spyOn(React, 'useDispatch').mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders SigninForm component', () => {
    render(
      <Provider store={{}}>
        <SigninForm />
      </Provider>
    );

    expect(screen.getByPlaceholderText('username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('password')).toBeInTheDocument();
    expect(screen.getByText('sign in')).toBeInTheDocument();
    expect(screen.getByText('sign up')).toBeInTheDocument();
  });

  test('dispatches setUser and closes modal on successful sign in', async () => {
    userApi.signin.mockResolvedValue({ response: 'mockUser' });

    render(
      <Provider store={{}}>
        <SigninForm />
      </Provider>
    );

    fireEvent.change(screen.getByPlaceholderText('username'), { target: { value: 'testUser' } });
    fireEvent.change(screen.getByPlaceholderText('password'), { target: { value: 'testPassword' } });
    fireEvent.click(screen.getByText('sign in'));

    await waitFor(() => {
      expect(userApi.signin).toHaveBeenCalledWith({ username: 'testUser', password: 'testPassword' });
      expect(mockDispatch).toHaveBeenCalledWith(setUser('mockUser'));
      expect(mockDispatch).toHaveBeenCalledWith(setAuthModalOpen(false));
    });
  });

  test('displays error message on unsuccessful sign in', async () => {
    const errorMessage = 'Invalid credentials';
    userApi.signin.mockResolvedValue({ err: { message: errorMessage } });

    render(
      <Provider store={{}}>
        <SigninForm />
      </Provider>
    );

    fireEvent.click(screen.getByText('sign in'));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  test('switches to signup form on sign up button click', () => {
    render(
      <Provider store={{}}>
        <SigninForm />
      </Provider>
    );

    fireEvent.click(screen.getByText('sign up'));

    expect(mockDispatch).toHaveBeenCalledWith(setAuthModalOpen(false));
  });
});