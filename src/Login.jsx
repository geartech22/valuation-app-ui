import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Checkbox,
    FormControlLabel,
    Link,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import image from './assets/background.png'; // Import your background image
import { useNavigate } from 'react-router-dom';


// Create a custom Material-UI theme to adjust default styles if needed
const theme = createTheme({
    typography: {
        fontFamily: 'Inter, sans-serif', // Ensuring the font is Inter
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiInputBase-input': {
                        color: 'white', // Text color for input
                        padding: '12px 14px', // Adjust padding for input field
                        borderRadius: '8px', // Slightly rounded corners for input
                    },
                    '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)', // Placeholder text color
                    },
                    '& .MuiInputBase-input::placeholder': {
                        color: 'rgba(255, 255, 255, 0.7)', // Placeholder text color
                        opacity: 1, // Ensure placeholder is fully visible
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.5)', // Border color
                        borderRadius: '8px', // Ensure outline also has rounded corners
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.8)', // Hover border color
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white', // Focused border color
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '12px', // Rounded corners for buttons
                    padding: '12px 24px', // Padding for buttons
                    textTransform: 'none', // Prevent uppercase transform
                },
            },
        },
        MuiCheckbox: {
            styleOverrides: {
                root: {
                    color: 'rgba(255, 255, 255, 0.7)', // Checkbox border color
                    '&.Mui-checked': {
                        color: 'white', // Checked checkbox color
                    },
                },
            },
        },
    },
});


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // In a real application, you would handle authentication here.
        // For this example, we'll just log the values.
        console.log('Email:', email);
        console.log('Password:', password);
        console.log('Remember Me:', rememberMe);
        // You could add a message box here to provide feedback to the user.
    };

    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundImage: `url(${image})`, // Correct way to set background image
                    fontFamily: 'Inter, sans-serif',
                }}
            >
                <Box
                    sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)', // White with 10% opacity
                        backdropFilter: 'blur(10px)', // Glassmorphism blur effect
                        border: '1px solid rgba(255, 255, 255, 0.3)', // Semi-transparent white border
                        borderRadius: '16px', // Rounded corners for the form container
                        padding: '32px', // Padding inside the form
                        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)', // Shadow for depth
                        maxWidth: '448px', // Equivalent to max-w-md in Tailwind (448px)
                        width: '100%',
                        margin: '0 16px', // mx-4 equivalent
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '24px', // Space between elements
                    }}
                >
                    <Typography variant="h4" component="h2" sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                        Paramount Valuations
                    </Typography>

                    <form onSubmit={handleLogin}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Enter your email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Enter your password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', fontSize: '0.875rem' }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            sx={{
                                                color: 'rgba(255, 255, 255, 0.7)',
                                                '&.Mui-checked': {
                                                    color: 'white',
                                                },
                                            }}
                                        />
                                    }
                                    label="Remember me"
                                    sx={{ '& .MuiTypography-root': { color: 'white' } }} // Label color
                                />
                                <Link href="#" underline="hover" sx={{ color: 'white' }}>
                                    Forgot password?
                                </Link>
                            </Box>

                            <Button
                                onClick={() => { navigate('/bills') }}
                                type="submit"
                                variant="contained"
                                sx={{
                                    backgroundColor: 'white',
                                    color: '#1a202c', // Equivalent to gray-800
                                    fontWeight: 'bold',
                                    '&:hover': {
                                        backgroundColor: '#e2e8f0', // Equivalent to gray-200
                                    },
                                }}
                            >
                                Log In
                            </Button>
                        </Box>
                    </form>

                    <Typography variant="body2" sx={{ color: 'white', textAlign: 'center', marginTop: '16px' }}>
                        Don't have an account?{' '}
                        <Link href="#" underline="hover" sx={{ color: 'white', fontWeight: 'bold' }}>
                            Register
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default Login;
