import { Button, Container, Stack } from '@mui/material';
import { Link, useParams, useBlocker, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { generateUUID, replaceDashesWithSpaces } from 'src/utils/stringOperations';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import QuizInfoForm from './QuizInfoForm';
import LessonExerciseForm from '../lessons/LessonExerciseForm';
import BlockerModal from 'src/components/BlockerModal';
import { useEffect, useState } from 'react';
import { addQuiz, fetchQuiz, updateQuiz } from 'src/services/quizServices';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Spinner from 'src/components/Spinner';

function QuizForm() {
  const [isUpdated, setIsUpdated] = useState(false);
  let quizTitle = useParams()?.quiz;
  const isNew = quizTitle === undefined;
  if (!isNew) quizTitle = replaceDashesWithSpaces(quizTitle);
  const navigate = useNavigate();

  const {
    data: fetchedQuiz,
    isLoading: isLoadingQuiz,
    error: errorFetchingQuiz,
    refetch: refetchQuiz,
  } = useQuery({
    queryKey: [quizTitle],
    queryFn: () => fetchQuiz(quizTitle),
    enabled: !isNew,
  });

  const quiz = isNew ? null : fetchedQuiz;
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
        : quiz,
  });

  useEffect(() => {
    if (!isNew && quiz && !savedForm) {
      for (const [key, value] of Object.entries(quiz)) {
        setValue(key, value);
      }
    }
  }, [quiz, setValue, isNew, savedForm]);

  useEffect(() => {
    const subscription = watch(() => {
      setIsUpdated(true);
      localStorage.setItem('form', JSON.stringify(getValues()));
    });
    return () => subscription.unsubscribe();
  }, [watch, getValues]);

  const saveQuiz = useMutation({
    mutationFn: addQuiz,
    onMutate: () => {
      toast.loading('Creating quiz...');
    },
    onSuccess: () => {
      toast.remove();
      toast.success('Quiz added successfully.');
      setIsUpdated(false);
      setTimeout(() => navigate('/quizzes'), 500);
    },
    onError: (error) => {
      toast.remove();
      toast.error(`Error creating quiz: ${error.message}`);
    },
  });
  const editQuiz = useMutation({
    mutationFn: updateQuiz,
    onMutate: () => {
      toast.loading('Updating quiz...');
    },
    onSuccess: () => {
      toast.remove();
      toast.success('Quiz updated successfully.');
      setIsUpdated(false);
      setTimeout(() => navigate('/quizzes'), 500);
    },
    onError: (error) => {
      toast.remove();
      toast.error(`Error updating quiz: ${error.message}`);
    },
  });

  if (errorFetchingQuiz) {
    toast.error(
      <Stack direction="row" sx={{ mr: '-15px' }}>
        <p>Error fetching quiz.</p>
        <Button
          sx={{
            textTransform: 'none',
            color: 'black',
            fontSize: '0.95rem',
          }}
          onClick={() => {
            refetchQuiz();
            toast.remove();
          }}
        >
          Try again?
        </Button>
      </Stack>
    );
    return;
  }

  const onSubmit = (data) => {
    if (isNew) data.id = generateUUID();
    if (isNew) saveQuiz.mutate(data);
    else editQuiz.mutate(data);
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
      {isLoadingQuiz && (
        <Stack sx={{ mt: 20, mr: 5 }}>
          <Spinner />
        </Stack>
      )}
      {!isLoadingQuiz && fetchedQuiz && (
        <>
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
              lesson={quiz}
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
        </>
      )}
    </Container>
  );
}

export default QuizForm;
