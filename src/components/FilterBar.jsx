import styled from '@emotion/styled';
import MenuComponent from './Menu';

const TypesContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 370px;
  font-size: 0.9rem;
  margin-right: 30px;
`;

const ButtonContainer = styled.span`
  display: inline-block;
  width: ${(props) =>
    props.$level === 'All' ? '65px' : props.$level === 'Intermediate' ? '140px' : '120px'};
`;

function FilterBar({ level, type, onChangeLevel, onChangeType }) {
  const typeItems = ['All', 'Grammar', 'Vocabulary', 'Listening', 'Writing', 'Reading'];
  const levelItems = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  return (
    <TypesContainer type={type}>
      <div>
        Type
        <MenuComponent selectedValue={type} onChange={onChangeType} items={typeItems} />
      </div>
      <div>
        Level
        <ButtonContainer $level={level}>
          <MenuComponent selectedValue={level} onChange={onChangeLevel} items={levelItems} />
        </ButtonContainer>
      </div>
    </TypesContainer>
  );
}

export default FilterBar;
