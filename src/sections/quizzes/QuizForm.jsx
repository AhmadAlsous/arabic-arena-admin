import { Button, Container, Stack } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { replaceDashesWithSpaces } from 'src/utils/stringOperations';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import { quiz } from 'src/_mock/DummyQuiz';
import QuizInfoForm from './QuizInfoForm';
import LessonExerciseForm from '../lessons/LessonExerciseForm';

function QuizForm() {
  let quizTitle = useParams()?.quiz;
  const isNew = quizTitle === undefined;
  if (!isNew) quizTitle = replaceDashesWithSpaces(quizTitle);
  console.log(isNew, quizTitle);

  const dummyQuiz = isNew ? null : quiz;

  const {
    register,
    handleSubmit,
    control,
    watch,
    getValues,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: isNew
      ? {
          titleArabic: '',
          titleEnglish: '',
          level: '',
          type: '',
          time: '',
          questions: [
            {
              questionArabic: '',
              questionEnglish: '',
              questionType: 'multipleChoice',
              audioWord: '',
              options: ['', ''],
              correctAnswer: [],
            },
          ],
        }
      : dummyQuiz,
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  const handleClick = () => {
    const questions = getValues('questions');
    questions.forEach((exercise, index) => {
      if (exercise.correctAnswer.length === 0) {
        setError(`questions.${index}.correctAnswer`, {
          type: 'required',
          message: 'Please select at least one correct answer',
        });
      } else {
        clearErrors(`questions.${index}.correctAnswer`);
      }
    });
  };

  return (
    <Container>
      <Stack
        direction="row"
        alignItems="center"
        flexWrap="wrap-reverse"
        justifyContent="space-between"
        sx={{ mb: 5, mt: 2 }}
      >
        <Typography fontFamily={'Din-round'} variant="h4" sx={{ letterSpacing: '1.5px' }}>
          {isNew ? 'Create New Quiz' : quizTitle}
        </Typography>
        <Link to="/quizzes">
          <Button>
            <Icon fontSize={26} icon="material-symbols:keyboard-arrow-left" />
            Back To Quizzes
          </Button>
        </Link>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <QuizInfoForm register={register} errors={errors} control={control} />
        <LessonExerciseForm
          register={register}
          errors={errors}
          setValue={setValue}
          watch={watch}
          lesson={dummyQuiz}
          control={control}
          isQuiz={true}
        />
        <Stack direction="row" alignItems="center" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" color="primary" type="reset">
            Cancel
          </Button>
          <Button variant="contained" color="primary" type="submit" onClick={handleClick}>
            Create Quiz
          </Button>
        </Stack>
      </form>
    </Container>
  );
}

export default QuizForm;
