import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import { languages } from 'src/config/flags';

export default function UserTableRow({ name, email, level, language }) {
  const countryCode = languages.find((item) => item.language === language).countryCode;
  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2} pl={2}>
            <img src={`https://flagcdn.com/w320/${countryCode}.png`} width="20px" height="13px" />
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{email}</TableCell>

        <TableCell>{level}</TableCell>

        <TableCell>{language}</TableCell>
      </TableRow>
    </>
  );
}
