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
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Input from '../lessons/Input';
import { useMutation } from '@tanstack/react-query';
import { changePassword } from 'src/services/adminServices';
import toast from 'react-hot-toast';

export default function PasswordView() {
  const theme = useTheme();
  const navigate = useNavigate();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClick = () => {
    router.push('/dashboard');
  };

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const editPassword = useMutation({
    mutationFn: changePassword,
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: () => {
      setIsLoading(false);
      toast.success(`Password changed successfully`, { duration: 4000 });
      router.push('/dashboard');
    },
    onError: () => {
      setIsLoading(false);
      toast.error(`Incorrect password.`, { duration: 5000 });
    },
  });

  const currentPassword = watch('currentPassword');
  const newPassword = watch('newPassword');

  const validateNewPassword = (value) =>
    value === currentPassword ? 'New password must be different from current password' : true;

  const validateConfirmPassword = (value) =>
    value === newPassword ? true : 'Passwords do not match';

  const onSubmit = (data) => {
    console.log(data);
    editPassword.mutate(data);
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
            Change Password
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3} mt={5}>
              <Input errors={errors}>
                <TextField
                  name="currentPassword"
                  label="Current Password"
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
                  error={!!errors.currentPassword}
                  {...register('currentPassword', { required: 'This field is required' })}
                />
              </Input>
              <Input errors={errors}>
                <TextField
                  name="newPassword"
                  label="New Password"
                  type={showNewPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                          <Iconify icon={showNewPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  error={!!errors.newPassword}
                  helperText={errors.newPassword?.message}
                  {...register('newPassword', {
                    required: 'This field is required',
                    validate: validateNewPassword,
                  })}
                />
              </Input>
              <Input errors={errors}>
                <TextField
                  name="confirmpassword"
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          <Iconify
                            icon={showConfirmPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  {...register('confirmPassword', {
                    required: 'This field is required',
                    validate: validateConfirmPassword,
                  })}
                />
              </Input>
            </Stack>
          </form>
          <Stack spacing={3} direction={'row'} marginTop={3}>
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="outlined"
              color="inherit"
              onClick={() => navigate(-1)}
              sx={{ mt: 5 }}
            >
              Cancel
            </LoadingButton>
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="inherit"
              onClick={handleClick}
              sx={{ mt: 5 }}
              disabled={!isDirty || isLoading}
            >
              Change
            </LoadingButton>
          </Stack>
        </Card>
      </Stack>
    </Box>
  );
}
