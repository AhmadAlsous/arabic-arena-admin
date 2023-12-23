import { Button, Container, Stack } from '@mui/material';
import { Link, useParams, useBlocker } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { replaceDashesWithSpaces } from 'src/utils/stringOperations';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import { quiz } from 'src/_mock/DummyQuiz';
import QuizInfoForm from './QuizInfoForm';
import LessonExerciseForm from '../lessons/LessonExerciseForm';
import BlockerModal from 'src/components/BlockerModal';
import { useEffect, useState } from 'react';

function QuizForm() {
  const [isUpdated, setIsUpdated] = useState(false);
  let quizTitle = useParams()?.quiz;
  const isNew = quizTitle === undefined;
  if (!isNew) quizTitle = replaceDashesWithSpaces(quizTitle);

  const dummyQuiz = isNew ? null : quiz;
  const savedForm = localStorage.getItem('form');

  let blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      currentLocation.pathname !== nextLocation.pathname && isUpdated,
    [isUpdated]
  );

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
    defaultValues: savedForm
      ? JSON.parse(savedForm)
      : isNew
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

  useEffect(() => {
    const subscription = watch(() => {
      setIsUpdated(true);
      localStorage.setItem('form', JSON.stringify(getValues()));
    });
    return () => subscription.unsubscribe();
  }, [watch, getValues]);

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

  const handleLeave = () => {
    blocker.proceed();
    localStorage.removeItem('form');
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
        <Stack direction="row" alignItems="center" justifyContent="flex-end">
          <Button variant="contained" color="primary" type="submit" onClick={handleClick}>
            {isNew ? 'Create Quiz' : 'Update Quiz'}
          </Button>
        </Stack>
      </form>
      {blocker.state === 'blocked' ? (
        <BlockerModal cancel={() => blocker.reset()} proceed={handleLeave} />
      ) : null}
    </Container>
  );
}

export default QuizForm;
