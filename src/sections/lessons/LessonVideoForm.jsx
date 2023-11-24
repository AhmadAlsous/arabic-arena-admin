import FormContainer from 'src/components/FormContainer';
import { FormControlLabel, TextField, Stack, Switch } from '@mui/material';
import Input from './Input';
import { Tooltip } from '@mui/material';
import styled from '@emotion/styled';
import { Icon } from '@iconify/react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build';

const InfoIconContainer = styled.div`
  position: relative;
  width: 100%;
`;

const InfoIcon = styled.span`
  position: absolute;
  top: 16px;
  right: 10px;
  font-size: 1.3rem;
`;

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

const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))`
  & .MuiTooltip-tooltip {
    max-width: 200px;
    font-size: 0.8rem;
    text-align: center;
  }
`;

function LessonVideoForm({ register, errors, setValue, watch }) {
  const videoSwitchValue = watch('video');
  return (
    <FormContainer title="Video Information">
      <FormControlLabel
        id="video"
        control={<Switch {...register('video')} />}
        label="Add Video &nbsp;"
        labelPlacement="start"
      />
      {videoSwitchValue && (
        <Stack spacing={2} direction={'column'} alignItems={'flex-start'} sx={{ mt: 3 }}>
          <InfoIconContainer>
            <Input errors={errors}>
              <TextField
                id="videoLink"
                label="Video Link"
                variant="outlined"
                fullWidth
                size="normal"
                error={!!errors.videoLink}
                {...register('videoLink', {
                  required: 'This field is required',
                  pattern: {
                    value:
                      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be|edpuzzle\.com\/media)\/[a-zA-Z0-9_-]+$/,
                    message: 'Please enter a valid YouTube or Edpuzzle video link',
                  },
                })}
              />
            </Input>
            <InfoIcon>
              <StyledTooltip title="Only YouTube and Edpuzzle videos are allowed" arrow>
                <Icon id="imageLink" icon="material-symbols:info-outline" />
              </StyledTooltip>
            </InfoIcon>
          </InfoIconContainer>
          <EditorContainer>
            <CKEditor
              editor={Editor}
              data="<p>Enter video transcript here...</p>"
              onChange={(_, editor) => {
                const data = editor.getData();
                setValue('videoText', data);
              }}
            />
          </EditorContainer>
        </Stack>
      )}
    </FormContainer>
  );
}

export default LessonVideoForm;
