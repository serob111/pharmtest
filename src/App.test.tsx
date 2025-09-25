import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import './i18n';
import Home from './pages/home/Home';

describe('Home', () => {
  it('renders welcome message', () => {
    render(<Home />);
    expect(screen.getByText('Welcome to Pharmacy!')).toBeInTheDocument();
  });

  it('changes language when Russian button is clicked', () => {
    render(<Home />);
    const russianButton = screen.getByText('Русский');
    fireEvent.click(russianButton);
    expect(screen.getByText('Добро пожаловать в Аптеку')).toBeInTheDocument();
  });

  it('changes language when English button is clicked', () => {
    render(<Home />);
    const russianButton = screen.getByText('Русский');
    const englishButton = screen.getByText('English');
    
    fireEvent.click(russianButton);
    fireEvent.click(englishButton);
    
    expect(screen.getByText('Welcome to Pharmacy!')).toBeInTheDocument();
  });
});