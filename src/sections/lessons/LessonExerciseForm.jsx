import FormContainer from 'src/components/FormContainer';
import {
  FormControlLabel,
  TextField,
  Stack,
  Switch,
  Typography,
  MenuItem,
  Button,
  Radio,
  Checkbox,
  RadioGroup,
} from '@mui/material';
import styled from '@emotion/styled';
import { Icon } from '@iconify/react';

import Table from '@mui/material/Table';
import MuiTableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Input from './Input';
import FormErrorMessage from 'src/components/FormErrorMessage';

const StyledTableContainer = styled(TableContainer)`
  width: 100%;
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

function LessonExerciseForm({ register, errors, setValue, watch }) {
  const exercises = watch('exercises');
  const exerciseSwitchValue = watch('hasExercises');

  const handleAddExercise = () => {
    setValue('exercises', [
      ...exercises,
      {
        questionArabic: '',
        questionEnglish: '',
        questionType: 'mutipleChoice',
        audioWord: '',
        options: ['', ''],
        correctAnswer: [],
      },
    ]);
  };

  const handleDeleteExercise = (index) => {
    if (exercises.length === 1) {
      setValue(`exercises.${index}.questionArabic`, '');
      setValue(`exercises.${index}.questionEnglish`, '');
      setValue(`exercises.${index}.questionType`, 'multipleChoice');
      setValue(`exercises.${index}.audioWord`, '');
      setValue(`exercises.${index}.options`, ['', '']);
      setValue(`exercises.${index}.correctAnswer`, []);
      return;
    }
    setValue(
      'exercises',
      exercises.filter((exercise) => exercise !== exercises[index])
    );
  };

  const handleAddOption = (index) => {
    const length = exercises[index].options.length;
    setValue(`exercises.${index}.options.${length}`, '');
  };

  const handleDeleteOption = (index, optionIndex) => {
    if (exercises[index].correctAnswer.includes(exercises[index].options[optionIndex])) {
      setValue(
        `exercises.${index}.correctAnswer`,
        exercises[index].correctAnswer.filter(
          (answer) => answer !== exercises[index].options[optionIndex]
        )
      );
    }
    if (exercises[index].options.length === 1) {
      setValue(`exercises.${index}.options.${optionIndex}`, '');
      return;
    }
    setValue(
      `exercises.${index}.options`,
      exercises[index].options.filter((option) => option !== exercises[index].options[optionIndex])
    );
  };

  const handleMarkCorrectRadio = (index, option) => {
    setValue(`exercises.${index}.correctAnswer`, [option]);
  };

  const handleMarkCorrectCheckbox = (index, option) => {
    const correctAnswer = exercises[index].correctAnswer;
    if (correctAnswer.includes(option)) {
      setValue(
        `exercises.${index}.correctAnswer`,
        correctAnswer.filter((answer) => answer !== option)
      );
    } else {
      setValue(`exercises.${index}.correctAnswer`, [...correctAnswer, option]);
    }
  };

  console.log(exercises);

  return (
    <FormContainer title="Exercises">
      <FormControlLabel
        id="hasExercises"
        control={<Switch {...register('hasExercises')} />}
        label="Add Exercises &nbsp;"
        labelPlacement="start"
      />
      {exercises.map((exercise, index) => (
        <Stack
          key={index}
          spacing={2}
          direction={'column'}
          alignItems={'center'}
          sx={{ mt: 5, borderBottom: '2px solid #888', paddingBottom: 3 }}
        >
          <Stack direction={'row'} spacing={3} alignItems={'center'}>
            <Typography fontFamily={'Din-round'} variant="h4" sx={{ letterSpacing: '1px' }}>
              Exercise {index + 1}
            </Typography>
            <StyledIcon
              icon="mdi:delete"
              color="#252d63"
              fontSize={25}
              onClick={() => handleDeleteExercise(index)}
            />
          </Stack>
          <br />
          <Stack direction={'row'} spacing={2} width={'100%'}>
            <Stack direction={'column'} width={'100%'}>
              <TextField
                id={`exercise.${index}.questionArabic`}
                label="Exercise Arabic Title"
                variant="outlined"
                fullWidth
                error={!!errors.exercises?.[index]?.questionArabic}
                size="normal"
                {...register(`exercises.${index}.questionArabic`, {
                  required: 'This field is required',
                })}
              />
              {!!errors.exercises?.[index]?.questionArabic && (
                <FormErrorMessage>
                  {errors.exercises[index].questionArabic.message}
                </FormErrorMessage>
              )}
            </Stack>
            <Stack direction={'column'} width={'100%'}>
              <TextField
                id={`exercises.${index}.questionEnglish`}
                label="Exercise English Title"
                variant="outlined"
                fullWidth
                size="normal"
                error={!!errors.exercises?.[index]?.questionEnglish}
                {...register(`exercises.${index}.questionEnglish`, {
                  required: 'This field is required',
                })}
              />
              {!!errors.exercises?.[index]?.questionEnglish && (
                <FormErrorMessage>
                  {errors.exercises[index].questionEnglish.message}
                </FormErrorMessage>
              )}
            </Stack>
          </Stack>
          <Stack direction={'row'} spacing={2} width={'100%'}>
            <Stack direction={'column'} width={'100%'}>
              <TextField
                id={`exercises.${index}.questionType`}
                label="Question Type"
                variant="outlined"
                fullWidth
                select
                error={!!errors.exercises?.[index]?.questionType}
                disabled={exercise.correctAnswer.length > 0}
                defaultValue={'multipleChoice'}
                size="normal"
                {...register(`exercises.${index}.questionType`, {
                  required: 'This field is required',
                })}
              >
                <MenuItem value="multipleChoice">Multiple Choice</MenuItem>
                <MenuItem value="allThatApply">All That Apply</MenuItem>
              </TextField>
              {!!errors.exercises?.[index]?.questionType && (
                <FormErrorMessage>{errors.exercises[index].questionType.message}</FormErrorMessage>
              )}
            </Stack>
            <TextField
              id={`exercises.${index}.audioWord`}
              label="Audio Word (optional)"
              variant="outlined"
              fullWidth
              size="normal"
              {...register(`exercises.${index}.audioWord`)}
            />
          </Stack>
          <br />
          <Stack
            spacing={2}
            direction={'column'}
            alignItems={'center'}
            sx={{ mt: 4 }}
            width={'100%'}
          >
            <StyledTableContainer component={Paper}>
              <RadioGroup name={`isCorrect${index}`}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableHeadCell align="center">Option</StyledTableHeadCell>
                      <StyledTableHeadCell style={{ width: 135 }} align="center">
                        Mark Correct
                      </StyledTableHeadCell>
                      <StyledTableHeadCell style={{ width: 90 }} align="center">
                        Delete
                      </StyledTableHeadCell>
                    </TableRow>
                  </TableHead>
                  <MuiTableBody>
                    {exercises[index].options.map((option, optionIndex) => (
                      <StyledTableRow key={optionIndex}>
                        <StyledTableCell>
                          <TextField
                            id={`exercises.${index}.options.${optionIndex}`}
                            label={`Option ${optionIndex + 1}`}
                            variant="outlined"
                            fullWidth
                            error={!!errors.exercises?.[index]?.options?.[optionIndex]}
                            size="small"
                            {...register(`exercises.${index}.options.${optionIndex}`, {
                              required: 'This field is required',
                            })}
                          />
                          {!!errors.exercises?.[index]?.options?.[optionIndex] && (
                            <FormErrorMessage>
                              {errors.exercises[index].options[optionIndex].message}
                            </FormErrorMessage>
                          )}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {exercise.questionType === 'multipleChoice' ? (
                            <Radio
                              value={option}
                              disabled={exercise.options[optionIndex] === ''}
                              onClick={() => handleMarkCorrectRadio(index, option)}
                            />
                          ) : (
                            <Checkbox
                              value={option}
                              disabled={exercise.options[optionIndex] === ''}
                              onClick={() => handleMarkCorrectCheckbox(index, option)}
                              checked={exercise.correctAnswer.includes(option)}
                            />
                          )}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <StyledIcon
                            icon="mdi:delete"
                            color="#252d63"
                            width="25"
                            height="25"
                            onClick={() => handleDeleteOption(index, optionIndex)}
                          />
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </MuiTableBody>
                </Table>
              </RadioGroup>
              {errors.exercises?.[index]?.correctAnswer && (
                <>
                  <FormErrorMessage>
                    {errors.exercises[index].correctAnswer.message}
                  </FormErrorMessage>
                  <br />
                </>
              )}
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2, mb: 3 }}
                onClick={() => handleAddOption(index)}
              >
                Add Option
              </Button>
            </StyledTableContainer>
          </Stack>
        </Stack>
      ))}
      <Button sx={{ mt: 2 }} onClick={handleAddExercise}>
        ADD NEW EXERCISE
      </Button>
    </FormContainer>
  );
}

export default LessonExerciseForm;
