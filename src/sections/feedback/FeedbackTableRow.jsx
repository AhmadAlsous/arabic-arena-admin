import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import { useState, forwardRef } from 'react';
import { Icon } from '@iconify/react';
import styled from '@emotion/styled';
import clsx from 'clsx';
import { Box } from '@mui/system';
import { Modal as BaseModal } from '@mui/base/Modal';
import HandlerButton from '@mui/material/Button';

const CloseButton = styled.button`
  position: absolute;
  top: 25px;
  right: 25px;
  background-color: transparent;
  border: none;
  cursor: pointer;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 95%;
  gap: 15px;
  margin-bottom: 10px;
`;

const ModalTitle = styled.h4`
  margin: 5px 0 10px 0;
  font-size: 2rem;
  letter-spacing: 1.5px;
  font-weight: 700;
  text-align: center;

  &::first-letter {
    text-transform: uppercase;
  }
`;

const Content = styled.div`
  margin-bottom: 40px;
`;

const Text = styled.p`
  line-height: 1.5;
  text-align: center;
  margin: 0;
`;

const UserName = styled(Text)`
  color: #666;
  font-weight: bold;
`;

const DateText = styled(Text)`
  color: #666;
  font-style: italic;
  margin-top: -10px;
  margin-bottom: 20px;
`;

export default function FeedbackTableRow({ name, type, text, date }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <TableRow hover tabIndex={-1} onClick={handleOpen} sx={{ cursor: 'pointer' }}>
        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2} pl={2}>
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{type}</TableCell>

        <TableCell>{`${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`}</TableCell>

        <TableCell>{date.toLocaleDateString()}</TableCell>
      </TableRow>
      <StyledModal open={open} onClose={handleClose} slots={{ backdrop: StyledBackdrop }}>
        <ModalContent sx={{ width: 500 }}>
          <CloseButton onClick={handleClose}>
            <Icon icon="material-symbols:close" fontSize={25} />
          </CloseButton>
          <ModalTitle>{type}</ModalTitle>
          <UserName>{name}</UserName>
          <DateText>{date.toLocaleDateString()}</DateText>
          <Content>
            <Text>{text}</Text>
          </Content>
          <ButtonContainer>
            <HandlerButton variant="outlined" onClick={handleClose}>
              Close
            </HandlerButton>
          </ButtonContainer>
        </ModalContent>
      </StyledModal>
    </>
  );
}

const Backdrop = forwardRef(function backdrop(props, ref) {
  const { open, className, ownerState, ...other } = props;
  return <div className={clsx({ 'MuiBackdrop-open': open }, className)} ref={ref} {...other} />;
});

const StyledModal = styled(BaseModal)`
  position: fixed;
  z-index: 1300;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledBackdrop = styled(Backdrop)`
  z-index: -1;
  position: fixed;
  inset: 0;
  background-color: rgb(0 0 0 / 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const ModalContent = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: hidden;
  background-color: #f0f0f0;
  border-radius: 8px;
  border: 1px solid #dae2ed;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
  padding: 1rem;
  color: #1c2025;
  font-family:
    IBM Plex Sans,
    sans-serif;
  font-weight: 500;
  text-align: start;
  position: relative;
`;
