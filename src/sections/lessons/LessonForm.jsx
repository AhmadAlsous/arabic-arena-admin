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
import { useState } from 'react';
import LessonExerciseForm from './LessonExerciseForm';

function LessonForm() {
  let lessonTitle = useParams()?.lesson;
  const isNew = lessonTitle === undefined;
  if (!isNew) lessonTitle = replaceDashesWithSpaces(lessonTitle);

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
      titleArabic: 'a',
      titleEnglish: 'a',
      level: 'Beginner',
      type: 'Grammar',
      video: false,
      videoLink: '',
      videoText: '',
      text: '',
      hasTable: false,
      table: [],
      hasExercises: false,
      exercises: [
        {
          questionArabic: 'a',
          questionEnglish: 'a',
          questionType: 'multipleChoice',
          audioWord: '',
          options: ['', ''],
          correctAnswer: [],
        },
      ],
    },
  });

  const [words, setWords] = useState([{ arabicWord: '', transcription: '' }]);

  const onSubmit = (data) => {
    console.log(data);
  };

  const handleClick = () => {
    let hasErrorTable = false,
      hasErrorExercises = false;
    const exercises = getValues('exercises');
    exercises.forEach((exercise, index) => {
      if (exercise.correctAnswer.length === 0) {
        setError(`exercises.${index}.correctAnswer`, {
          type: 'required',
          message: 'Please select at least one correct answer',
        });
        hasErrorExercises = true;
      } else {
        clearErrors(`exercises.${index}.correctAnswer`);
      }
    });

    if (!watch('hasTable')) return;
    words.forEach((word, index) => {
      if (word.arabicWord === '') {
        setError(`table.${index}.arabicWord`, {
          type: 'required',
          message: 'This field is required',
        });
        hasErrorTable = true;
      } else {
        clearErrors(`table.${index}.arabicWord`);
      }
      if (word.transcription === '') {
        setError(`table.${index}.transcription`, {
          type: 'required',
          message: 'This field is required',
        });
        hasErrorTable = true;
      } else {
        clearErrors(`table.${index}.transcription`);
      }
    });
    if (!hasErrorTable) setValue('table', words);
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
        <LessonVideoForm register={register} errors={errors} setValue={setValue} watch={watch} />
        <LessonTextForm setValue={setValue} />
        <LessonTableForm
          words={words}
          setWords={setWords}
          register={register}
          errors={errors}
          clearErrors={clearErrors}
          setValue={setValue}
          watch={watch}
        />
        <LessonExerciseForm register={register} errors={errors} setValue={setValue} watch={watch} />
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
