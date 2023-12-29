import { Button, Container, Stack } from '@mui/material';
import { Link, useParams, useBlocker } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { generateUUID, replaceDashesWithSpaces } from 'src/utils/stringOperations';
import { Icon } from '@iconify/react';
import LessonInfoForm from './LessonInfoForm';
import { useForm } from 'react-hook-form';
import LessonVideoForm from './LessonVideoForm';
import LessonTextForm from './LessonTextForm';
import LessonTableForm from './LessonTableForm';
import LessonExerciseForm from './LessonExerciseForm';
import { languages } from 'src/config/languages';
import { translateText } from 'src/services/translateText';
import { useEffect, useState } from 'react';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { convertToRaw, ContentState } from 'draft-js';
import BlockerModal from 'src/components/BlockerModal';
import { useMutation, useQuery } from '@tanstack/react-query';
import { addWord, fetchWord } from 'src/services/wordServices';
import { addLesson, fetchLesson } from 'src/services/lessonServices';
import Spinner from 'src/components/Spinner';
import toast from 'react-hot-toast';

function LessonForm() {
  const [isUpdated, setIsUpdated] = useState(false);
  let lessonTitle = useParams()?.lesson;
  const isNew = lessonTitle === undefined;
  if (!isNew) lessonTitle = replaceDashesWithSpaces(lessonTitle);

  const {
    data: fetchedLesson,
    isLoading: isLoadingLesson,
    error: errorFetchingLesson,
    refetch: refetchLesson,
  } = useQuery({
    queryKey: [lessonTitle],
    queryFn: () => fetchLesson(lessonTitle),
    enabled: !isNew,
  });
  console.log(fetchedLesson);
  const lesson = isNew ? null : fetchedLesson;
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
        },
  });

  useEffect(() => {
    if (!isNew && lesson && !savedForm) {
      const lessonData = {
        ...lesson,
        text: convertToRaw(
          ContentState.createFromBlockArray(htmlToDraft(lesson.text).contentBlocks)
        ),
        videoText: convertToRaw(
          ContentState.createFromBlockArray(htmlToDraft(lesson.videoText).contentBlocks)
        ),
      };
      for (const [key, value] of Object.entries(lessonData)) {
        setValue(key, value);
      }
    }
  }, [lesson, setValue, isNew, savedForm]);

  useEffect(() => {
    const subscription = watch(() => {
      setIsUpdated(true);
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

  const {
    mutate: saveWord,
    isLoading: isSavingWord,
    error: errorSavingWord,
  } = useMutation({
    mutationFn: addWord,
  });
  const {
    mutate: saveLesson,
    isLoading: isSavingLesson,
    error: errorSavingLesson,
  } = useMutation({
    mutationFn: addLesson,
  });

  if (errorFetchingLesson) {
    toast.error('Error fetching lesson. Please try again.');
    return (
      <Stack
        sx={{
          height: '100vh',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Button onClick={() => refetchLesson()} sx={{ width: 'auto' }}>
          TRY AGAIN
        </Button>
      </Stack>
    );
  }

  const onSubmit = async (data) => {
    let save = true;
    data.id = generateUUID();
    if (typeof data.text !== 'string') data.text = toHtml(data.text);
    if (typeof data.videoText !== 'string') data.videoText = toHtml(data.videoText);

    if (data.hasTable) {
      const arabicWords = data.table.map((word) => word.arabicWord);
      const fetchWordPromises = arabicWords.map(async (word) => {
        try {
          await fetchWord(word);
        } catch (error) {
          if (error.message.startsWith('NotFoundError')) {
            const translations = { id: word };
            const translationPromises = languages.map(async (language) => {
              translations[language.language] = await translateText(word, language.code);
            });
            await Promise.all(translationPromises);
            saveWord(translations);
            if (errorSavingWord) save = false;
          } else {
            save = false;
          }
        }
      });
      await Promise.all(fetchWordPromises);
    }
    if (save) {
      saveLesson(data);
    }
    if (!save || errorSavingLesson) {
      toast.error('Error saving lesson. Please try again.');
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

  const handleLeave = () => {
    blocker.proceed();
    localStorage.removeItem('form');
  };

  return (
    <Container>
      {isLoadingLesson && (
        <Stack sx={{ mt: 20, mr: 5 }}>
          <Spinner />
        </Stack>
      )}
      {!isLoadingLesson && (
        <>
          <Stack
            direction="row"
            alignItems="center"
            flexWrap="wrap-reverse"
            justifyContent="space-between"
            sx={{ mb: 5, mt: 2 }}
          >
            <Typography fontFamily={'Din-round'} variant="h4" sx={{ letterSpacing: '1.5px' }}>
              {isNew
                ? 'Create New Lesson'
                : lesson?.titleEnglish
                  ? lesson.titleEnglish
                  : lessonTitle}
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
              getValues={getValues}
              control={control}
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
            <Stack direction="row" alignItems="center" justifyContent="flex-end">
              <Button variant="contained" color="primary" type="submit" onClick={handleClick}>
                {isNew ? 'Create Lesson' : 'Update Lesson'}
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

export default LessonForm;
