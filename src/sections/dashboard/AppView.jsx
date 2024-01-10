import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import AppCurrentVisits from './LevelDistribution';
import AppWidgetSummary from './Summary';
import AppConversionRates from './LanguageDistribution';
import { Card, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getLessonCount } from 'src/services/lessonServices';
import { getQuizCount } from 'src/services/quizServices';
import { fetchUsers } from 'src/services/userServices';
import { languages } from 'src/config/languages';
import { formatName } from 'src/utils/stringOperations';

export default function AppView() {
  const { data: lessonCount } = useQuery({
    queryKey: ['lessonsCount'],
    queryFn: getLessonCount,
  });
  const { data: quizCount } = useQuery({
    queryKey: ['quizzesCount'],
    queryFn: getQuizCount,
  });
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
  const beginnerCount = users ? users.filter((user) => user.level === 'Beginner').length : 0;
  const intermediateCount = users
    ? users.filter((user) => user.level === 'Intermediate').length
    : 0;
  const advancedCount = users ? users.filter((user) => user.level === 'Advanced').length : 0;
  const distribution = {};
  languages.forEach((language) => {
    distribution[language.language] = users
      ? users.filter((user) => user.language.toLowerCase() === language).length
      : 0;
  });
  const navigate = useNavigate();
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Users"
            total={1352}
            link={'/users'}
            icon={<img alt="icon" src="/assets/icons/glass/graduated.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Lessons"
            total={lessonCount ? lessonCount : ' '}
            link={'/lessons'}
            icon={<img alt="icon" src="/assets/icons/glass/book.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Quizzes"
            total={quizCount ? quizCount : ' '}
            link={'/quizzes'}
            icon={<img alt="icon" src="/assets/icons/glass/graduation.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Feedbacks"
            total={234}
            link={'/feedback'}
            icon={<img alt="icon" src="/assets/icons/glass/feedback.png" />}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppCurrentVisits
            title="Level Distribution"
            chart={{
              series: [
                { label: 'Beginner', value: beginnerCount },
                { label: 'Intermediate', value: intermediateCount },
                { label: 'Advanced', value: advancedCount },
              ],
              colors: ['#252D63', '#43a0d8', '#99e7d9'],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppConversionRates
            title="Language Distribution"
            chart={{
              series: Object.keys(distribution).map((key) => ({
                label: formatName(key),
                value: distribution[key],
              })),
              colors: ['#43a0d8'],
            }}
          />
        </Grid>
        <Grid xs={12} md={6} lg={6}>
          <Card
            component={Stack}
            spacing={3}
            direction="row"
            justifyContent={'center'}
            onClick={() => navigate('/lessons/new')}
            sx={{
              px: 3,
              py: 5,
              borderRadius: 2,
              cursor: 'pointer',
              ':hover': {
                backgroundColor: '#f0f0f0',
              },
            }}
          >
            <Typography variant="h5" letterSpacing={2}>
              Add New Lesson
            </Typography>
          </Card>
        </Grid>
        <Grid xs={12} md={6} lg={6}>
          <Card
            component={Stack}
            spacing={3}
            direction="row"
            justifyContent={'center'}
            onClick={() => navigate('/quizzes/new')}
            sx={{
              px: 3,
              py: 5,
              borderRadius: 2,
              cursor: 'pointer',
              ':hover': {
                backgroundColor: '#f0f0f0',
              },
            }}
          >
            <Typography variant="h5" letterSpacing={2}>
              Add New Quiz
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
