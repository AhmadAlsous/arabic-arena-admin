import SvgColor from 'src/components/svg-color';

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard',
    icon: icon('home'),
  },
  {
    title: 'lessons',
    path: '/lessons',
    icon: icon('lesson'),
  },
  {
    title: 'quizzes',
    path: '/quizzes',
    icon: icon('quiz'),
  },
  {
    title: 'placement test',
    path: '/placement-test',
    icon: icon('placement'),
  },
  {
    title: 'users',
    path: '/users',
    icon: icon('users'),
  },
  {
    title: 'feedback & problems',
    path: '/feedback',
    icon: icon('feedback'),
  },
];

export default navConfig;
