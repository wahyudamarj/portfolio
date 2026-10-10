import { r as React, S as ScrollTrigger } from './pageTransition-Bv7HEG0J.js';
import { siteURL } from './site-paths.js';

const h = React.createElement;
// A reload starts a fresh preview session, even if a dialog was previously open.
if (history.state?.portfolioPreview) {
  const { portfolioPreview, ...rest } = history.state;
  history.replaceState(rest, '');
}
const preview = name => siteURL(`media/previews/${name}`);
const early = name => siteURL(`media/early-career/${name}`);
const other = name => siteURL(`media/others/${name}`);

export const confidentialProject = {
  id: 'corporate-confidential', type: 'confidential', title: 'Confidential work',
  video: early('confidential.mp4'), poster: preview('confidential.webp'),
};
export const corporateProjects = [
  { id: 'corporate-branding', type: 'html', title: 'Personal Branding', label: 'Interactive learning experience',
    video: early('personal branding.mp4'), poster: preview('personal-branding.webp'),
    href: early('personal-branding.html') },
  { id: 'corporate-participation', type: 'description', title: 'Active Participation', label: 'Course development documents',
    video: early('active participation.mp4'), poster: preview('active-participation.webp'),
    description: 'A collection of course development documents I created for Active Participation. This sample shows the range of documents I produced throughout the development of a single course, offering a closer look at the work behind the learning experience.',
    action: 'Preview course documents', href: 'https://drive.google.com/drive/folders/1-hDvdl_mmTTIsz_pqxoRLeu7q6Yhj3h-?usp=drive_link' },
  { id: 'corporate-development', type: 'description', title: 'Personal Development', label: 'Video course · Dicoding',
    video: early('personal development.mp4'), poster: preview('personal-development.webp'),
    description: 'A personal development course I created while working at Dicoding. The video lessons combine animation with talking-head footage, using storytelling to make the ideas engaging and relatable.',
    action: 'Explore the course', href: 'https://www.dicoding.com/academies/697-belajar-strategi-pengembangan-diri' },
];

export const otherCategory = {
  id: 'other', title: 'Other Work', note: 'Learning decks and educational videos.', direction: -1,
  projects: [
    { id: 'other-1', type: 'slides', title: 'Introduction to Machine Learning', label: '01 / Learning deck · Grade 6', slides: 23, deck: '01', zoom: true,
      poster: preview('deck-1.webp'), href: other('1. Module 3_ Week 12  Introduction to Machine Learning Session 1 - Grade 6.pptx') },
    { id: 'other-2', type: 'slides', title: 'Ideation & Identifying a Problem', label: '02 / Learning deck · Grade 12', slides: 44, deck: '02', zoom: true,
      poster: preview('deck-2.webp'), href: other('2. G12 MODULE 1_ Week 1 - Ideation & Identifying a Problem Session 1.pptx') },
    { id: 'other-3', type: 'slides', title: 'Defining the Mission and Impact', label: '03 / Learning deck · Grade 12', slides: 33, deck: '03', zoom: true,
      poster: preview('deck-3.webp'), href: other('3. G12 MODULE 1_ Week 2 - Defining the Mission and Impact Session 2.pptx') },
    { id: 'other-4', type: 'video', title: 'The Evolution of Digital Banking', label: '04 / Video · Indonesian',
      video: preview('other-4.mp4'), poster: preview('other-4.webp'), href: other('other-4.webm') },
    { id: 'other-5', type: 'video', title: 'Building User Confidence in Virtual Reality', label: '05 / Video · Indonesian',
      video: preview('other-5.mp4'), poster: preview('other-5.webp'), href: other('other-5.webm') },
    { id: 'other-6', type: 'video', title: 'Balancing Assets and Liabilities', label: '06 / Video · Indonesian',
      video: preview('other-6.mp4'), poster: preview('other-6.webp'), href: other('other-6.webm') },
  ],
};

function LoopVideo({ project, playing }) {
  const ref = React.useRef(null);
  const [activated, setActivated] = React.useState(false);
  React.useEffect(() => {
    const holder = ref.current;
    if (!holder) return undefined;
    let visible = false;
    const update = () => {
      const video = holder.querySelector('video');
      if (!video) return;
      if (visible && playing && !document.hidden) video.play().catch(() => {});
      else video.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) setActivated(true);
      update();
    }, { rootMargin: '240px 0px' });
    const onVisibility = update;
    observer.observe(holder);
    document.addEventListener('visibilitychange', onVisibility);
    return () => { observer.disconnect(); holder.querySelector('video')?.pause(); document.removeEventListener('visibilitychange', onVisibility); };
  }, [playing, activated]);
  return h('span', { ref, className: 'loop-video-shell' },
    activated
      ? h('video', { src: project.video, poster: project.poster, muted: true, loop: true,
          playsInline: true, preload: 'metadata', 'aria-hidden': true, disablePictureInPicture: true })
      : h('img', { src: project.poster, alt: '', loading: 'lazy', decoding: 'async', fetchPriority: 'low', 'aria-hidden': true }));
}

