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
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [quizIsLoading, setQuizIsLoading] = useState(false);
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

  const {
    register,
    handleSubmit,
    control,
    watch,
    getValues,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: savedForm
      ? JSON.parse(savedForm)
      : {
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
        },
  });

  let blocker = useBlocker(
    ({ currentLocation, nextLocation }) => {
      return currentLocation.pathname !== nextLocation.pathname && isDirty && !formSubmitted;
    },
    [isDirty, formSubmitted]
  );

  useEffect(() => {
    if (!isNew && quiz && !savedForm) {
      for (const [key, value] of Object.entries(quiz)) {
        setValue(key, value);
      }
    }
  }, [quiz, setValue, isNew, savedForm]);

  useEffect(() => {
    const subscription = watch(() => {
      localStorage.setItem('form', JSON.stringify(getValues()));
    });
    return () => subscription.unsubscribe();
  }, [watch, getValues]);

  const saveQuiz = useMutation({
    mutationFn: addQuiz,
    onMutate: () => {
      setQuizIsLoading(true);
      toast.loading('Creating quiz...');
    },
    onSuccess: () => {
      setQuizIsLoading(false);
      setFormSubmitted(true);
      toast.remove();
      toast.success('Quiz added successfully.', {
        duration: 5000,
      });
      setTimeout(() => navigate('/quizzes'), 500);
    },
    onError: (error) => {
      setQuizIsLoading(false);
      toast.remove();
      toast.error(`Error creating quiz: ${error.message}`, { duration: 5000 });
    },
  });
  const editQuiz = useMutation({
    mutationFn: updateQuiz,
    onMutate: () => {
      setQuizIsLoading(true);
      toast.loading('Updating quiz...');
    },
    onSuccess: () => {
      setQuizIsLoading(false);
      setFormSubmitted(true);
      toast.remove();
      toast.success('Quiz updated successfully.', {
        duration: 5000,
      });
      setTimeout(() => navigate('/quizzes'), 500);
    },
    onError: (error) => {
      setQuizIsLoading(false);
      toast.remove();
      toast.error(`Error updating quiz: ${error.message}`, { duration: 5000 });
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
      </Stack>,
      { duration: 5000 }
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
      {!isLoadingQuiz && (
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
              control={control}
              isQuiz={true}
            />
            <Stack direction="row" alignItems="center" justifyContent="flex-end">
              <Button
                variant="contained"
                color="primary"
                type="submit"
                onClick={handleClick}
                disabled={quizIsLoading || !isDirty}
              >
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
