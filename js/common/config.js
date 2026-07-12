const APP_CONFIG = Object.freeze({
  links: Object.freeze({
    resume: 'https://drive.google.com/file/d/14qVyx-U4hDb7M6SMxpXBofro9XklfXug/preview',
    github: 'https://github.com/saurabhDev02',
    linkedin: 'https://www.linkedin.com/in/saurabh-kumar-verma-902062320',
    instagram: 'https://www.instagram.com/ig.saurabh_07',
    whatsapp: 'https://wa.me/919569581015',
    maps: 'https://maps.app.goo.gl/2jbQFbkAmeMjU1u47',
  }),
  email: Object.freeze({
    serviceId: window.__ENV__?.EMAILJS_SERVICE_ID || '',
    templateId: window.__ENV__?.EMAILJS_TEMPLATE_ID || '',
    userId: window.__ENV__?.EMAILJS_USER_ID || '',
    owner: window.__ENV__?.OWNER_EMAIL || '',
  }),
});

