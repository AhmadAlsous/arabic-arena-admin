import { Button, Container, Stack } from '@mui/material';
import { Link, useParams, useLocation } from 'react-router-dom';
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
import { languages } from 'src/config/languages';
import { translateText } from 'src/services/translateText';
import { useEffect } from 'react';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { convertToRaw, ContentState } from 'draft-js';
import BlockerModal from 'src/components/BlockerModal';

function LessonForm() {
  let lessonTitle = useParams()?.lesson;
  const isNew = lessonTitle === undefined;
  if (!isNew) lessonTitle = replaceDashesWithSpaces(lessonTitle);

  const lesson = isNew ? null : greenTeaLesson;
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
      : {
          ...lesson,
          text: convertToRaw(
            ContentState.createFromBlockArray(htmlToDraft(lesson.text).contentBlocks)
          ),
          videoText: convertToRaw(
            ContentState.createFromBlockArray(htmlToDraft(lesson.videoText).contentBlocks)
          ),
        },
  });

  useEffect(() => {
    const subscription = watch(() => {
      localStorage.setItem('form', JSON.stringify(getValues()));
    });
    return () => subscription.unsubscribe();
  }, [watch, getValues]);

  const toHtml = (editorState) => {
    let html = draftToHtml(editorState);

    const arabicRegex = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const applyAlignmentToParent = (el) => {
      while (el.parentNode && el.parentNode !== doc.body) {
        el = el.parentNode;
        if (el.nodeType === Node.ELEMENT_NODE) {
          el.style.textAlign = 'right';
          el.style.direction = 'rtl';
        }
      }
    };

    doc.body.querySelectorAll('*').forEach((el) => {
      if (el.nodeType === Node.TEXT_NODE && arabicRegex.test(el.textContent)) {
        applyAlignmentToParent(el);
      } else if (el.nodeType === Node.ELEMENT_NODE && arabicRegex.test(el.textContent)) {
        el.style.textAlign = 'right';
        el.style.direction = 'rtl';
      }
    });

    const divs = doc.body.querySelectorAll('div');
    divs.forEach((div) => {
      const hasImage = div.querySelector('img') !== null;
      const textAlignStyle = div.style.textAlign;
      if (hasImage && textAlignStyle === 'none') {
        div.style.textAlign = 'center';
      }
    });

    const images = doc.body.querySelectorAll('img');
    images.forEach((img) => {
      if (img.parentNode.tagName !== 'DIV') {
        const div = doc.createElement('div');
        div.style.textAlign = 'center';
        img.parentNode.insertBefore(div, img);
        div.appendChild(img);
      }
    });

    return doc.body.innerHTML;
  };

  const onSubmit = async (data) => {
    if (typeof data.text !== 'string') data.text = toHtml(data.text);
    if (typeof data.videoText !== 'string') data.videoText = toHtml(data.videoText);

    if (data.hasTable) {
      const arabicWords = data.table.map((word) => word.arabicWord);
      for (const word of arabicWords) {
        const translations = { arabic: word };
        const translationPromises = languages.map(async (language) => {
          translations[language.language] = await translateText(word, language.code);
        });
        await Promise.all(translationPromises);
        console.log(translations);
      }
    }
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

  // const handleLeave = () => {
  //   localStorage.removeItem('form');
  //   blocker.proceed();
  // };

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
          getValues={getValues}
        />
        <LessonTextForm setValue={setValue} text={getValues('text')} />
        <LessonTableForm
          register={register}
          errors={errors}
          clearErrors={clearErrors}
          setValue={setValue}
          watch={watch}
          lesson={lesson}
          getValues={getValues}
        />
        <LessonExerciseForm
          register={register}
          errors={errors}
          setValue={setValue}
          watch={watch}
          lesson={lesson}
          control={control}
          getValues={getValues}
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
