import { createTheme, ThemeProvider } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { ResetPasswordByToken } from '../../services/auth.service';
import { useSnackbar } from 'notistack';

const schema = yup.object().shape({
    password: yup.string()
      .required("Password is required!")
      .min(8, 'Password must be at least 8 characters long')
      .matches(/[*@!#%&()^~{}]+/, 'Password must have at least one special character!')
      .matches(/[A-Z]+/, 'Password must contain at least one uppercase letter'),
    repeatPassword: yup.string()
      .required("Repeat password is required!")
      .oneOf([yup.ref('password'), ""], 'Passwords must match'),
})

const defaultTheme = createTheme(
    {
      palette: {
        primary: {
          main: '#283777',
        },
        secondary: {
          main: '#faa935',
        },
      },
    }
);

export default function ResetPassword() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    // Get specific parameter
    const token = searchParams.get('token');

    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema),
    })
    const handleResetPassword = async (event: any) => {
        const data = {
            password: event.password,
            passwordRepeat: event.repeatPassword,
            token: token,
        }
        console.log(data);
        try {
            const result = await ResetPasswordByToken(data);
            navigate('/login');
        }
        catch (error) {
            enqueueSnackbar(`Error: ${error}`, { variant: "error" });
        }
    }
    return (
    <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ mb: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Reset Password
            </Typography>
  
            <Box component="form" noValidate onSubmit={handleSubmit(handleResetPassword)} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    error={!!errors.password}
                    helperText={errors.password ? errors.password.message : ["Must be at least 8 characters long, has uppercase and lowercase characters and has special characters like !@#$%..."]}
                    {...register("password")}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                      required
                      fullWidth
                      label="Repeat password"
                      type="password"
                      id="repeatpassword"
                      // autoComplete="new-password"
                      error={!!errors.repeatPassword}
                      helperText={errors.repeatPassword?.message}
                      {...register("repeatPassword")}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Change Password
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    )
}