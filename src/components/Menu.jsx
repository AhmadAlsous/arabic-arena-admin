import { useState } from 'react';
import { Menu, MenuItem } from '@mui/material';
import { Icon } from '@iconify/react';
import styled from '@emotion/styled';

const Button = styled.button`
  background-color: transparent;
  border: 0;
  padding: 10px 20px;
  font-size: 1.1rem;
  position: relative;

  &:hover {
    cursor: pointer;
  }
`;

const Icons = styled(Icon)`
  position: absolute;
  top: 12px;
  right: -2px;
`;

function MenuComponent({ selectedValue, onChange, items }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (value) => {
    setAnchorEl(null);
    if (value) onChange(value);
  };

  return (
    <>
      <Button onClick={handleClick}>
        {selectedValue}
        <Icons icon="fe:arrow-down" />
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => handleClose()}>
        {items.map((item) => (
          <MenuItem key={item} onClick={() => handleClose(item)}>
            {item}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default MenuComponent;
