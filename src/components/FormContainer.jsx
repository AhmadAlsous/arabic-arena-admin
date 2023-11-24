import styled from '@emotion/styled';
import { Container } from '@mui/material';

const StyledFormContainer = styled.div`
  position: relative;
  border: 3px solid rgba(0, 0, 0, 0.3);
  border-radius: 15px;
  margin-bottom: 40px;
`;

const Title = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  position: absolute;
  top: -40px;
  left: 25px;
  background-color: #f9fafb;
  padding: 0 10px;
  font-family: 'Din-round';
  letter-spacing: 1px;
`;

function FormContainer({ title, children }) {
  return (
    <StyledFormContainer>
      <Title>{title}</Title>
      <Container sx={{ p: 4 }}>{children}</Container>
    </StyledFormContainer>
  );
}

export default FormContainer;
