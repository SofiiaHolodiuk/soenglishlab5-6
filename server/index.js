require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const mongoose  = require('mongoose');

const Subscriber  = require('./models/Subscriber');
const Course      = require('./models/Course');
const GalleryImage = require('./models/GalleryImage');
const Faq         = require('./models/Faq');
const Testimonial = require('./models/Testimonial');
const Instructor  = require('./models/Instructor');
const { readSiteContent } = require('./siteContent');
const posthog     = require('./posthog');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ─── DB ──────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => { console.error('MongoDB error:', err); process.exit(1); });

// ─── HEALTH ──────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// ─── SITE COPY (JSON) ────────────────────────────────────
app.get('/api/content', (req, res) => {
  try {
    res.json(readSiteContent());
  } catch (e) {
    console.error('site-content:', e);
    res.status(500).json({ message: 'Не вдалося завантажити контент' });
  }
});

// ─── SUBSCRIBERS ─────────────────────────────────────────
app.post('/api/subscribe', async (req, res) => {
  const { name, email } = req.body;
  const msg = readSiteContent().apiMessages;
  if (!name || !email) return res.status(400).json({ message: msg.subscribeNameEmailRequired });
  try {
    await Subscriber.create({ name, email });
    posthog.capture({ distinctId: email, event: 'subscribed', properties: { name } });
    res.status(201).json({ message: msg.subscribeSuccess });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: msg.subscribeDuplicateEmail });
    res.status(500).json({ message: msg.subscribeServerError });
  }
});

app.get('/api/subscribers', async (req, res) => {
  const list = await Subscriber.find().sort({ createdAt: -1 });
  res.json(list);
});

// ─── COURSES ─────────────────────────────────────────────
app.get('/api/courses', async (req, res) => {
  res.json(await Course.find().sort({ createdAt: 1 }));
});

app.get('/api/courses/:id', async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: readSiteContent().apiMessages.courseNotFound });
  posthog.capture({ distinctId: 'anonymous', event: 'course_viewed', properties: { courseId: course._id.toString(), title: course.title } });
  res.json(course);
});

// ─── GALLERY ─────────────────────────────────────────────
app.get('/api/gallery', async (req, res) => {
  res.json(await GalleryImage.find().sort({ sortOrder: 1 }));
});

app.get('/api/gallery/preview', async (req, res) => {
  res.json(await GalleryImage.find().sort({ sortOrder: 1 }).limit(5));
});

// ─── FAQ ─────────────────────────────────────────────────
app.get('/api/faq', async (req, res) => {
  res.json(await Faq.find().sort({ sortOrder: 1 }));
});

// ─── TESTIMONIALS ────────────────────────────────────────
app.get('/api/testimonials', async (req, res) => {
  res.json(await Testimonial.find().sort({ createdAt: -1 }));
});

// ─── INSTRUCTORS ─────────────────────────────────────────
app.get('/api/instructors', async (req, res) => {
  res.json(await Instructor.find().sort({ createdAt: 1 }));
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

process.on('SIGTERM', async () => { await posthog.shutdown(); process.exit(0); });
process.on('SIGINT',  async () => { await posthog.shutdown(); process.exit(0); });
