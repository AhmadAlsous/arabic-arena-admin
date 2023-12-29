import FormContainer from 'src/components/FormContainer';
import { FormControlLabel, TextField, Stack, Switch, Button, Tooltip } from '@mui/material';
import styled from '@emotion/styled';
import { Icon } from '@iconify/react';

import Table from '@mui/material/Table';
import MuiTableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import FormErrorMessage from 'src/components/FormErrorMessage';
import { Controller } from 'react-hook-form';

const InfoIconContainer = styled.div`
  position: relative;
  width: 100%;
`;

const BigInfoIcon = styled.span`
  position: absolute;
  top: 4px;
  right: 8px;
  font-size: 1.7rem;
`;

const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))`
  & .MuiTooltip-tooltip {
    max-width: 400px;
    font-size: 0.8rem;
    text-align: center;
  }
`;

const StyledTableContainer = styled(TableContainer)`
  width: 75%;
  background-color: transparent;
`;

const StyledTableCell = styled(TableCell)`
  && {
    font-size: 1.2rem;

    @media (max-width: 1200px) {
      font-size: 1rem;
    }
  }
`;

const StyledTableHeadCell = styled(StyledTableCell)`
  && {
    font-size: 1rem;
    background-color: #252d63;
    color: #ffffff;
    font-weight: 700;
  }
`;

const StyledTableRow = styled(TableRow)`
  && {
    border: 1.5px solid #cccccc;
  }
`;

const StyledIcon = styled(Icon)`
  cursor: pointer;
`;

function LessonTableForm({ register, errors, setValue, clearErrors, watch, getValues, control }) {
  const tableSwitchValue = watch('hasTable');
  const words = watch('table');

  const addWord = () => {
    setValue('table', [...words, { arabicWord: '', transcription: '' }]);
  };

  const deleteWord = (index) => {
    if (words.length === 1) {
      setValue('table', [{ arabicWord: '', transcription: '' }]);
      return;
    }
    clearErrors(`table.${index}.arabicWord`);
    clearErrors(`table.${index}.transcription`);
    setValue(
      'table',
      words.filter((word, i) => i !== index)
    );
  };

  return (
    <FormContainer title="Vocabulary Table">
      <InfoIconContainer>
        <Controller
          name="hasTable"
          control={control}
          render={({ field: { onChange, value } }) => (
            <FormControlLabel
              id="hasTable"
              control={
                <Switch
                  {...register('hasTable')}
                  checked={value}
                  onChange={(e) => {
                    setValue('hasTable', e.target.checked);
                    onChange(e.target.checked);
                  }}
                />
              }
              label="Add Vocabulary Table &nbsp;"
              labelPlacement="start"
            />
          )}
        />
        <BigInfoIcon>
          <StyledTooltip
            title="Add a vocabulary table that contains the Arabic words and their translations to English and to the student's native language. The student can also listen to the pronunciation of these Arabic words by clicking on a speaker icon."
            arrow
          >
            <Icon id="imageLink" icon="material-symbols:info-outline" />
          </StyledTooltip>
        </BigInfoIcon>
      </InfoIconContainer>
      {tableSwitchValue && (
        <Stack spacing={2} direction={'column'} alignItems={'center'} sx={{ mt: 4 }}>
          <StyledTableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableHeadCell align="center">Arabic Word</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">Transcription</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">Delete</StyledTableHeadCell>
                </TableRow>
              </TableHead>
              <MuiTableBody>
                {words.map((word, index) => {
                  return (
                    <StyledTableRow key={index}>
                      <StyledTableCell align="center">
                        <TextField
                          id={`table.${index}.arabicWord`}
                          label="Arabic Word"
                          variant="outlined"
                          fullWidth
                          size="small"
                          error={!!errors?.table?.[index]?.arabicWord}
                          {...register(`table.${index}.arabicWord`, {
                            required: 'This field is required',
                          })}
                        />
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <TextField
                          id={`table.${index}.transcription`}
                          label="Transcription"
                          variant="outlined"
                          fullWidth
                          size="small"
                          error={!!errors?.table?.[index]?.transcription}
                          {...register(`table.${index}.transcription`, {
                            required: 'This field is required',
                          })}
                        />
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <StyledIcon
                          icon="mdi:delete"
                          color="#252d63"
                          width="25"
                          height="25"
                          onClick={() => deleteWord(index)}
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
              </MuiTableBody>
            </Table>
            {!!errors?.table && (
              <>
                <FormErrorMessage>
                  Please fill all table fields before submitting the form
                </FormErrorMessage>
                <br />
              </>
            )}
            <Button variant="contained" color="primary" onClick={addWord} sx={{ mt: 2 }}>
              Add Word
            </Button>
          </StyledTableContainer>
        </Stack>
      )}
    </FormContainer>
  );
}

export default LessonTableForm;
