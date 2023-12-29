import FormContainer from 'src/components/FormContainer';
import styled from '@emotion/styled';
import Editor from 'src/components/Editor';

const EditorContainer = styled.div`
  width: 100%;
  padding-top: 5px;
`;

function LessonTextForm({ setValue, getValues }) {
  return (
    <FormContainer title="Lesson Content">
      <EditorContainer>
        <Editor setValue={setValue} text={getValues('text')} />
      </EditorContainer>
    </FormContainer>
  );
}

export default LessonTextForm;
