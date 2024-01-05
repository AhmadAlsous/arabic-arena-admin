import React, { useEffect, useState } from 'react';
import { Editor as TextEditor } from 'react-draft-wysiwyg';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const tranformUrl = (url) => {
  let videoId = url.split('/').pop();
  if (url.includes('youtube.com')) videoId = new URL(url).searchParams.get('v');
  return `https://www.youtube.com/embed/${videoId}`;
};

function Editor({ setValue, text, isVideo }) {
  const toolbarVideoOptions = {
    options: [
      'inline',
      'blockType',
      'fontSize',
      'fontFamily',
      'list',
      'textAlign',
      'colorPicker',
      'history',
    ],
    inline: {
      options: ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript'],
    },
    blockType: {
      inDropdown: true,
      options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote', 'Code'],
    },
    fontSize: {
      options: [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72, 96],
    },
    fontFamily: {
      options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana'],
    },
    list: {
      inDropdown: false,
      options: ['unordered', 'ordered'],
    },
    textAlign: {
      inDropdown: false,
      options: ['left', 'center', 'right', 'justify'],
    },
    colorPicker: {
      colors: [
        'rgb(97,189,109)',
        'rgb(26,188,156)',
        'rgb(84,172,210)',
        'rgb(44,130,201)',
        'rgb(147,101,184)',
        'rgb(71,85,119)',
        'rgb(204,204,204)',
        'rgb(65,168,95)',
        'rgb(0,168,133)',
        'rgb(61,142,185)',
        'rgb(41,105,176)',
        'rgb(85,57,130)',
        'rgb(40,50,78)',
        'rgb(0,0,0)',
        'rgb(247,218,100)',
        'rgb(251,160,38)',
        'rgb(235,107,86)',
        'rgb(226,80,65)',
        'rgb(163,143,132)',
        'rgb(239,239,239)',
        'rgb(255,255,255)',
        'rgb(250,197,28)',
        'rgb(243,121,52)',
        'rgb(209,72,65)',
        'rgb(184,49,47)',
        'rgb(124,112,107)',
        'rgb(209,213,216)',
      ],
    },
    history: {
      inDropdown: false,
      options: ['undo', 'redo'],
    },
  };

  const toolbarOptions = {
    ...toolbarVideoOptions,
    options: [
      'inline',
      'blockType',
      'fontSize',
      'fontFamily',
      'list',
      'textAlign',
      'colorPicker',
      'link',
      'embedded',
      'image',
      'history',
    ],
    link: {
      inDropdown: false,
      showOpenOptionOnHover: true,
      defaultTargetOption: '_self',
      options: ['link'],
    },
    embedded: {
      embedCallback: tranformUrl,
      defaultSize: {
        height: '500px',
        width: '100%',
      },
    },
    image: {
      urlEnabled: true,
      alignmentEnabled: true,
      previewImage: false,
      inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
      alt: { present: false, mandatory: false },
    },
    history: {
      inDropdown: false,
      options: ['undo', 'redo'],
    },
  };

  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  useEffect(() => {
    if (text) {
      const contentState = convertFromRaw(text);
      const newEditorState = EditorState.createWithContent(contentState);
      setEditorState(newEditorState);
    } else {
      setEditorState(EditorState.createEmpty());
    }
  }, [text]);

  const onEditorStateChange = (newState) => {
    setEditorState(newState);
    const rawContentState = convertToRaw(newState.getCurrentContent());
    setValue(isVideo ? 'videoText' : 'text', rawContentState, { shouldDirty: true });
  };

  return (
    <TextEditor
      editorState={editorState}
      toolbar={isVideo ? toolbarVideoOptions : toolbarOptions}
      onEditorStateChange={onEditorStateChange}
      editorStyle={{
        border: '1px solid #ccc',
        paddingLeft: '15px',
        paddingRight: '15px',
        marginTop: '-6px',
      }}
      toolbarStyle={{ border: '1px solid #ccc' }}
      placeholder={isVideo ? 'Enter video transcript here...' : 'Enter lesson content here...'}
    />
  );
}

export default Editor;
