import FormContainer from 'src/components/FormContainer';
import styled from '@emotion/styled';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build';

const EditorContainer = styled.div`
  width: 100%;
  padding-top: 15px;

  & .ck.ck-editor__main > .ck-editor__editable {
    background-color: transparent;
  }

  & .ck.ck-toolbar {
    background-color: transparent;
  }
`;

function LessonTextForm({ setValue }) {
  return (
    <FormContainer title="Lesson Content">
      <EditorContainer>
        <CKEditor
          editor={Editor}
          data="<p>Enter lesson content here...</p>"
          onChange={(_, editor) => {
            const data = editor.getData();
            setValue('text', data);
          }}
        />
      </EditorContainer>
    </FormContainer>
  );
}

export default LessonTextForm;
