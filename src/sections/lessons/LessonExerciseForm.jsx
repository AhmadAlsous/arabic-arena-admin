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
  FormControl,
  InputLabel,
  Select,
  Tooltip,
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
import FormErrorMessage from 'src/components/FormErrorMessage';
import { Controller } from 'react-hook-form';
import Modal from 'src/components/Modal';

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

const DeleteIcon = styled(Icon)`
  cursor: pointer;
  position: absolute;
  top: 4px;
`;

function LessonExerciseForm({
  register,
  errors,
  setValue,
  watch,
  lesson,
  control,
  getValues,
  isQuiz = false,
}) {
  const isNew = lesson === null;
  const exercises = watch(isQuiz ? 'questions' : 'exercises');
  const exerciseSwitchValue = isQuiz ? true : watch('hasExercises');

  const handleAddExercise = () => {
    setValue(isQuiz ? 'questions' : 'exercises', [
      ...exercises,
      {
        questionArabic: '',
        questionEnglish: '',
        questionType: 'multipleChoice',
        audioWord: '',
        options: ['', ''],
        correctAnswer: [],
      },
    ]);
  };

  const handleDeleteExercise = (index) => {
    if (exercises.length === 1) {
      setValue(`${isQuiz ? 'questions' : 'exercises'}.${index}.questionArabic`, '');
      setValue(`${isQuiz ? 'questions' : 'exercises'}.${index}.questionEnglish`, '');
      setValue(`${isQuiz ? 'questions' : 'exercises'}.${index}.questionType`, 'multipleChoice');
      setValue(`${isQuiz ? 'questions' : 'exercises'}.${index}.audioWord`, '');
      setValue(`${isQuiz ? 'questions' : 'exercises'}.${index}.options`, ['', '']);
      setValue(`${isQuiz ? 'questions' : 'exercises'}.${index}.correctAnswer`, []);
      return;
    }
    setValue(
      isQuiz ? 'questions' : 'exercises',
      exercises.filter((exercise) => exercise !== exercises[index])
    );
  };

  const handleAddOption = (index) => {
    const length = exercises[index].options.length;
    setValue(`${isQuiz ? 'questions' : 'exercises'}.${index}.options.${length}`, '');
  };

  const handleDeleteOption = (index, optionIndex) => {
    if (exercises[index].correctAnswer.includes(exercises[index].options[optionIndex])) {
      setValue(
        `${isQuiz ? 'questions' : 'exercises'}.${index}.correctAnswer`,
        exercises[index].correctAnswer.filter(
          (answer) => answer !== exercises[index].options[optionIndex]
        )
      );
    }
    if (exercises[index].options.length === 1) {
      setValue(`${isQuiz ? 'questions' : 'exercises'}.${index}.options.${optionIndex}`, '');
      return;
    }
    setValue(
      `${isQuiz ? 'questions' : 'exercises'}.${index}.options`,
      exercises[index].options.filter((option, i) => i !== optionIndex)
    );
  };

  const handleMarkCorrectRadio = (index, option) => {
    setValue(`${isQuiz ? 'questions' : 'exercises'}.${index}.correctAnswer`, [option]);
  };

  const handleMarkCorrectCheckbox = (index, option) => {
    const correctAnswer = exercises[index].correctAnswer;
    if (correctAnswer.includes(option)) {
      setValue(
        `${isQuiz ? 'questions' : 'exercises'}.${index}.correctAnswer`,
        correctAnswer.filter((answer) => answer !== option)
      );
    } else {
      setValue(`${isQuiz ? 'questions' : 'exercises'}.${index}.correctAnswer`, [
        ...correctAnswer,
        option,
      ]);
    }
  };

  return (
    <FormContainer title={isQuiz ? 'Questions' : 'Exercises'}>
      {!isQuiz && (
        <InfoIconContainer>
          <FormControlLabel
            id="hasExercises"
            control={
              <Switch
                {...register('hasExercises')}
                defaultChecked={isNew ? false : getValues('hasExercises')}
              />
            }
            label="Add Exercises &nbsp;"
            labelPlacement="start"
          />
          <BigInfoIcon>
            <StyledTooltip
              title="Make sure to add exercises to help calculate the student's progress. Each exercise can be either multiple choice (one answer) or all that apply (multiple answers). You can only change the question type if no correct answers have been marked."
              arrow
            >
              <Icon id="imageLink" icon="material-symbols:info-outline" />
            </StyledTooltip>
          </BigInfoIcon>
        </InfoIconContainer>
      )}
      {exerciseSwitchValue &&
        exercises.map((exercise, index) => (
          <Stack
            key={index}
            spacing={2}
            direction={'column'}
            alignItems={'center'}
            sx={{ mt: 5, borderBottom: '2px solid #888', paddingBottom: 3 }}
          >
            <Stack direction={'row'} spacing={3} alignItems={'center'} position={'relative'}>
              <Typography fontFamily={'Din-round'} variant="h4" sx={{ letterSpacing: '1px' }}>
                {isQuiz ? 'Question' : 'Exercise'} {index + 1}
              </Typography>
              <Modal
                btn="Delete"
                onSubmit={() => handleDeleteExercise(index)}
                trigger={<DeleteIcon icon="mdi:delete" color="#252d63" fontSize={30} />}
              >
                <Typography
                  fontFamily={'Din-round'}
                  variant="h5"
                  sx={{ mt: 1 }}
                  textAlign={'center'}
                >
                  Confirmation
                </Typography>
                <Stack spacing={2} textAlign={'center'} paddingY={3}>
                  <Typography fontFamily={'Din-round'} variant="body1">
                    Are you sure you want to delete this {isQuiz ? 'question' : 'exercise'}?
                  </Typography>
                  <Typography fontFamily={'Din-round'} variant="body1">
                    This action cannot be undone.
                  </Typography>
                </Stack>
              </Modal>
            </Stack>
            <br />
            <Stack direction={'row'} spacing={2} width={'100%'}>
              <Stack direction={'column'} width={'100%'}>
                <TextField
                  id={`${isQuiz ? 'questions' : 'exercises'}.${index}.questionArabic`}
                  label={`${isQuiz ? 'Question' : 'Exercise'} Arabic Title`}
                  variant="outlined"
                  fullWidth
                  error={!!errors.exercises?.[index]?.questionArabic}
                  size="normal"
                  {...register(`${isQuiz ? 'questions' : 'exercises'}.${index}.questionArabic`, {
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
                  id={`${isQuiz ? 'questions' : 'exercises'}.${index}.questionEnglish`}
                  label={`${isQuiz ? 'Question' : 'Exercise'} English Title`}
                  variant="outlined"
                  fullWidth
                  size="normal"
                  error={!!errors.exercises?.[index]?.questionEnglish}
                  {...register(`${isQuiz ? 'questions' : 'exercises'}.${index}.questionEnglish`, {
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
                <FormControl fullWidth variant="outlined">
                  <InputLabel id={`questionType-label-${index}`}>Question Type</InputLabel>
                  <Controller
                    name={`${isQuiz ? 'questions' : 'exercises'}.${index}.questionType`}
                    control={control}
                    rules={{ required: 'This field is required' }}
                    render={({ field }) => (
                      <Select
                        labelId={`questionType-label-${index}`}
                        label="Question Type"
                        disabled={exercise.correctAnswer.length > 0}
                        {...field}
                      >
                        <MenuItem value="multipleChoice">Multiple Choice</MenuItem>
                        <MenuItem value="allThatApply">All That Apply</MenuItem>
                      </Select>
                    )}
                  />
                </FormControl>
                {!!errors.exercises?.[index]?.questionType && (
                  <FormErrorMessage>
                    {errors.exercises[index].questionType.message}
                  </FormErrorMessage>
                )}
              </Stack>
              <InfoIconContainer>
                <TextField
                  id={`${isQuiz ? 'questions' : 'exercises'}.${index}.audioWord`}
                  label="Audio Word (optional)"
                  variant="outlined"
                  fullWidth
                  size="normal"
                  {...register(`${isQuiz ? 'questions' : 'exercises'}.${index}.audioWord`)}
                />
                <InfoIcon>
                  <StyledTooltip
                    title={`Add an Arabic audio word to the ${
                      isQuiz ? 'question' : 'exercise'
                    }. The sound will be played when the student clicks on the audio icon in the ${
                      isQuiz ? 'question' : 'exercise'
                    }.`}
                    arrow
                  >
                    <Icon id="imageLink" icon="material-symbols:info-outline" />
                  </StyledTooltip>
                </InfoIcon>
              </InfoIconContainer>
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
                              id={`${
                                isQuiz ? 'questions' : 'exercises'
                              }.${index}.options.${optionIndex}`}
                              label={`Option ${optionIndex + 1}`}
                              variant="outlined"
                              fullWidth
                              error={!!errors.exercises?.[index]?.options?.[optionIndex]}
                              size="small"
                              {...register(
                                `${
                                  isQuiz ? 'questions' : 'exercises'
                                }.${index}.options.${optionIndex}`,
                                {
                                  required: 'This field is required',
                                }
                              )}
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
                                checked={exercise.correctAnswer.includes(option)}
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
      {exerciseSwitchValue && (
        <Button sx={{ mt: 2 }} onClick={handleAddExercise}>
          ADD NEW {isQuiz ? 'QUESTION' : 'EXERCISE'}
        </Button>
      )}
    </FormContainer>
  );
}

export default LessonExerciseForm;
