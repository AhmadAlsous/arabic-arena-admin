import { Button, Container, Stack } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { replaceDashesWithSpaces } from 'src/utils/stringOperations';
import { Icon } from '@iconify/react';
import LessonInfoForm from './LessonInfoForm';
import { useForm } from 'react-hook-form';
import LessonVideoForm from './LessonVideoForm';
import LessonTextForm from './LessonTextForm';
import LessonTableForm from './LessonTableForm';
import LessonExerciseForm from './LessonExerciseForm';
import { greenTeaLesson } from 'src/_mock/GreenTea';

function LessonForm() {
  let lessonTitle = useParams()?.lesson;
  const isNew = lessonTitle === undefined;
  if (!isNew) lessonTitle = replaceDashesWithSpaces(lessonTitle);

  const lesson = isNew ? null : greenTeaLesson;

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
          video: false,
          videoLink: '',
          videoText: '',
          text: '',
          hasTable: false,
          table: [
            {
              arabicWord: '',
              transcription: '',
            },
          ],
          hasExercises: false,
          exercises: [
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
      : lesson,
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  const handleClick = () => {
    if (watch('hasExercises')) {
      const exercises = getValues('exercises');
      exercises.forEach((exercise, index) => {
        if (exercise.correctAnswer.length === 0) {
          setError(`exercises.${index}.correctAnswer`, {
            type: 'required',
            message: 'Please select at least one correct answer',
          });
        } else {
          clearErrors(`exercises.${index}.correctAnswer`);
        }
      });
    } else {
      clearErrors(`exercises`);
    }

    if (watch('hasTable')) {
      const table = getValues('table');
      table.forEach((word, index) => {
        if (word.arabicWord === '' || word.transcription === '') {
          if (word.arabicWord === '')
            setError(`table.${index}.arabicWord`, {
              type: 'required',
              message: 'Please fill in the missing fields',
            });
          if (word.transcription === '')
            setError(`table.${index}.transcription`, {
              type: 'required',
              message: 'Please fill in the missing fields',
            });
        } else {
          clearErrors(`table.${index}.arabicWord`);
          clearErrors(`table.${index}.transcription`);
        }
      });
    } else {
      clearErrors(`table`);
    }

    if (!watch('video')) {
      clearErrors('videoLink');
    }
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
          {isNew ? 'Create New Lesson' : lessonTitle}
        </Typography>
        <Link to="/lessons">
          <Button>
            <Icon fontSize={26} icon="material-symbols:keyboard-arrow-left" />
            Back To Lessons
          </Button>
        </Link>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <LessonInfoForm register={register} errors={errors} control={control} />
        <LessonVideoForm
          register={register}
          errors={errors}
          setValue={setValue}
          watch={watch}
          lesson={lesson}
        />
        <LessonTextForm setValue={setValue} lesson={lesson} />
        <LessonTableForm
          register={register}
          errors={errors}
          clearErrors={clearErrors}
          setValue={setValue}
          watch={watch}
          lesson={lesson}
        />
        <LessonExerciseForm
          register={register}
          errors={errors}
          setValue={setValue}
          watch={watch}
          lesson={lesson}
          control={control}
        />
        <Stack direction="row" alignItems="center" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" color="primary" type="reset">
            Cancel
          </Button>
          <Button variant="contained" color="primary" type="submit" onClick={handleClick}>
            Create Lesson
          </Button>
        </Stack>
      </form>
    </Container>
  );
}

export default LessonForm;
