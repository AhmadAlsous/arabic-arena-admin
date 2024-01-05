import styled from '@emotion/styled';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import { useResponsive } from 'src/hooks/use-responsive';

import { bgBlur } from 'src/theme/css';

import Iconify from 'src/components/iconify';

import { NAV, HEADER } from './config-layout';
import { useRouter } from 'src/routes/hooks';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export default function Header({ onOpenNav }) {
  const router = useRouter();
  const theme = useTheme();

  const lgUp = useResponsive('up', 'lg');

  const handleLogout = () => {
    sessionStorage.removeItem('loggedIn');
    router.push('/dashboard');
  };

  const renderContent = (
    <Container>
      {!lgUp && (
        <IconButton onClick={onOpenNav} sx={{ mr: 1 }}>
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>
      )}

      <img src="/LanguageCenterLogo.png" alt="logo" width="40" height="45" />

      <Stack direction="row" alignItems="center" spacing={1}>
        <Button sx={{ color: 'rgba(255, 0, 0, 0.7)' }} size="large" onClick={handleLogout}>
          LOG OUT
        </Button>
      </Stack>
    </Container>
  );

  return (
    <AppBar
      sx={{
        boxShadow: 'none',
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        ...bgBlur({
          color: theme.palette.background.default,
        }),
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(lgUp && {
          width: `calc(100% - ${NAV.WIDTH + 1}px)`,
          height: HEADER.H_DESKTOP,
        }),
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}
