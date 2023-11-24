import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import FormContainer from 'src/components/FormContainer';
import Input from './Input';
import { Controller } from 'react-hook-form';
import styled from '@emotion/styled';
import { Icon } from '@iconify/react';

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

const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))`
  & .MuiTooltip-tooltip {
    width: 400px;
    font-size: 0.8rem;
    text-align: center;
  }
`;

function LessonInfoForm({ register, errors, control }) {
  return (
    <FormContainer title="Lesson Information">
      <Stack spacing={2}>
        <Stack direction="row" spacing={2}>
          <Input errors={errors}>
            <TextField
              id="titleArabic"
              label="Lesson Arabic Title"
              variant="outlined"
              fullWidth
              size="normal"
              error={!!errors.titleArabic}
              {...register('titleArabic', { required: 'This field is required' })}
            />
          </Input>
          <Input errors={errors}>
            <TextField
              id="titleEnglish"
              label="Lesson English Title"
              variant="outlined"
              fullWidth
              size="normal"
              error={!!errors.titleEnglish}
              {...register('titleEnglish', {
                required: 'This field is required',
              })}
            />
          </Input>
        </Stack>
        <Stack direction={'row'} spacing={2}>
          <Input errors={errors}>
            <FormControl fullWidth variant="outlined" id="level">
              <InputLabel id="level-label" error={!!errors.level}>
                Lesson Level
              </InputLabel>
              <Controller
                name="level"
                control={control}
                rules={{ required: 'This field is required' }}
                render={({ field }) => (
                  <Select
                    labelId="level-label"
                    label="Lesson Level"
                    error={!!errors.level}
                    {...field}
                  >
                    <MenuItem value="Beginner">Beginner</MenuItem>
                    <MenuItem value="Intermediate">Intermediate</MenuItem>
                    <MenuItem value="Advanced">Advanced</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          </Input>
          <Input errors={errors}>
            <FormControl fullWidth variant="outlined" id="type">
              <InputLabel id="type-label" error={!!errors.type}>
                Lesson Type
              </InputLabel>
              <Controller
                name="type"
                control={control}
                rules={{ required: 'This field is required' }}
                render={({ field }) => (
                  <Select labelId="type-label" label="Lesson Type" error={!!errors.type} {...field}>
                    <MenuItem value="Grammar">Grammar</MenuItem>
                    <MenuItem value="Vocabulary">Vocabulary</MenuItem>
                    <MenuItem value="Listening">Listening</MenuItem>
                    <MenuItem value="Writing">Writing</MenuItem>
                    <MenuItem value="Reading">Reading</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          </Input>
        </Stack>
        <InfoIconContainer>
          <Input errors={errors}>
            <TextField
              id="imageLink"
              label="Lesson Cover Image Link (optional)"
              variant="outlined"
              fullWidth
              size="normal"
              error={!!errors.imageLink}
              {...register('imageLink')}
            />
          </Input>
          <InfoIcon>
            <StyledTooltip
              title="This image will appear as the cover image for the lesson. If no image is provided, a default image will be used."
              arrow
            >
              <Icon id="imageLink" icon="material-symbols:info-outline" />
            </StyledTooltip>
          </InfoIcon>
        </InfoIconContainer>
      </Stack>
    </FormContainer>
  );
}

export default LessonInfoForm;
