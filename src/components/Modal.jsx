import { useState, forwardRef, cloneElement, isValidElement } from 'react';
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

function Modal({ trigger, children, width = 400, onSubmit, btn }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = () => {
    handleClose();
    if (onSubmit) onSubmit();
  };
  const triggerElement = isValidElement(trigger)
    ? cloneElement(trigger, { onClick: handleOpen })
    : null;

  return (
    <div>
      {triggerElement}
      <StyledModal open={open} onClose={handleClose} slots={{ backdrop: StyledBackdrop }}>
        <ModalContent sx={{ width }}>
          <CloseButton onClick={handleClose}>
            <Icon icon="material-symbols:close" fontSize={25} />
          </CloseButton>
          {children}
          <ButtonContainer>
            <HandlerButton variant="outlined" onClick={handleClose}>
              Cancel
            </HandlerButton>
            <HandlerButton variant="contained" onClick={handleSubmit}>
              {btn}
            </HandlerButton>
          </ButtonContainer>
        </ModalContent>
      </StyledModal>
    </div>
  );
}

export default Modal;

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
