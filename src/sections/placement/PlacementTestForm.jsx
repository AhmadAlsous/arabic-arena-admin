import { Button, Container, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useForm } from 'react-hook-form';
import LessonExerciseForm from '../lessons/LessonExerciseForm';
import PlacementInfoForm from './PlacementInfoForm';
import { useBlocker } from 'react-router-dom';
import { useEffect, useState } from 'react';
import BlockerModal from 'src/components/BlockerModal';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchPlacementTest, updatePlacementTest } from 'src/services/placementServices';
import toast from 'react-hot-toast';
import Spinner from 'src/components/Spinner';
import SpinnerMini from 'src/components/SpinnerMini';

function PlacementTestForm() {
  const [isUpdated, setIsUpdated] = useState(false);
  const [testIsLoading, setTestIsLoading] = useState(false);
  const {
    data: test,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['placementTest'],
    queryFn: fetchPlacementTest,
  });
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
    if (test && !savedForm) {
      for (const [key, value] of Object.entries(test)) {
        setValue(key, value);
      }
    }
  }, [test, setValue, savedForm]);

  useEffect(() => {
    const subscription = watch(() => {
      setIsUpdated(true);
      localStorage.setItem('form', JSON.stringify(getValues()));
    });
    return () => subscription.unsubscribe();
  }, [watch, getValues]);

  const editTest = useMutation({
    mutationFn: updatePlacementTest,
    onMutate: () => {
      setTestIsLoading(true);
      toast.loading('Updating placement test...');
    },
    onSuccess: () => {
      setTestIsLoading(false);
      toast.remove();
      toast.success('Placement Test updated successfully.', {
        duration: 5000,
      });
      setIsUpdated(false);
    },
    onError: (error) => {
      setTestIsLoading(false);
      toast.remove();
      toast.error(`Error updating placement test: ${error.message}`, { duration: 5000 });
    },
  });

  if (error) {
    toast.error(
      <Stack direction="row" sx={{ mr: '-15px' }}>
        <p>Error fetching placement test.</p>
        <Button
          sx={{
            textTransform: 'none',
            color: 'black',
            fontSize: '0.95rem',
          }}
          onClick={() => {
            refetch();
            toast.remove();
          }}
        >
          Try again?
        </Button>
      </Stack>,
      { duration: 5000 }
    );
    return;
  }

  const onSubmit = (data) => {
    data.id = '1';
    editTest.mutate(data);
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
      {isLoading && (
        <Stack sx={{ mt: 20, mr: 5 }}>
          <Spinner />
        </Stack>
      )}
      {!isLoading && (
        <>
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
              control={control}
              isQuiz={true}
            />
            <Stack direction="row" alignItems="center" justifyContent="flex-end">
              <Button
                variant="contained"
                color="primary"
                type="submit"
                onClick={handleClick}
                disabled={testIsLoading}
              >
                {testIsLoading ? <SpinnerMini /> : 'Update Test'}
              </Button>
            </Stack>
          </form>
          {blocker.state === 'blocked' ? (
            <BlockerModal cancel={() => blocker.reset()} proceed={handleLeave} />
          ) : null}
        </>
      )}
    </Container>
  );
}

export default PlacementTestForm;
