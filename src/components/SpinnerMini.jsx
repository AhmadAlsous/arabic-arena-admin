import { css, keyframes } from '@emotion/react';
import CircularProgress from '@mui/material/CircularProgress';

const rotate = keyframes`
  to {
    transform: rotate(1turn);
  }
`;

const Spinner = css`
  width: 2.4rem;
  height: 2.4rem;
  animation: ${rotate} 1.5s infinite linear;
`;

export default function SpinnerMini() {
  return <CircularProgress css={Spinner} />;
}
