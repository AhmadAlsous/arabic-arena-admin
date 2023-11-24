import { useState } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Iconify from 'src/components/iconify';
import { Icon } from '@iconify/react';

import { lessons } from 'src/_mock/lessons';

import LessonCard from './LessonCard';
import FilterBar from 'src/components/FilterBar';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function LessonsView() {
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [searchWord, setSearchWord] = useState('');
  const filteredLessons = lessons.filter(
    (lesson) =>
      (selectedLevel === 'All' || lesson.level === selectedLevel) &&
      (selectedType === 'All' || lesson.type === selectedType) &&
      (searchWord === '' ||
        lesson.titleArabic.includes(searchWord) ||
        lesson.titleEnglish.toLowerCase().includes(searchWord.toLowerCase()))
  );

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
          Lessons
        </Typography>
        <Link to="/lessons/new">
          <Button variant="contained" color="primary">
            <Icon fontSize={22} icon="ic:baseline-plus" />
            &nbsp; Add New Lesson
          </Button>
        </Link>
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        flexWrap="wrap-reverse"
        justifyContent="space-between"
        sx={{ mb: 5 }}
      >
        <TextField
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value)}
          placeholder="Search lessons..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ ml: 1, width: 20, height: 20 }} />
              </InputAdornment>
            ),
          }}
        />
        <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
          <FilterBar
            level={selectedLevel}
            type={selectedType}
            onChangeLevel={setSelectedLevel}
            onChangeType={setSelectedType}
          />
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        {filteredLessons.map((lesson) => (
          <Grid key={lesson.id} xs={12} sm={6} md={3}>
            <LessonCard lesson={lesson} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
