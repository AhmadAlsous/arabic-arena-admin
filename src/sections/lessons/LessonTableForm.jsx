import FormContainer from 'src/components/FormContainer';
import { FormControlLabel, TextField, Stack, Switch, Button } from '@mui/material';
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

function LessonTableForm({ words, setWords, register, errors, clearErrors, watch }) {
  const tableSwitchValue = watch('hasTable');
  let hasError = false;

  const addWord = () => {
    setWords([...words, { arabicWord: '', transcription: '' }]);
  };

  const deleteWord = (index) => {
    if (words.length === 1) {
      setWords([{ arabicWord: '', transcription: '' }]);
      return;
    }
    clearErrors(`table.${index}.arabicWord`);
    clearErrors(`table.${index}.transcription`);
    const newWords = [...words];
    newWords.splice(index, 1);
    setWords(newWords);
  };

  const handleChange = (e, index, type) => {
    const newWords = [...words];
    newWords[index][type] = e.target.value;
    setWords(newWords);
  };

  return (
    <FormContainer title="Vocabulary Table">
      <FormControlLabel
        id="hasTable"
        control={<Switch {...register('hasTable')} />}
        label="Add Vocabulary Table &nbsp;"
        labelPlacement="start"
      />
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
                  const errorWord = !!(
                    errors.table &&
                    errors.table[index] &&
                    errors.table[index].arabicWord
                  );
                  const errorTranscription = !!(
                    errors.table &&
                    errors.table[index] &&
                    errors.table[index].transcription
                  );
                  if (errorWord || errorTranscription) hasError = true;

                  return (
                    <StyledTableRow key={index}>
                      <StyledTableCell align="center">
                        <TextField
                          id={`table.${index}.arabicWord`}
                          label="Arabic Word"
                          variant="outlined"
                          fullWidth
                          size="small"
                          error={errorWord}
                          value={word.arabicWord}
                          onChange={(e) => handleChange(e, index, 'arabicWord')}
                        />
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <TextField
                          id={`table.${index}.transcription`}
                          label="Transcription"
                          variant="outlined"
                          fullWidth
                          size="small"
                          error={errorTranscription}
                          value={word.transcription}
                          onChange={(e) => handleChange(e, index, 'transcription')}
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
            {hasError && (
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
