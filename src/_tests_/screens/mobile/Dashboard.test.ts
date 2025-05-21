import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DashBoard from '../../../screens/mobile/home/home'; // Adjust the import based on your file structure
import AsyncStorage from '@react-native-async-storage/async-storage';
import navigationService from '@/src/navigation/navigationService';
import { keys } from '@/src/utils/keys';

// Mocking external dependencies
jest.mock('@react-native-async-storage/async-storage', () => ({
  removeItem: jest.fn(),
}));

jest.mock('@/src/navigation/navigationService', () => ({
  navigate: jest.fn(),
}));

jest.mock('../../../utils/config', () => ({
  generateFontSizeNew: jest.fn().mockReturnValue(20),
  isWeb: false, // Mock based on your actual config logic
  getWidth: jest.fn().mockReturnValue(50),
  getHeight: jest.fn().mockReturnValue(50),
}));

jest.mock('@/src/utils/colors', () => ({
  commonColors: { white: 'white' },
  backgroundColors: { signInButton: 'blue' },
}));

describe('DashBoard', () => {
  it('renders correctly', () => {
    const { getByText } = render(<DashBoard />);

    // Check if the "DASHBOARD" text is rendered
    expect(getByText('DASHBOARD')).toBeTruthy();

    // Check if the "Logout" button is rendered
    expect(getByText('Logout')).toBeTruthy();
  });

  it('navigates to Splash screen and removes userToken and userId on logout', () => {
    const { getByText } = render(<DashBoard />);

    // Mocking navigation and AsyncStorage removal
    fireEvent.press(getByText('Logout'));

    // Verify that navigationService.navigate was called with the correct arguments
    expect(navigationService.navigate).toHaveBeenCalledWith('Splash', { animation: true });

    // Verify that AsyncStorage.removeItem was called with correct keys
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(keys.userToken);
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(keys.userId);
  });

  it('calls config.generateFontSizeNew correctly', () => {
    render(<DashBoard />);

    // Check if the font size calculation function is called
    expect(config.generateFontSizeNew).toHaveBeenCalledWith(20);
  });

  it('has correct styles applied', () => {
    const { getByText } = render(<DashBoard />);

    const logoutButton = getByText('Logout').parent;

    // Check if the logout button has correct styles applied
    expect(logoutButton.props.style).toEqual(expect.objectContaining({
      backgroundColor: 'blue', // From the mock of backgroundColors.signInButton
    }));
  });
});
