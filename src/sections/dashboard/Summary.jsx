import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { fShortenNumber } from 'src/utils/format-number';

export default function Summary({ title, total, icon, link, color = 'primary', sx, ...other }) {
  return (
    <Link to={link}>
      <Card
        component={Stack}
        spacing={3}
        direction="row"
        sx={{
          px: 3,
          py: 5,
          borderRadius: 2,
          ':hover': {
            backgroundColor: '#f0f0f0',
            cursor: 'pointer',
          },
          ...sx,
        }}
        {...other}
      >
        {icon && <Box sx={{ width: 64, height: 64 }}>{icon}</Box>}

        <Stack spacing={0.5}>
          <Typography variant="h4">{fShortenNumber(total)}</Typography>

          <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
            {title}
          </Typography>
        </Stack>
      </Card>
    </Link>
  );
}