function CorporateCard({ project, playing, onOpen, confidential = false }) {
  return h('div', { className: `card corporate-card${confidential ? ' confidential-card' : ''}`, 'data-project-id': project.id },
    h('button', { type: 'button', className: 'card-hit', 'aria-label': `Open ${project.title}`,
      onClick: event => onOpen(project, event.currentTarget) },
      h('span', { className: 'card-media' }, h(LoopVideo, { project, playing })),
      confidential && h('span', { className: 'work-card-caption' },
        h('span', { className: 'work-card-eyebrow' }, confidential ? "Before you browse" : project.label),
        h('strong', null, confidential ? "A quick note about this work" : project.title),
        confidential && h('span', { className: 'confidential-prompt' }, "Read this first", h('span', { 'aria-hidden': true }, ' ↗')))));
}

export function CorporateGallery({ unlocked, motionEnabled, paused, onOpen }) {
  React.useEffect(() => {
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [unlocked]);
  return h('section', { className: 'gallery theme-corporate corporate-gallery', id: 'work-corporate',
    'data-world': '#0e1533 #f4f6ff', 'aria-labelledby': 'corporate-heading' },
    h('header', { className: 'gallery-head shell' },
      h('div', null, h('h3', { id: 'corporate-heading' }, 'Early Career & Corporate',
        h('span', { className: 'count-chip', 'aria-label': '3 selected examples' }, '3')),
      h('p', null, unlocked ? "Here are a few examples I can share." : "Most of this work is confidential.")),
      h('span', { className: 'gallery-token', 'aria-hidden': true })),
    h('div', { className: `corporate-stage shell${unlocked ? ' is-revealed' : ' is-sealed'}` },
      unlocked
        ? h('div', { className: 'corporate-grid' }, corporateProjects.map(project => h(CorporateCard, {
            key: project.id, project, playing: motionEnabled && !paused, onOpen })))
        : h(React.Fragment, null,
            h('div', { className: 'sealed-previews', 'aria-hidden': true }, corporateProjects.map(project =>
              h('div', { key: project.id, className: 'sealed-preview' }, h('img', { src: project.poster, alt: '', loading: 'lazy', decoding: 'async', fetchPriority: 'low' })))),
            h(CorporateCard, { project: confidentialProject, playing: motionEnabled && !paused, onOpen, confidential: true }))),
    h('p', { className: 'sr-only', role: 'status' }, unlocked ? 'Three selected examples are now available.' : 'Read the confidentiality note to reveal three examples.'));
}

function SlidePlayer({ project }) {
  const [page, setPage] = React.useState(1);
  const [loaded, setLoaded] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const change = React.useCallback(next => setPage(current => Math.max(1, Math.min(project.slides, typeof next === 'function' ? next(current) : next))), [project.slides]);
  React.useEffect(() => { setLoaded(false); setFailed(false); }, [page]);
  React.useEffect(() => {
    const navigate = event => {
      if (!event.defaultPrevented && ['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) {
        event.preventDefault();
        change(event.key === 'Home' ? 1 : event.key === 'End' ? project.slides : current => current + (event.key === 'ArrowRight' ? 1 : -1));
      }
    };
    document.addEventListener('keydown', navigate);
    return () => document.removeEventListener('keydown', navigate);
  }, [change, project.slides]);
  const src = siteURL(`media/slides/${project.deck}/${String(page).padStart(2, '0')}.svg`);
  React.useEffect(() => {
    if (!loaded || page >= project.slides) return;
    const controller = new AbortController();
    const next = siteURL(`media/slides/${project.deck}/${String(page + 1).padStart(2, '0')}.svg`);
    const timer = setTimeout(() => {
      fetch(next, { signal: controller.signal }).then(r => r.text()).then(text => {
        const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
        for (const node of doc.querySelectorAll('image')) {
          const href = node.getAttribute('href') || node.getAttribute('xlink:href');
          if (href && !href.startsWith('data:')) { const image = new Image(); image.src = new URL(href, next).href; }
        }
      }).catch(() => {});
    }, 150);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [loaded, page, project.deck, project.slides]);
  return h('div', { className: 'slide-player' },
    h('div', { className: 'slide-stage', 'aria-busy': !loaded && !failed },
      !loaded && !failed && h('p', { className: 'preview-status', role: 'status' }, 'Loading slide…'),
      failed && h('p', { className: 'preview-status', role: 'alert' }, 'This slide could not load. Please try again or download the original deck below.'),
      h('object', { key: src, data: src, type: 'image/svg+xml', role: 'img', tabIndex: -1, 'aria-label': `${project.title}, slide ${page} of ${project.slides}`, onLoad: () => setLoaded(true), onError: () => setFailed(true) })),
    h('div', { className: 'slide-controls' },
      h('button', { type: 'button', disabled: page === 1, onClick: () => change(current => current - 1) }, '← Previous'),
      h('span', { role: 'status', 'aria-live': 'polite', 'aria-atomic': true }, `Slide ${page} of ${project.slides}`),
      h('button', { type: 'button', disabled: page === project.slides, onClick: () => change(current => current + 1) }, 'Next →')),
    h('div', { className: 'slide-footer' },
      h('span', null, 'Slide preview · Use the arrow keys to navigate.'),
      h('span', null, 'Complete deck · Vector slide preview')));
}

function VideoPlayer({ project }) {
  const media = React.useRef(null);
  React.useEffect(() => { const video = media.current; video.pause(); video.load(); return () => { video.pause(); video.removeAttribute('src'); video.load(); }; }, [project.href]);
  const [failed, setFailed] = React.useState(false);
  return h('div', { className: 'video-player' },
    h('p', { className: 'video-language' }, h('span', { 'aria-hidden': true }, '◉ '), 'Video in Indonesian'),
    h('video', { ref: media, src: project.href, poster: project.poster, controls: true, playsInline: true, preload: 'metadata',
      'aria-label': `${project.title} — video in Indonesian`, onError: () => setFailed(true) }),
    failed && h('p', { role: 'alert' }, 'The video could not load. ', h('a', { href: project.href, target: '_blank', rel: 'noopener noreferrer' }, 'Open the original video')));
}

export function WorkPreview({ project, origin, onClosed, onReveal }) {
  const dialog = React.useRef(null);
  const closeRef = React.useRef(() => {});
  const [frameLoaded, setFrameLoaded] = React.useState(false);
  const frame = React.useRef(null);
  React.useEffect(() => {
    const node = dialog.current;
    const previousFocus = document.activeElement;
    let closing = false;
    const finish = () => {
      if (closing) return;
      closing = true;
      node.close();
      const target = previousFocus?.isConnected ? previousFocus : document.querySelector('#work-corporate .card-hit');
      target?.focus({ preventScroll: true });
      onClosed();
    };
    node.showModal();
    node.querySelector('.work-preview-close').focus({ preventScroll: true });
    document.documentElement.classList.add('is-locked');
    if (history.state?.portfolioPreview !== project.id) history.pushState({ ...history.state, portfolioPreview: project.id }, '');
    closeRef.current = () => history.state?.portfolioPreview === project.id ? history.back() : finish();
    window.addEventListener('popstate', finish);
    return () => {
      window.removeEventListener('popstate', finish);
      node.querySelectorAll('video').forEach(video => video.pause());
      document.documentElement.classList.remove('is-locked');
      if (node.open) node.close();
    };
  }, []);
  React.useEffect(() => {
    if (!frameLoaded || !frame.current) return;
    const child = frame.current.contentWindow;
    const escape = event => { if (event.key === 'Escape') { event.preventDefault(); closeRef.current(); } };
    try { child.addEventListener('keydown', escape); return () => child.removeEventListener('keydown', escape); } catch { /* cross-origin content retains toolbar controls */ }
  }, [frameLoaded]);
  const close = () => closeRef.current();
  let content;
  if (project.type === 'confidential') {
    content = h('article', { className: 'work-story confidential-story' },
      h('span', { className: 'work-story-kicker' }, 'EARLY CAREER & CORPORATE'),
      h('h2', null, "Before you take a look"),
      h('p', null, "Most of the work I’ve done for early-career and corporate learners is confidential, so I can only share a few examples here."),
      h('div', { className: 'confidential-example' },
        h('span', null, "One project I can tell you about"),
        h('h3', null, 'Bangkit Academy'),
        h('p', null, "I created decks for instructor-led training (ILT) at Bangkit Academy, a programming scholarship program in Indonesia run in collaboration with Google. Those decks need to stay private.")),
      h('button', { type: 'button', className: 'work-action', onClick: () => { onReveal(); close(); } }, 'OK, show examples'));
  } else if (project.type === 'description') {
    content = h('article', { className: 'work-story' },
      h('span', { className: 'work-story-kicker' }, project.label),
      h('h2', null, project.title), h('p', null, project.description),
      h('a', { className: 'work-action', href: project.href, target: '_blank', rel: 'noopener noreferrer' }, project.action, ' ↗'),
      h('small', { className: 'external-note' }, 'Opens in a new tab'));
  } else if (project.type === 'slides') content = h(SlidePlayer, { project });
  else if (project.type === 'video') content = h(VideoPlayer, { project });
  else content = h('div', { className: 'html-preview' },
    !frameLoaded && h('p', { className: 'preview-status', role: 'status' }, 'Loading the interactive experience…'),
    h('iframe', { ref: frame, src: project.href, title: project.title, onLoad: () => setFrameLoaded(true), allow: 'fullscreen; autoplay' }));
  return h('dialog', { ref: dialog, className: `work-preview preview-${project.type}`, 'aria-label': project.title,
    onCancel: event => { event.preventDefault(); close(); }, onClick: event => { if (event.target === dialog.current) close(); } },
    h('div', { className: 'work-preview-layout' },
      h('header', { className: 'work-preview-bar' },
        h('button', { type: 'button', className: 'work-preview-back', onClick: close, 'aria-label': 'Back to portfolio' }, '← Back'),
        h('span', { className: 'work-preview-title' }, project.title),
        h('button', { type: 'button', className: 'work-preview-close', onClick: close, 'aria-label': 'Close project' }, '✕')),
      h('div', { className: 'work-preview-body' }, content)));
}
