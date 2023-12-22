import FormContainer from 'src/components/FormContainer';
import styled from '@emotion/styled';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { EditorState } from 'draft-js';
// import * as Editor from 'ckeditor5-custom-build';
import { useState } from 'react';

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

function LessonTextForm({ setValue, lesson }) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorStateChange = (newState) => {
    setEditorState(newState);
    // You can also perform other actions here, such as saving the content
  };
  const isNew = lesson === null;
  return (
    <FormContainer title="Lesson Content">
      <EditorContainer>
        {/* <CKEditor
          editor={Editor}
          data={isNew ? '<p>Enter lesson content here...</p>' : lesson.text}
          onChange={(_, editor) => {
            const data = editor.getData();
            setValue('text', data);
          }}
        /> */}
        <Editor editorState={editorState} onEditorStateChange={onEditorStateChange} />
      </EditorContainer>
    </FormContainer>
  );
}

export default LessonTextForm;
