import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import { useRouter } from 'src/routes/hooks';
import { bgGradient } from 'src/theme/css';
import Iconify from 'src/components/iconify';
import { useForm } from 'react-hook-form';
import Input from '../lessons/Input';
import { useMutation } from '@tanstack/react-query';
import { validate } from 'src/services/adminServices';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

export default function LoginView() {
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';
  const theme = useTheme();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: '',
      password: '',
    },
  });

  const login = useMutation({
    mutationFn: validate,
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: () => {
      setIsLoading(false);
      sessionStorage.setItem('loggedIn', 'true');
      toast.success(`Login Successful`, { duration: 4000 });
      router.push(from);
    },
    onError: () => {
      setIsLoading(false);
      toast.error(`Incorrect username or password.`, { duration: 5000 });
    },
  });

  if (sessionStorage.getItem('loggedIn')) {
    router.push('/dashboard');
  }

  const onSubmit = (data) => {
    login.mutate(data);
    console.log(data);
  };

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/overlay.jpg',
        }),
        height: 1,
      }}
    >
      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 450,
            textAlign: 'center',
            py: 7,
          }}
        >
          <img src="../../LanguageCenterLogo.png" width={50} />
          <Typography variant="h4" sx={{ mt: 4 }}>
            Sign in to Arabic Arena
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3} mt={5}>
              <Input errors={errors}>
                <TextField
                  id="id"
                  label="Username"
                  variant="outlined"
                  fullWidth
                  size="normal"
                  error={!!errors.id}
                  {...register('id', {
                    required: 'This field is required',
                  })}
                />
              </Input>

              <Input errors={errors}>
                <TextField
                  id="password"
                  label="Password"
                  variant="outlined"
                  fullWidth
                  size="normal"
                  type={showPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  error={!!errors.password}
                  {...register('password', {
                    required: 'This field is required',
                  })}
                />
              </Input>
            </Stack>

            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="inherit"
              disabled={isLoading}
              sx={{ mt: 5 }}
            >
              Login
            </LoadingButton>
          </form>
        </Card>
      </Stack>
    </Box>
  );
}
