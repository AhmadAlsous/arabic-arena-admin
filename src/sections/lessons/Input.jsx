import { Stack } from '@mui/material';
import FormErrorMessage from 'src/components/FormErrorMessage';

function Input({ errors, children }) {
  return (
    <Stack direction="column" sx={{ width: '100%' }}>
      {children}
      {errors[children.props.id] && <FormErrorMessage el={errors[children.props.id]} />}
    </Stack>
  );
}

export default Input;
