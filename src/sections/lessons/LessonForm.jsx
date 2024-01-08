import { Button, Container, Stack } from '@mui/material';
import { Link, useParams, useBlocker, useNavigate } from 'react-router-dom';
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
import { addLesson, fetchLesson, updateLesson } from 'src/services/lessonServices';
import Spinner from 'src/components/Spinner';
import toast from 'react-hot-toast';
import { replaceSpacesWithDashes } from 'src/utils/stringOperations';

function LessonForm() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [lessonIsLoading, setLessonIsLoading] = useState(false);
  let lessonTitle = useParams()?.lesson;
  const isNew = lessonTitle === undefined;
  if (!isNew) lessonTitle = replaceDashesWithSpaces(lessonTitle);
  const navigate = useNavigate();

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
  const lesson = isNew ? null : fetchedLesson;
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

  let blocker = useBlocker(
    ({ currentLocation, nextLocation }) => {
      return currentLocation.pathname !== nextLocation.pathname && isDirty && !formSubmitted;
    },
    [isDirty, formSubmitted]
  );

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

    const applyEnglishAlignmentToParent = (el) => {
      while (el.parentNode && el.parentNode !== doc.body) {
        el = el.parentNode;
        if (el.nodeType === Node.ELEMENT_NODE) {
          el.style.textAlign = 'left';
          el.style.direction = 'ltr';
        }
      }
    };

    doc.body.querySelectorAll('*').forEach((el) => {
      if (el.nodeType === Node.TEXT_NODE && !arabicRegex.test(el.textContent)) {
        applyEnglishAlignmentToParent(el);
      } else if (el.nodeType === Node.ELEMENT_NODE && !arabicRegex.test(el.textContent)) {
        el.style.textAlign = 'left';
        el.style.direction = 'ltr';
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

  const saveWord = useMutation({
    mutationFn: addWord,
    onMutate: () => {
      setLessonIsLoading(true);
      toast.loading('Saving Words...');
    },
    onError: (error) => {
      setLessonIsLoading(false);
      toast.remove();
      toast.error(`Error saving words: ${error.message}`, { duration: 5000 });
    },
  });
  const lessonLink = `https://arabicarena.netlify.app/learn/${replaceSpacesWithDashes(
    getValues('titleEnglish').toLowerCase()
  )}`;
  const saveLesson = useMutation({
    mutationFn: addLesson,
    onMutate: () => {
      setLessonIsLoading(true);
      toast.loading('Creating lesson...');
    },
    onSuccess: () => {
      setFormSubmitted(true);
      setLessonIsLoading(false);
      toast.remove();
      toast.success('Lesson added successfully.', { duration: 5000 });
      toast.custom(
        (t) => (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              color: 'white',
              borderRadius: '8px',
            }}
            onClick={() => toast.dismiss(t.id)}
          >
            <a
              href={lessonLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'black', textDecoration: 'none' }}
            >
              Click here to view the new lesson
            </a>
          </div>
        ),
        {
          duration: 5000,
          onClick: () => window.open(lessonLink, '_blank'),
        }
      );
      setTimeout(() => navigate('/lessons'), 500);
    },
    onError: (error) => {
      setLessonIsLoading(false);
      toast.remove();
      toast.error(`Error creating lesson: ${error.message}`, { duration: 5000 });
    },
  });
  const editLesson = useMutation({
    mutationFn: updateLesson,
    onMutate: () => {
      setLessonIsLoading(true);
      toast.loading('Updating lesson...');
    },
    onSuccess: () => {
      setFormSubmitted(true);
      setLessonIsLoading(false);
      toast.remove();
      toast.success('Lesson updated successfully.', { duration: 5000 });
      toast.custom(
        (t) => (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              color: 'white',
              borderRadius: '8px',
            }}
            onClick={() => toast.dismiss(t.id)}
          >
            <a
              href={lessonLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'black', textDecoration: 'none' }}
            >
              Click here to view the updated lesson
            </a>
          </div>
        ),
        {
          duration: 5000,
          onClick: () => window.open(lessonLink, '_blank'),
        }
      );
      setTimeout(() => navigate('/lessons'), 500);
    },
    onError: (error) => {
      setLessonIsLoading(false);
      toast.remove();
      toast.error(`Error updating lesson: ${error.message}`, { duration: 5000 });
    },
  });

  if (errorFetchingLesson) {
    toast.error(
      <Stack direction="row" sx={{ mr: '-15px' }}>
        <p>Error fetching lesson.</p>
        <Button
          sx={{
            textTransform: 'none',
            color: 'black',
            fontSize: '0.95rem',
          }}
          onClick={() => {
            refetchLesson();
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

  const onSubmit = async (data) => {
    if (isNew) data.id = generateUUID();
    if (typeof data.text !== 'string') data.text = toHtml(data.text);
    if (typeof data.videoText !== 'string') data.videoText = toHtml(data.videoText);

    if (data.hasTable) {
      const arabicWords = data.table.map((word) => word.arabicWord);
      const fetchWordPromises = arabicWords.map(async (word) => {
        try {
          setLessonIsLoading(true);
          await fetchWord(word);
        } catch (error) {
          if (error.message.startsWith('NotFoundError')) {
            const translations = { id: word };
            const translationPromises = languages.map(async (language) => {
              translations[language.language] = await translateText(word, language.code);
            });
            await Promise.all(translationPromises);
            saveWord.mutate(translations);
          } else {
            setLessonIsLoading(false);
            toast.remove();
            toast.error(`Error saving lesson: ${error.message}`, { duration: 5000 });
            return;
          }
        }
      });
      await Promise.all(fetchWordPromises);
    }
    if (isNew) saveLesson.mutate(data);
    else editLesson.mutate(data);
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
            <LessonTextForm setValue={setValue} getValues={getValues} text={getValues('text')} />
            <LessonTableForm
              register={register}
              errors={errors}
              clearErrors={clearErrors}
              setValue={setValue}
              watch={watch}
              control={control}
              getValues={getValues}
            />
            <LessonExerciseForm
              register={register}
              errors={errors}
              setValue={setValue}
              watch={watch}
              control={control}
            />
            <Stack direction="row" alignItems="center" justifyContent="flex-end">
              <Button
                variant="contained"
                color="primary"
                type="submit"
                onClick={handleClick}
                disabled={lessonIsLoading || !isDirty}
              >
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
