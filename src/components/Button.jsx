import { styled } from '@mui/material/styles';
import MuiButton from '@mui/material/Button';

const Button = styled(MuiButton)(({ theme, variant, color = 'primary' }) => {
  const base = {
    padding: '8px 16px',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: 500,
    textTransform: 'none',
    transition: 'all 0.2s ease',
  };

  const isPrimary = color === 'primary';

  const variants = {
    text: {
      backgroundColor: 'transparent',
      color: isPrimary ? '#374151' : '#6b7280',
      '&:hover': {
        backgroundColor: 'rgba(55, 65, 81, 0.04)',
      },
    },
    contained: {
      backgroundColor: isPrimary ? '#1f3d5a' : '#f9fafb',
      color: isPrimary ? '#fff' : '#374151',
      boxShadow:
        '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
      '&:hover': {
        backgroundColor: isPrimary ? '#1f2937' : '#f3f4f6',
      },
    },
    outlined: {
      backgroundColor: 'transparent',
      border: `1px solid ${isPrimary ? '#374151' : '#d1d5db'}`,
      color: isPrimary ? '#374151' : '#6b7280',
    },
  };

  return {
    ...base,
    ...(variants[variant] || variants.text),
  };
});
export default Button;