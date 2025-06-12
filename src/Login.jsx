import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    IconButton,
    InputAdornment,
    CircularProgress
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import image from './assets/background.png'; // Import your background image
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material'
import Logo from "./assets/logo2.png";
import { useLoginStore } from './store/useLoginStore'; // Import your logo if needed

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
    const { login, logout, user, authSession } = useLoginStore();
    const [password, setPassword] = useState('');
    const [error, setError] = useState({ message: '', state: false });
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = async () => {
            if (user) {
                navigate('/bills'); // Redirect to the bills page if user is already logged in
            }
            else {
                const user = await authSession();
                if (user.data) {
                    navigate('/bills'); // Redirect to the bills page if user is already logged in
                }
                else {
                    navigate('/login'); // Redirect to login page if no user session
                }
            }
        }
        checkSession();
    }, [])

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { status, message } = await login(email, password);
        if (status === 'error') {
            setError({ message, state: true });
        } else {
            setError({ message: '', state: false });
            navigate('/bills'); // Redirect to the bills page on successful login
        }
        setLoading(false);
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
                    <Box
                        component="img"
                        src={Logo} // adjust path as needed
                        alt={Logo}
                        sx={{
                            width: 300, // or '100%', 'auto', etc.
                            height: 'auto',
                            display: 'block',
                            mx: 'auto', // center horizontally
                        }}
                    />

                    <form onSubmit={handleLogin}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Enter your email"
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError({ message: '', state: false });
                                }}
                                required
                                error={error.state}
                            />
                            <TextField
                                fullWidth
                                error={error.state}
                                variant="outlined"
                                placeholder="Enter your password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError({ message: '', state: false })
                                }}
                                required
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff sx={{ color: 'white' }} /> : <Visibility sx={{ color: 'white' }} />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />

                            {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', fontSize: '0.875rem' }}>
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
                            </Box> */}
                            {error.state ? <Typography sx={{ margin: 'auto' }} color='error' >{error.message}</Typography> : ' '}
                            <Box sx={{ m: 1, position: 'relative' }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
                                    sx={{
                                        width: '100%',
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
                                {loading && (<CircularProgress sx={{
                                    color: 'white',
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    marginTop: '-20px',
                                    marginLeft: '-20px',
                                }} color="secondary" />)}
                            </Box>
                        </Box>
                    </form>


                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default Login;
