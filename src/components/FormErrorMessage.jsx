import styled from '@emotion/styled';
import { Icon } from '@iconify/react';

const ErrorMessage = styled.span`
  color: red;
  font-size: 0.8rem;
  margin-top: 5px;
  position: relative;
`;

const IconContainer = styled.span`
  position: absolute;
  top: ${(props) => (props.$el ? '2px' : '0px')};
`;

function FormErrorMessage({ el, children }) {
  return (
    <ErrorMessage>
      <IconContainer $el={el}>
        <Icon icon="heroicons-solid:exclaimation-circle" fontSize={15} />
      </IconContainer>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{el ? el.message : children}
    </ErrorMessage>
  );
}

export default FormErrorMessage;
