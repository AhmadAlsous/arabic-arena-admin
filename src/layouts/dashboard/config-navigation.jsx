import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/',
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
    title: 'settings',
    path: '/settings',
    icon: icon('settings'),
  },
  {
    title: 'feedback & problems',
    path: '/feedback',
    icon: icon('feedback'),
  },
];

export default navConfig;
