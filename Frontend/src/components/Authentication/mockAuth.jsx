import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import AuthModal from './AuthModal';
import { setAuthModalOpen } from '../../redux/features/authModalSlice';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

describe('AuthModal Component', () => {
  let mockDispatch;
  let mockUseSelector;

  beforeEach(() => {
    mockDispatch = jest.fn();
    mockUseSelector = jest.fn();
    jest.spyOn(React, 'useEffect').mockImplementation(f => f());
    jest.spyOn(React, 'useState').mockImplementation((initial) => [initial, jest.fn()]);

    useSelector.mockImplementation(mockUseSelector);
    useDispatch.mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders AuthModal component with signin form by default', () => {
    mockUseSelector.mockReturnValue({ authModalOpen: true });

    render(
      <Provider store={{}}>
        <AuthModal />
      </Provider>
    );

    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.queryByText('Sign Up')).not.toBeInTheDocument();
  });

  test('switches to signup form when clicking on switch link', () => {
    mockUseSelector.mockReturnValue({ authModalOpen: true });

    render(
      <Provider store={{}}>
        <AuthModal />
      </Provider>
    );

    fireEvent.click(screen.getByText('Switch to Sign Up'));

    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
  });

  test('dispatches setAuthModalOpen action when closing modal', () => {
    mockUseSelector.mockReturnValue({ authModalOpen: true });

    render(
      <Provider store={{}}>
        <AuthModal />
      </Provider>
    );

    fireEvent.click(screen.getByTestId('close-button'));

    expect(mockDispatch).toHaveBeenCalledWith(setAuthModalOpen(false));
  });
});