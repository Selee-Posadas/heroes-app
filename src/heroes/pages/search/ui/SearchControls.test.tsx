import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, test, expect } from 'vitest';
import { SearchControls } from './SearchControls';

if (typeof window.ResizeObserver === 'undefined') {
    class ResizeObserver {
        observe(){}
        unobserve(){}
        disconnect(){}
    }
    window.ResizeObserver = ResizeObserver;
}




const renderSearchControls = (intialEntries: string[] = ["/"]) => {
  return render(
    <MemoryRouter initialEntries={intialEntries}>
      
        <SearchControls />
    </MemoryRouter>
  );
};

describe('SearchControls', () => {
  test('Should render with default values', () => {
    const {container} = renderSearchControls();
    expect(container).toMatchSnapshot();
  });
  test('Should set input value when search param name is set', () => {
    renderSearchControls(['/?name=batman']);

    const input = screen.getByPlaceholderText("Search heroes, villains, powers, teams...");
    expect(input.getAttribute('value')).toBe('batman');
});
test('Should change params when input is changed and enter is pressed', () => {
    renderSearchControls(['/?name=batman']);
    
    const input = screen.getByPlaceholderText("Search heroes, villains, powers, teams...");
    expect(input.getAttribute('value')).toBe('batman');
    
    fireEvent.change(input, {target: {value: 'superman'}});
    fireEvent.keyDown(input, {key: 'Enter'});
    expect(input.getAttribute('value')).toBe('superman');
  });

  test('should change params strength when slider is modified', () => {
     renderSearchControls(['/?name=batman&active-accordion=advanced-filters']);
     const slider = screen.getByRole('slider');

     expect(slider.getAttribute('aria-valuenow')).toBe('0');
     
     
     fireEvent.keyDown(slider, {key: 'ArrowRight'});
     
     expect(slider.getAttribute('aria-valuenow')).toBe('1');
     
  });

  test('should accordion be open when active-accordion is set', () => {
    renderSearchControls(['/?name=batman&active-accordion=advanced-filters']);

    const accordion = screen.getByTestId('accordion');
    const accordionItem = accordion.querySelector('div');
    

    expect(accordionItem?.getAttribute('data-state')).toBe('open');
  });
  test('should accordion be close when active-accordion is not set', () => {
    renderSearchControls(['/?name=batman']);

    const accordion = screen.getByTestId('accordion');
    const accordionItem = accordion.querySelector('div');
    

    expect(accordionItem?.getAttribute('data-state')).toBe('closed');
  });
});