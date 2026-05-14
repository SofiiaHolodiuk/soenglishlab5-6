require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');

const Course = require('../models/Course');
const GalleryImage = require('../models/GalleryImage');
const Faq = require('../models/Faq');
const Testimonial = require('../models/Testimonial');
const Instructor = require('../models/Instructor');

const RESET = process.argv.includes('--reset');

/** Unsplash: стабільні посилання (у репо немає локальних jpg). */
const US = id =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;
const USq = (id, w = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

/** Портрети randomuser.me — стабільні шляхи для відгуків та викладачів. */
const face = (kind, n) => `https://randomuser.me/api/portraits/${kind}/${n}.jpg`;

const coursesData = [
  {
    title: 'English for Beginners',
    description:
      'Ідеальний курс для тих, хто тільки починає вивчати англійську. Базова граматика, лексика та впевнене спілкування в повсякденних ситуаціях.',
    tag: 'Creative',
    lessonCount: 12,
    rating: 4.9,
    imagePath: USq('photo-1434030216411-0b793f4b4173', 900),
  },
  {
    title: 'Business English Mastery',
    description:
      'Ділова лексика, презентації, офіційні листи та переговори англійською. Для професіоналів і кар’єристів.',
    tag: 'Business',
    lessonCount: 16,
    rating: 4.95,
    imagePath: USq('photo-1454165804606-c3d57bc86b40', 900),
  },
  {
    title: 'Spoken English & Pronunciation',
    description:
      'Розмовна практика, вимова та розуміння різних акцентів. Для тих, хто хоче звучати природно.',
    tag: 'Creative',
    lessonCount: 10,
    rating: 4.85,
    imagePath: USq('photo-1523240795612-9a054b0db644', 900),
  },
  {
    title: 'IELTS / TOEFL Preparation',
    description:
      'Структурована підготовка до міжнародних іспитів: Reading, Listening, Writing, Speaking та пробні тести.',
    tag: 'Exam',
    lessonCount: 20,
    rating: 4.92,
    imagePath: USq('photo-1456513080510-7bf3a84b82f8', 900),
  },
  {
    title: 'English for IT & Tech',
    description:
      'Технічна англійська для розробників: інтерв’ю, документація, мітинги та комунікація з міжнародними командами.',
    tag: 'Tech',
    lessonCount: 14,
    rating: 4.88,
    imagePath: USq('photo-1517694712202-14dd9538aa97', 900),
  },
  {
    title: 'Travel & Everyday English',
    description:
      'Короткі модулі для подорожей: аеропорт, готель, оренда, екстрені ситуації та невимушене спілкування.',
    tag: 'Lifestyle',
    lessonCount: 8,
    rating: 4.8,
    imagePath: USq('photo-1488646953014-85cb44e25828', 900),
  },
];

const galleryData = [
  { imagePath: US('photo-1524178232363-1fb2b075b655'), altText: 'Урок у класі з природним світлом', sortOrder: 1 },
  { imagePath: US('photo-1523240795612-9a054b0db644'), altText: 'Студенти під час групової дискусії', sortOrder: 2 },
  { imagePath: US('photo-1503676260728-1c00da094a0b'), altText: 'Онлайн-навчання з ноутбуком', sortOrder: 3 },
  { imagePath: US('photo-1516321318423-f06f85e504b3'), altText: 'Підготовка до презентації англійською', sortOrder: 4 },
  { imagePath: US('photo-1497633762265-9d179a990aa6'), altText: 'Бібліотека та самостійна робота', sortOrder: 5 },
  { imagePath: US('photo-1522202176988-66273c2fd55f'), altText: 'Командна робота над проєктом', sortOrder: 6 },
  { imagePath: US('photo-1509062522246-3755977927d7'), altText: 'Індивідуальна робота з матеріалами', sortOrder: 7 },
  { imagePath: US('photo-1498079022511-d15614cb1c02'), altText: 'Читання та нотатки', sortOrder: 8 },
  { imagePath: US('photo-1513258496099-48168024aec0'), altText: 'Мовний клуб і практика speaking', sortOrder: 9 },
  { imagePath: US('photo-1427504494785-3a9ca7044f45'), altText: 'Воркшоп із бізнес-англійської', sortOrder: 10 },
  { imagePath: US('photo-1456324504439-367cee3b3c32'), altText: 'Мотивація до щоденної практики', sortOrder: 11 },
  { imagePath: US('photo-1552664730-d307ca884978'), altText: 'Сучасні методики в аудиторії', sortOrder: 12 },
];

const faqData = [
  {
    question: 'Що таке SoEnglish?',
    answer:
      'SoEnglish — це онлайн-платформа для вивчення англійської мови: курси різних рівнів, практика з викладачами, гнучкий графік і доступ з будь-якого пристрою.',
    sortOrder: 1,
  },
  {
    question: 'Як я можу зареєструватися?',
    answer:
      'Оберіть курс на головній сторінці, натисніть кнопку реєстрації або заповніть форму підписки внизу сторінки — ми надішлемо інструкції на email.',
    sortOrder: 2,
  },
  {
    question: 'Чи доступні курси безкоштовно?',
    answer:
      'Так, частина базових модулів і відкриті уроки доступні безкоштовно. Повні програми та персональні заняття — за підпискою або разовою оплатою.',
    sortOrder: 3,
  },
  {
    question: 'Як я можу зв’язатися з підтримкою?',
    answer:
      'Напишіть на електронну пошту з контактів у футері, залиште повідомлення через форму на сайті або зателефонуйте за вказаним номером у робочі години.',
    sortOrder: 4,
  },
  {
    question: 'Які способи оплати ви приймаєте?',
    answer:
      'Ми приймаємо банківські картки Visa/Mastercard, Apple Pay/Google Pay у підтримуваних регіонах та інші способи за погодженням з менеджером.',
      sortOrder: 5,
  },
  {
    question: 'Чи можна навчатися у власному темпі?',
    answer:
      'Так. Більшість курсів доступні у записі; живі заняття також мають розклад, який можна поєднати з роботою чи навчанням.',
    sortOrder: 6,
  },
  {
    question: 'Як довго триває один курс?',
    answer:
      'Тривалість залежить від програми: від кількох тижнів для інтенсиву до кількох місяців для повних рівнів. Кількість уроків вказана на картці курсу.',
    sortOrder: 7,
  },
  {
    question: 'Чи є сертифікат після завершення?',
    answer:
      'Після успішного завершення програми ви отримуєте електронний сертифікат SoEnglish з зазначенням обсягу годин і рівня (за наявності фінального тесту).',
    sortOrder: 8,
  },
  {
    question: 'Чи підходить платформа для початківців?',
    answer:
      'Так. Є окремі траєкторії від рівня A1, багато пояснень українською на старті та підтримка викладачів у перші місяці.',
    sortOrder: 9,
  },
  {
    question: 'Чи можна замінити курс або заморозити доступ?',
    answer:
      'Умови переносу та паузи прописані в оферті. Зазвичай можлива одна заморозка на програму після звернення до підтримки.',
    sortOrder: 10,
  },
];

const testimonialsData = [
  {
    author: 'Joe Stanie',
    text: 'Навчання в SoEnglish змінило моє життя. Завдяки курсам я опанував англійську мову і тепер працюю в міжнародній компанії.',
    imagePath: face('men', 75),
  },
  {
    author: 'Олена Коваленко',
    text: 'За пів року підняла рівень з B1 до B2. Особливо зараховую speaking-клуби та зворотний зв’язок від викладача після кожного есе.',
    imagePath: face('women', 65),
  },
  {
    author: 'Marcus Weber',
    text: 'Business English курс допоміг упевнено вести дзвінки з партнерами з Німеччини та США. Матеріали актуальні, без «води».',
    imagePath: face('men', 32),
  },
  {
    author: 'Іван Петренко',
    text: 'Готувався до IELTS — отримав 7.5. Зручно, що все в одному кабінеті: тести, поради та розбори помилок.',
    imagePath: face('men', 44),
  },
  {
    author: 'Sofia Martelli',
    text: 'As a designer I needed English for client calls. Short IT-focused lessons fit my schedule perfectly.',
    imagePath: face('women', 68),
  },
  {
    author: 'Марія Лисенко',
    text: 'Подобається гнучкість і якість відео. Повернулась до навчання після декрету без стресу — все зрозуміло з першого тижня.',
    imagePath: face('women', 33),
  },
  {
    author: 'Alex Kim',
    text: 'Compact travel English module helped before a three-month trip across Europe. Exactly what I needed.',
    imagePath: face('men', 91),
  },
];

const instructorsData = [
  {
    name: 'Емма Вілсон',
    bio: '15 років викладання, CELTA. Спеціалізація: розмовна англійська та вимова для дорослих.',
    imagePath: face('women', 50),
  },
  {
    name: 'James Carter',
    bio: 'Колишній бізнес-тренер. Курси Business English, презентації та ділове листування.',
    imagePath: face('men', 15),
  },
  {
    name: 'Катерина Савченко',
    bio: 'Підготовка до IELTS/TOEFL, академічна англійська. Власниця сертифікатів рівня C2.',
    imagePath: face('women', 26),
  },
  {
    name: 'David Okonkwo',
    bio: 'МА у лінгвістиці. Медіація та міжкультурна комунікація в міжнародних командах.',
    imagePath: face('men', 86),
  },
];

async function seed() {
  if (!process.env.MONGO_URI) {
    console.error('Встановіть MONGO_URI у server/.env');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10_000,
  });
  console.log('Connected to MongoDB');

  if (RESET) {
    await Course.deleteMany({});
    await GalleryImage.deleteMany({});
    await Faq.deleteMany({});
    await Testimonial.deleteMany({});
    await Instructor.deleteMany({});
    console.log('Скинуто: courses, gallery, faq, testimonials, instructors');
  }

  if (RESET || (await Course.countDocuments()) === 0) {
    await Course.insertMany(coursesData);
    console.log(`Курси: ${coursesData.length}`);
  }

  if (RESET || (await GalleryImage.countDocuments()) === 0) {
    await GalleryImage.insertMany(galleryData);
    console.log(`Галерея: ${galleryData.length}`);
  }

  if (RESET || (await Faq.countDocuments()) === 0) {
    await Faq.insertMany(faqData);
    console.log(`FAQ: ${faqData.length}`);
  }

  if (RESET || (await Testimonial.countDocuments()) === 0) {
    await Testimonial.insertMany(testimonialsData);
    console.log(`Відгуки: ${testimonialsData.length}`);
  }

  if (RESET || (await Instructor.countDocuments()) === 0) {
    await Instructor.insertMany(instructorsData);
    console.log(`Інструктори: ${instructorsData.length}`);
  }

  await mongoose.disconnect();
  console.log('Seed готово.');
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
