export const quiz = {
  titleArabic: 'اختبار المفردات للمبتدئين',
  titleEnglish: 'Beginner Vocabulary Quiz',
  level: 'Beginner',
  type: 'Vocabulary',
  time: 10,
  questions: [
    {
      questionArabic: 'كم عدد الأحرف في اللغة العربية؟',
      questionEnglish: 'How many letters are there in the Arabic language?',
      questionType: 'multipleChoice',
      options: [
        'ثمانية وعشرون حرفاً',
        'ثلاثة وعشرون حرفاً',
        'أربعة وعشرون حرفاً',
        'سبعة وعشرون حرفاً',
      ],
      correctAnswer: ['ثمانية وعشرون حرفاً'],
    },
    {
      questionArabic: 'ما هو الحرف الأول في اللغة العربية؟',
      questionEnglish: 'What is the first letter in the Arabic language?',
      questionType: 'multipleChoice',
      options: ['الألف', 'الباء', 'التاء', 'الثاء'],
      correctAnswer: ['الألف'],
    },
    {
      questionArabic: 'أي الآفعال التالية فعل مضارع؟',
      questionEnglish: 'Which of the following verbs is in the present tense?',
      questionType: 'allThatApply',
      options: ['يكتب', 'كتب', 'اكتب', 'تكتب'],
      correctAnswer: ['يكتب', 'تكتب'],
    },
    {
      questionArabic: 'ما هو الحرف الأخير في اللغة العربية؟',
      questionEnglish: 'What is the last letter in the Arabic language?',
      questionType: 'multipleChoice',
      options: ['الألف', 'الياء', 'الواو', 'الهاء'],
      correctAnswer: ['الياء'],
    },
    {
      questionArabic: 'أي من الأحرف التالية حرف مد؟',
      questionEnglish: 'Which of the following letters is a long vowel?',
      questionType: 'allThatApply',
      options: ['الألف', 'النون', 'التاء', 'الواو', 'الياء'],
      correctAnswer: ['الألف', 'الواو', 'الياء'],
    },
    {
      questionArabic: 'ما هي الأحرف التي تتشكل منها الكلمة التالية؟',
      questionEnglish: 'Which letters make up the following word?',
      audioWord: 'مَلِكْ',
      questionType: 'allThatApply',
      options: ['الميم', 'اللام', 'الكاف', 'الهاء'],
      correctAnswer: ['الميم', 'اللام', 'الكاف'],
    },
  ],
};