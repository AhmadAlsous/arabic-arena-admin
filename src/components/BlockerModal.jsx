import { useState, forwardRef } from 'react';
import styled from '@emotion/styled';
import clsx from 'clsx';
import { Box } from '@mui/system';
import { Modal as BaseModal } from '@mui/base/Modal';
import HandlerButton from '@mui/material/Button';
import { Icon } from '@iconify/react';

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

const ConfirmContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  margin: 11px 0 0 0;
  letter-spacing: 1.5px;
`;

const ConfirmText = styled.div`
  font-size: 1rem;
  line-height: 1.5;
  margin: 30px;
  text-align: center;
`;

function BlockerModal({ cancel, proceed }) {
  const [open, setOpen] = useState(true);
  const handleClose = () => {
    setOpen(false);
    cancel();
  };
  const handleSubmit = () => {
    setOpen(false);
    proceed();
  };

  return (
    <div>
      <StyledModal open={open} onClose={handleClose} slots={{ backdrop: StyledBackdrop }}>
        <ModalContent sx={{ width: '400px' }}>
          <CloseButton onClick={handleClose}>
            <Icon icon="material-symbols:close" fontSize={25} />
          </CloseButton>
          <ConfirmContainer>
            <Title>Confirmation</Title>
            <ConfirmText>
              Are you sure you want to leave this page? All your changes will be lost.
            </ConfirmText>
          </ConfirmContainer>
          <ButtonContainer>
            <HandlerButton variant="outlined" onClick={handleClose}>
              Cancel
            </HandlerButton>
            <HandlerButton variant="contained" onClick={handleSubmit}>
              Proceed
            </HandlerButton>
          </ButtonContainer>
        </ModalContent>
      </StyledModal>
    </div>
  );
}

export default BlockerModal;

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
