import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import AppCurrentVisits from './LevelDistribution';
import AppWidgetSummary from './Summary';
import AppConversionRates from './LanguageDistribution';
import { Card, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function AppView() {
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
            icon={<img alt="icon" src="/assets/icons/glass/graduated.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Lessons"
            total={714}
            icon={<img alt="icon" src="/assets/icons/glass/book.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Quizzes"
            total={172}
            icon={<img alt="icon" src="/assets/icons/glass/graduation.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Feedbacks"
            total={234}
            icon={<img alt="icon" src="/assets/icons/glass/feedback.png" />}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppCurrentVisits
            title="Level Distribution"
            chart={{
              series: [
                { label: 'Beginner', value: 4344 },
                { label: 'Intermediate', value: 5435 },
                { label: 'Advanced', value: 1443 },
              ],
              colors: ['#252D63', '#43a0d8', '#99e7d9'],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppConversionRates
            title="Language Distribution"
            chart={{
              series: [
                { label: 'Italy', value: 400 },
                { label: 'Japan', value: 430 },
                { label: 'China', value: 448 },
                { label: 'Canada', value: 470 },
                { label: 'France', value: 540 },
                { label: 'Germany', value: 580 },
                { label: 'South Korea', value: 690 },
                { label: 'Netherlands', value: 1100 },
                { label: 'United States', value: 1200 },
                { label: 'United Kingdom', value: 1380 },
              ],
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
