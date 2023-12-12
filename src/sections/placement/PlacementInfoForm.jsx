import { Stack, TextField, Tooltip } from '@mui/material';
import FormContainer from 'src/components/FormContainer';
import Input from '../lessons/Input';
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

function PlacementInfoForm({ register, errors }) {
  return (
    <FormContainer title="Placement Test Information">
      <Stack spacing={2} alignItems={'center'}>
        <Stack direction="row" spacing={2} width={'100%'}>
          <InfoIconContainer>
            <Input errors={errors}>
              <TextField
                id="advanced"
                label="Advanced Minimum Score"
                variant="outlined"
                fullWidth
                size="normal"
                error={!!errors.advanced}
                {...register('advanced', {
                  required: 'This field is required',
                })}
              />
            </Input>
            <InfoIcon>
              <StyledTooltip
                title="The minimum score out of 100 required to be placed in the advanced level. For example, if you enter 80, then students who score 80 or above will be placed in the advanced level."
                arrow
              >
                <Icon id="time" icon="material-symbols:info-outline" />
              </StyledTooltip>
            </InfoIcon>
          </InfoIconContainer>
          <InfoIconContainer>
            <Input errors={errors}>
              <TextField
                id="intermediate"
                label="Intermediate Minumum Score"
                variant="outlined"
                fullWidth
                size="normal"
                error={!!errors.intermediate}
                {...register('intermediate', { required: 'This field is required' })}
              />
            </Input>
            <InfoIcon>
              <StyledTooltip
                title="The minimum score out of 100 required to be placed in the intermediate level. For example, if you enter 50, then students who score between 50 and the advanced minimum score will be placed in the intermediate level, and lower students will be placed in beginner."
                arrow
              >
                <Icon id="time" icon="material-symbols:info-outline" />
              </StyledTooltip>
            </InfoIcon>
          </InfoIconContainer>
        </Stack>
        <Stack width={'50%'}>
          <InfoIconContainer>
            <Input errors={errors}>
              <TextField
                id="time"
                label="Placement Test Time Limit (in minutes)"
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
                title="Enter the time limit for the placement test in minutes. Maximum time limit is 120 minutes."
                arrow
              >
                <Icon id="time" icon="material-symbols:info-outline" />
              </StyledTooltip>
            </InfoIcon>
          </InfoIconContainer>
        </Stack>
      </Stack>
    </FormContainer>
  );
}

export default PlacementInfoForm;
