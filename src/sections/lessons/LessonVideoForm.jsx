import FormContainer from 'src/components/FormContainer';
import { FormControlLabel, TextField, Stack, Switch } from '@mui/material';
import Input from './Input';
import { Tooltip } from '@mui/material';
import styled from '@emotion/styled';
import { Icon } from '@iconify/react';
import Editor from 'src/components/Editor';

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

const BigInfoIcon = styled.span`
  position: absolute;
  top: 4px;
  right: 8px;
  font-size: 1.7rem;
`;

const EditorContainer = styled.div`
  width: 100%;
  padding-top: 15px;
`;

const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))`
  & .MuiTooltip-tooltip {
    max-width: 310px;
    font-size: 0.8rem;
    text-align: center;
  }
`;

function LessonVideoForm({ register, errors, setValue, watch, lesson, getValues }) {
  const isNew = lesson === null;
  const videoSwitchValue = watch('video');
  return (
    <FormContainer title="Video Information">
      <InfoIconContainer>
        <FormControlLabel
          id="video"
          control={
            <Switch {...register('video')} defaultChecked={isNew ? false : !!getValues('video')} />
          }
          label="Add Video &nbsp;"
          labelPlacement="start"
        />
        <BigInfoIcon>
          <StyledTooltip
            title="Add a Youtube or Edpuzzle video to the lesson. This video will appear first thing below the title. You can optionally add a transcript to this video."
            arrow
          >
            <Icon id="imageLink" icon="material-symbols:info-outline" />
          </StyledTooltip>
        </BigInfoIcon>
      </InfoIconContainer>
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
            <Editor setValue={setValue} text={getValues('videoText')} isVideo={true} />
          </EditorContainer>
        </Stack>
      )}
    </FormContainer>
  );
}

export default LessonVideoForm;
