import { Button, Container, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useForm } from 'react-hook-form';
import { quiz } from 'src/_mock/DummyQuiz';
import LessonExerciseForm from '../lessons/LessonExerciseForm';
import PlacementInfoForm from './PlacementInfoForm';
import { useBlocker } from 'react-router-dom';
import { useEffect, useState } from 'react';
import BlockerModal from 'src/components/BlockerModal';

function PlacementTestForm() {
  const [isUpdated, setIsUpdated] = useState(false);
  const dummyQuiz = quiz;
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
      : {
          intermediate: '',
          advanced: '',
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
        },
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
          Placement Test
        </Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <PlacementInfoForm register={register} errors={errors} />
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
            Update Test
          </Button>
        </Stack>
      </form>
      {blocker.state === 'blocked' ? (
        <BlockerModal cancel={() => blocker.reset()} proceed={handleLeave} />
      ) : null}
    </Container>
  );
}

export default PlacementTestForm;
