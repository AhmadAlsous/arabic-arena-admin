import { Button, Container, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useForm } from 'react-hook-form';
import { quiz } from 'src/_mock/DummyQuiz';
import LessonExerciseForm from '../lessons/LessonExerciseForm';
import PlacementInfoForm from './PlacementInfoForm';

function PlacementTestForm() {
  const dummyQuiz = quiz;

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
    defaultValues: {
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
        <Stack direction="row" alignItems="center" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" color="primary" type="reset">
            Cancel
          </Button>
          <Button variant="contained" color="primary" type="submit" onClick={handleClick}>
            Update Test
          </Button>
        </Stack>
      </form>
    </Container>
  );
}

export default PlacementTestForm;
