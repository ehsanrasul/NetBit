import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import FavoriteList from './FavoriteList';

jest.mock('../api/modules/favorite.api', () => ({
  getList: jest.fn(() => ({ response: [], err: null })),
  remove: jest.fn(() => ({ response: null, err: null })),
}));

const mockStore = configureStore([thunk]);

describe('FavoriteList Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      user: {
      },
    });
  });

  test('renders FavoriteList component correctly', async () => {
    render(
      <Provider store={store}>
        <FavoriteList />
      </Provider>
    );

    expect(screen.getByText(/Your favorites/i)).toBeInTheDocument();
  });

  test('renders media items and loads more on button click', async () => {
    render(
      <Provider store={store}>
        <FavoriteList />
      </Provider>
    );

    expect(screen.getByText(/Your favorites/i)).toBeInTheDocument();

    userEvent.click(screen.getByText('load more'));

    await waitFor(() => {
      expect(screen.getByText(/remove/i)).toBeInTheDocument();
    });
  });

  test('removes a favorite item on button click', async () => {
    render(
      <Provider store={store}>
        <FavoriteList />
      </Provider>
    );

    expect(screen.getByText(/Your favorites/i)).toBeInTheDocument();

    userEvent.click(screen.getByText('remove'));

    await waitFor(() => {
      expect(screen.queryByText(/remove/i)).not.toBeInTheDocument();
    });
  });
});
