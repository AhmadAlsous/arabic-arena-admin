import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Card, Stack, Typography } from '@mui/material';
import styled from '@emotion/styled';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { replaceSpacesWithDashes } from 'src/utils/stringOperations';
import Modal from 'src/components/Modal';

const StyledBox = styled(Box)`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #3aafa9;

  &:hover .hover-content {
    opacity: 1;
    cursor: pointer;
  }
`;

const TitleImageContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0 15%;
  font-family: 'Arabic-bold', sans-serif;
  letter-spacing: 1px;
  text-align: center;
  font-size: 2.5rem;
  opacity: 0.35;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HoverContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  font-family: 'Din-round', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.7rem;
  letter-spacing: 1px;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
`;

export default function LessonCard({ lesson, isQuiz }) {
  const renderContent = lesson.imageLink ? (
    <Box
      component="img"
      alt={lesson.titleEnglish}
      src={lesson.imageLink}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'cover',
        position: 'absolute',
      }}
    />
  ) : (
    <TitleImageContainer>{lesson.titleArabic}</TitleImageContainer>
  );

  return (
    <Card>
      <Link
        to={`/${isQuiz ? 'quizzes' : 'lessons'}/${replaceSpacesWithDashes(
          lesson.titleEnglish.toLowerCase()
        )}`}
      >
        <StyledBox sx={{ pt: '100%' }}>
          {renderContent}
          <HoverContent className="hover-content">EDIT</HoverContent>
        </StyledBox>
      </Link>

      <Stack spacing={1} sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="subtitle1" noWrap>
          {lesson.titleArabic}
        </Typography>
        <Typography variant="subtitle1" fontFamily={'Din-round'} noWrap>
          {lesson.titleEnglish}
        </Typography>
        <Typography fontFamily={'Din-round'} component="span" variant="body1">
          {lesson.level}
          &nbsp;|&nbsp;
          {lesson.type}
        </Typography>
        <Modal
          btn="Delete"
          trigger={
            <Button color="error">
              <Icon icon="ic:outline-delete" fontSize={30} />
            </Button>
          }
        >
          <Typography fontFamily={'Din-round'} variant="h5" sx={{ mt: 1 }} textAlign={'center'}>
            Confirmation
          </Typography>
          <Stack spacing={2} textAlign={'center'} paddingY={3}>
            <Typography fontFamily={'Din-round'} variant="body1">
              Are you sure you want to delete this {isQuiz ? 'quiz' : 'lesson'}?
            </Typography>
            <Typography fontFamily={'Din-round'} variant="body1">
              This action cannot be undone.
            </Typography>
          </Stack>
        </Modal>
      </Stack>
    </Card>
  );
}

LessonCard.propTypes = {
  lesson: PropTypes.object.isRequired,
};
