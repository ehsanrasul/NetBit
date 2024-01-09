
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import PersonDetail from './PersonDetail';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

jest.mock('../api/modules/person.api', () => ({
  detail: jest.fn(() => ({ response: null, err: null })),
}));

const mockStore = configureStore([]);

describe('PersonDetail Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      person: {
        // Mock your person state here
      },
    });
  });

  test('renders PersonDetail component correctly', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/person/123']}>
          <Route path="/person/:personId">
            <PersonDetail />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/medias/i)).toBeInTheDocument();
    });
  });

  test('handles API response correctly', async () => {
    const mockedPerson = {
      id: 123,
      name: 'John Doe',
      birthday: '1990-01-01',
      deathday: '2022-12-31',
      profile_path: 'path/to/image.jpg',
      biography: 'A short biography.',
    };

    jest.mock('../api/modules/person.api', () => ({
      detail: jest.fn(() => ({ response: mockedPerson, err: null })),
    }));

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/person/123']}>
          <Route path="/person/:personId">
            <PersonDetail />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/John Doe \(1990 - 2022\)/i)).toBeInTheDocument();
      expect(screen.getByText(/A short biography./i)).toBeInTheDocument();
    });
  });
});

