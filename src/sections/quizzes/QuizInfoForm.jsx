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
import Input from '../lessons/Input';
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

function QuizInfoForm({ register, errors, control }) {
  return (
    <FormContainer title="Quiz Information">
      <Stack spacing={2} alignItems={'center'}>
        <Stack direction="row" spacing={2} width={'100%'}>
          <Input errors={errors}>
            <TextField
              id="titleArabic"
              label="Quiz Arabic Title"
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
              label="Quiz English Title"
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
        <Stack direction={'row'} spacing={2} width={'100%'}>
          <Input errors={errors}>
            <FormControl fullWidth variant="outlined" id="level">
              <InputLabel id="level-label" error={!!errors.level}>
                Quiz Level
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
                Quiz Type
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
        <Stack direction={'row'} spacing={2} width={'100%'}>
          <InfoIconContainer>
            <Input errors={errors}>
              <TextField
                id="time"
                label="Quiz Time Limit (in minutes)"
                variant="outlined"
                size="normal"
                error={!!errors.time}
                {...register('time', {
                  setValueAs: (value) => parseInt(value),
                  required: 'This field is required',
                  min: {
                    value: 1,
                    message: 'Please enter a valid time limit',
                  },
                  max: {
                    value: 120,
                    message: 'Time limit must be less than 2 hours',
                  },
                  validate: {
                    positive: (value) => parseInt(value) > 0 || 'Please enter a valid time limit',
                  },
                })}
              />
            </Input>
            <InfoIcon>
              <StyledTooltip
                title="Enter the time limit for the quiz in minutes. Maximum time limit is 120 minutes."
                arrow
              >
                <Icon id="time" icon="material-symbols:info-outline" />
              </StyledTooltip>
            </InfoIcon>
          </InfoIconContainer>
          <InfoIconContainer>
            <Input errors={errors}>
              <TextField
                id="imageLink"
                label="Quiz Cover Image Link (optional)"
                variant="outlined"
                fullWidth
                size="normal"
                error={!!errors.imageLink}
                {...register('imageLink')}
              />
            </Input>
            <InfoIcon>
              <StyledTooltip
                title="This image will appear as the cover image for the quiz. If no image is provided, a default image will be used."
                arrow
              >
                <Icon id="imageLink" icon="material-symbols:info-outline" />
              </StyledTooltip>
            </InfoIcon>
          </InfoIconContainer>
        </Stack>
      </Stack>
    </FormContainer>
  );
}

export default QuizInfoForm;
