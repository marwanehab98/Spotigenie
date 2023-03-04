import { styled } from '@nextui-org/react';

export const SearchButton = styled('button', {
  // reset button styles
  background: 'transparent',
  border: 'none',
  padding: 0,
  // styles
  width: '28px',
  margin: '0 10px',
  dflex: 'center',
  bg: 'transparent',
  borderRadius: '$rounded',
  cursor: 'pointer',
  transition: 'opacity 0.25s ease 0s, transform 0.25s ease 0s',
  svg: {
    size: '100%',
    padding: '5px',
  },
  '&:hover': {
    opacity: 0.8
  },
  '&:active': {  
    transform: 'scale(0.9)',
  }
});