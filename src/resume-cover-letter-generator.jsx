import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Download, FileText, Loader2, Plus, X, ChevronDown, ChevronUp,
  Edit3, RotateCcw, Check, Lock, Camera, User, FileEdit
} from 'lucide-react';

/* ============================================================
   DATA MODEL
   ============================================================ */

const EMPTY_RESUME = {
  name: "", photo: null,
  contact: { phone: "", email: "", location: "", linkedin: "", website: "" },
  summary: { tagline: "", bullets: [], skills: [] },
  experience: [], education: [], certifications: [], projects: [], awards: [],
};

const SAMPLE_RESUME = {
  name: "Amelia Torres", photo: null,
  contact: { phone: "+61 411 234 567", email: "amelia.torres@email.com", location: "Brisbane, QLD", linkedin: "linkedin.com/in/ameliatorres-rn", website: "" },
  summary: {
    tagline: "Senior Registered Nurse with 11 years in emergency and critical care across Brisbane's major hospital networks.",
    bullets: [
      "Consistently rated in the top 10% of nursing staff for patient satisfaction scores across three consecutive performance reviews at Princess Alexandra Hospital.",
      "Led a ward-wide triage protocol redesign that reduced average emergency wait times by 22% and was adopted across two additional departments.",
      "Experienced preceptor and clinical supervisor — mentored over 40 graduate nurses through transition to professional practice programs.",
    ],
    skills: ["Emergency Triage", "Critical Care", "IV Therapy & Cannulation", "Medication Administration", "Wound Management", "Patient Advocacy", "Clinical Supervision", "ACLS / BLS", "EMR / ieMR"],
  },
  experience: [
    {
      title: "Senior Registered Nurse", company: "Princess Alexandra Hospital", location: "Woolloongabba, QLD", start: "Feb 2020", end: "Present",
      summary: "Senior clinician in the Emergency Department — one of Queensland's busiest trauma centres with over 85,000 presentations annually.",
      bullets: [
        "Triaged and managed high-acuity patients across resuscitation, acute, and subacute streams, independently prioritising care for complex multi-trauma cases.",
        "Coordinated bed management and patient flow during peak periods, reducing ambulance bypass incidents by 18% over 12 months.",
        "Championed the rollout of ieMR digital charting across the ED, training 35 nursing staff and cutting documentation errors by 31%.",
        "Served as After-Hours Nursing Coordinator on rotation, overseeing staffing, clinical escalations, and incident response across the facility.",
      ],
    },
    {
      title: "Registered Nurse — ICU", company: "Royal Brisbane and Women's Hospital", location: "Herston, QLD", start: "Mar 2016", end: "Jan 2020",
      summary: "Level 6 nurse in a 36-bed mixed medical-surgical intensive care unit.",
      bullets: [
        "Managed 1:1 and 1:2 care for ventilated, post-surgical, and sepsis patients in collaboration with intensivists, fellows, and allied health teams.",
        "Contributed to a hospital-wide pressure injury prevention initiative that achieved a 40% reduction in ICU-acquired pressure injuries over 18 months.",
        "Completed advanced training in continuous renal replacement therapy (CRRT) and intra-aortic balloon pump (IABP) management.",
      ],
    },
    {
      title: "Graduate Registered Nurse", company: "Mater Hospital Brisbane", location: "South Brisbane, QLD", start: "Jan 2014", end: "Feb 2016",
      summary: "Two-year graduate program rotating across medical, surgical, and oncology wards.",
      bullets: [
        "Completed rotations in General Medicine, Colorectal Surgery, and Haematology/Oncology, building a broad acute care foundation.",
        "Received the Mater Graduate Nurse Excellence Award (2015) for outstanding patient care and professional conduct.",
      ],
    },
  ],
  education: [
    { degree: "Bachelor of Nursing (Honours)", school: "Queensland University of Technology", location: "Brisbane, QLD", date: "2013", honors: "GPA 6.4 / 7.0 · Clinical Excellence Award, Final Year" },
  ],
  certifications: [
    { name: "Advanced Cardiac Life Support (ACLS)", org: "American Heart Association", date: "2024" },
    { name: "Advanced Paediatric Life Support (APLS)", org: "APLS Australia", date: "2023" },
    { name: "Graduate Certificate in Emergency Nursing", org: "Griffith University", date: "2018" },
    { name: "Registered Nurse — General and Midwifery", org: "AHPRA", date: "Current" },
  ],
  projects: [],
  awards: [
    "Queensland Health Nursing Excellence Award — Emergency Care Category (2023)",
    "Princess Alexandra Hospital Staff Recognition Award — Patient Experience (2022)",
    "Mater Graduate Nurse Excellence Award (2015)",
  ],
};

/* ============================================================
   FONT STACKS
   ============================================================ */
const INTER      = '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif';
const OUTFIT     = '"Outfit", "Inter", "Helvetica Neue", Arial, sans-serif';
const DM_SANS    = '"DM Sans", "Inter", "Helvetica Neue", Arial, sans-serif';
const PLUS_JAKARTA = '"Plus Jakarta Sans", "Inter", Arial, sans-serif';
const SORA       = '"Sora", "Inter", Arial, sans-serif';
const FRAUNCES   = '"Fraunces", Georgia, "Times New Roman", serif';
const LIBRE_B    = '"Libre Baskerville", Georgia, Cambria, serif';
const PLAYFAIR   = '"Playfair Display", Georgia, "Times New Roman", serif';
const MONO_FACE  = '"JetBrains Mono", "IBM Plex Mono", Menlo, Consolas, monospace';

/* ============================================================
   TEMPLATES
   ============================================================ */
const TEMPLATES = {
  'corporate-boardroom': { label: 'Apex', blurb: 'Dark header band with photo, geometric accent bar.', category: 'corporate', accent: '#0F2744', nameFont: OUTFIT, bodyFont: INTER, layout: 'dark-header', photoShape: 'circle', sectionDeco: 'left-bar' },
  'corporate-partner': { label: 'Meridian', blurb: 'Split header: photo left, name + contact right.', category: 'corporate', accent: '#1B3A5C', nameFont: PLUS_JAKARTA, bodyFont: PLUS_JAKARTA, layout: 'split-header', photoShape: 'rounded-square', sectionDeco: 'dot-line' },
  'tech-builder': { label: 'Stack', blurb: 'Monospace accents, skill chips, left accent strip.', category: 'tech', accent: '#0D47A1', nameFont: SORA, bodyFont: INTER, layout: 'accent-strip', photoShape: 'hexagon', sectionDeco: 'mono-label' },
  'tech-architect': { label: 'Blueprint', blurb: 'Dark sidebar with photo, grid-inspired layout.', category: 'tech', accent: '#162032', nameFont: SORA, bodyFont: INTER, layout: 'dark-sidebar', photoShape: 'circle', sectionDeco: 'bracket' },
  'creative-editorial': { label: 'Verso', blurb: 'Editorial asymmetry with oversized name, photo inline.', category: 'creative', accent: '#B84A2A', accent2: '#2A5C4E', nameFont: FRAUNCES, bodyFont: DM_SANS, layout: 'editorial', photoShape: 'organic', sectionDeco: 'italic-rule' },
  'creative-studio': { label: 'Canvas', blurb: 'Full color sidebar with photo, bold typographic header.', category: 'creative', accent: '#5C1F6B', nameFont: PLAYFAIR, bodyFont: DM_SANS, layout: 'color-sidebar', photoShape: 'circle', sectionDeco: 'soft-band' },
  'healthcare-practitioner': { label: 'Clarity', blurb: 'Clean two-tone header, photo in accent circle.', category: 'healthcare', accent: '#0E6B5E', nameFont: PLUS_JAKARTA, bodyFont: PLUS_JAKARTA, layout: 'two-tone-header', photoShape: 'circle', sectionDeco: 'teal-rule' },
  'healthcare-educator': { label: 'Align', blurb: 'Structured columns, credential-forward layout.', category: 'healthcare', accent: '#1B5E6B', nameFont: DM_SANS, bodyFont: DM_SANS, layout: 'structured-cols', photoShape: 'rounded-square', sectionDeco: 'pill-header' },
  'academic-scholar': { label: 'Folio', blurb: 'Classical serif with modern proportions and photo.', category: 'academic', accent: '#6B1F35', nameFont: FRAUNCES, bodyFont: LIBRE_B, layout: 'folio', photoShape: 'circle', sectionDeco: 'serif-rule' },
  'academic-researcher': { label: 'Thesis', blurb: 'Dense CV layout, accent left-column, publication-ready.', category: 'academic', accent: '#2C3E6B', nameFont: LIBRE_B, bodyFont: LIBRE_B, layout: 'cv-dense', photoShape: 'rounded-square', sectionDeco: 'rule-number' },
  'trades-operator': { label: 'Forge', blurb: 'High-contrast dark header, bold type, certification badges.', category: 'trades', accent: '#1A1A1A', accent2: '#E05C20', nameFont: OUTFIT, bodyFont: OUTFIT, layout: 'dark-header', photoShape: 'rounded-square', sectionDeco: 'orange-bar', boldHeader: true },
  'trades-foreman': { label: 'Ironclad', blurb: 'Diagonal accent band header, rugged sans-serif.', category: 'trades', accent: '#2B2B2B', accent2: '#D4500F', nameFont: OUTFIT, bodyFont: INTER, layout: 'diagonal-band', photoShape: 'circle', sectionDeco: 'thick-rule' },
  'modern-sidebar': { label: 'The Sidebar', blurb: 'Two-column: accent sidebar with contact/skills, content on right.', category: 'modern', accent: '#1A3A4A', nameFont: INTER, bodyFont: INTER, layout: 'sidebar-classic', photoShape: 'circle', sectionDeco: 'sidebar-rule', twoColumn: true },
  'modern-director': { label: 'The Director', blurb: 'Full-width color header band, bold name on accent background.', category: 'modern', accent: '#1A3A4A', nameFont: INTER, bodyFont: INTER, layout: 'header-band', photoShape: 'circle', sectionDeco: 'small-caps-rule', headerBand: true },
  // ATS-Clean
  'ats-signal': { label: 'Signal', blurb: 'Pure single-column, zero graphics. Maximum ATS compatibility.', category: 'ats', accent: '#0F2744', nameFont: INTER, bodyFont: INTER, layout: 'ats-single-col', photoShape: 'circle', sectionDeco: 'left-bar' },
  'ats-baseline': { label: 'Baseline', blurb: 'Thin left accent rule, clean single-column. ATS-safe.', category: 'ats', accent: '#1A3A4A', nameFont: PLUS_JAKARTA, bodyFont: INTER, layout: 'ats-lined', photoShape: 'circle', sectionDeco: 'dot-line' },
  // Student / Graduate
  'student-launch': { label: 'Launch', blurb: 'Education-first layout with gradient header for new grads.', category: 'student', accent: '#0D47A1', nameFont: OUTFIT, bodyFont: DM_SANS, layout: 'student-fresh', photoShape: 'circle', sectionDeco: 'soft-band' },
  'student-spark': { label: 'Spark', blurb: 'Vibrant accent header, skills chips, activity-forward.', category: 'student', accent: '#5C1F6B', nameFont: SORA, bodyFont: DM_SANS, layout: 'student-fresh', photoShape: 'circle', sectionDeco: 'pill-header' },
  // Executive
  'exec-prestige': { label: 'Prestige', blurb: 'Commanding two-section layout for C-suite and directors.', category: 'executive', accent: '#0F2744', nameFont: PLAYFAIR, bodyFont: LIBRE_B, layout: 'exec-prestige', photoShape: 'circle', sectionDeco: 'serif-rule' },
  'exec-summit': { label: 'Summit', blurb: 'Bold name with accent underline, gravitas two-column.', category: 'executive', accent: '#1A1A1A', nameFont: OUTFIT, bodyFont: INTER, layout: 'exec-prestige', photoShape: 'rounded-square', sectionDeco: 'thick-rule' },
  // Finance / Legal
  'finance-sterling': { label: 'Sterling', blurb: 'Ultra-formal centred header with double rule. Serif-first.', category: 'finance', accent: '#0F2744', nameFont: LIBRE_B, bodyFont: LIBRE_B, layout: 'formal-serif', photoShape: 'circle', sectionDeco: 'serif-rule' },
  'legal-counsel': { label: 'Counsel', blurb: 'Classic serif, centred name, traditional law firm style.', category: 'finance', accent: '#6B1F35', nameFont: PLAYFAIR, bodyFont: LIBRE_B, layout: 'formal-serif', photoShape: 'circle', sectionDeco: 'dot-line' },
  // Hospitality / Chef
  'hospitality-chef': { label: 'Mise en Place', blurb: 'Warm sidebar, specialty badges, venue-forward layout.', category: 'hospitality', accent: '#4A2010', accent2: '#C17A3A', nameFont: OUTFIT, bodyFont: DM_SANS, layout: 'hospitality', photoShape: 'circle', sectionDeco: 'soft-band' },
  'hospitality-hotel': { label: 'Concierge', blurb: 'Refined sidebar, photo, service-industry focused.', category: 'hospitality', accent: '#1B3A5C', accent2: '#B8963A', nameFont: PLUS_JAKARTA, bodyFont: PLUS_JAKARTA, layout: 'hospitality', photoShape: 'rounded-square', sectionDeco: 'teal-rule' },
  // Fitness / Wellness
  'fitness-elevate': { label: 'Elevate', blurb: 'Bold energetic header, cert badges, trainer-ready.', category: 'fitness', accent: '#1A3A1A', accent2: '#4CAF50', nameFont: OUTFIT, bodyFont: INTER, layout: 'fitness', photoShape: 'circle', sectionDeco: 'orange-bar' },
  'wellness-flow': { label: 'Flow', blurb: 'Warm diagonal header, credential-forward, coach style.', category: 'fitness', accent: '#2C5F6B', accent2: '#7ABFBF', nameFont: DM_SANS, bodyFont: DM_SANS, layout: 'fitness', photoShape: 'organic', sectionDeco: 'teal-rule' },
  // Real Estate
  'realestate-listing': { label: 'Listing', blurb: 'Photo right, metrics-forward, achievement-focused.', category: 'realestate', accent: '#1B3A5C', nameFont: PLUS_JAKARTA, bodyFont: PLUS_JAKARTA, layout: 'real-estate', photoShape: 'rounded-square', sectionDeco: 'dot-line' },
  'realestate-cornerstone': { label: 'Cornerstone', blurb: 'Dark premium header, photo, bold broker presence.', category: 'realestate', accent: '#2B1A0F', nameFont: PLAYFAIR, bodyFont: DM_SANS, layout: 'real-estate', photoShape: 'circle', sectionDeco: 'serif-rule' },
  // Freelancer / Contractor
  'freelancer-craft': { label: 'Craft', blurb: 'Project-first, portfolio-ready, client work featured.', category: 'freelancer', accent: '#0D47A1', nameFont: PLUS_JAKARTA, bodyFont: INTER, layout: 'freelancer', photoShape: 'circle', sectionDeco: 'left-bar' },
  'freelancer-syntax': { label: 'Syntax', blurb: 'Tech contractor style, skills-strip, mono accents.', category: 'freelancer', accent: '#162032', nameFont: SORA, bodyFont: INTER, layout: 'freelancer', photoShape: 'hexagon', sectionDeco: 'mono-label' },
};

const CATEGORIES = [
  { id: 'corporate',   label: 'Corporate',    variants: ['corporate-boardroom', 'corporate-partner'] },
  { id: 'tech',        label: 'Tech',         variants: ['tech-builder', 'tech-architect'] },
  { id: 'creative',    label: 'Creative',     variants: ['creative-editorial', 'creative-studio'] },
  { id: 'healthcare',  label: 'Health / Edu', variants: ['healthcare-practitioner', 'healthcare-educator'] },
  { id: 'academic',    label: 'Academic',     variants: ['academic-scholar', 'academic-researcher'] },
  { id: 'trades',      label: 'Trades',       variants: ['trades-operator', 'trades-foreman'] },
  { id: 'modern',      label: 'Modern',       variants: ['modern-sidebar', 'modern-director'] },
  { id: 'ats',         label: 'ATS-Safe',     variants: ['ats-signal', 'ats-baseline'] },
  { id: 'student',     label: 'Student',      variants: ['student-launch', 'student-spark'] },
  { id: 'executive',   label: 'Executive',    variants: ['exec-prestige', 'exec-summit'] },
  { id: 'finance',     label: 'Finance / Legal', variants: ['finance-sterling', 'legal-counsel'] },
  { id: 'hospitality', label: 'Hospitality',  variants: ['hospitality-chef', 'hospitality-hotel'] },
  { id: 'fitness',     label: 'Fitness',      variants: ['fitness-elevate', 'wellness-flow'] },
  { id: 'realestate',  label: 'Real Estate',  variants: ['realestate-listing', 'realestate-cornerstone'] },
  { id: 'freelancer',  label: 'Freelancer',   variants: ['freelancer-craft', 'freelancer-syntax'] },
];

const ACCENT_PRESETS = [
  { name: 'Navy', value: '#0F2744' }, { name: 'Cobalt', value: '#0D47A1' },
  { name: 'Teal', value: '#0E6B5E' }, { name: 'Forest', value: '#1A4731' },
  { name: 'Burgundy', value: '#6B1F35' }, { name: 'Plum', value: '#5C1F6B' },
  { name: 'Clay', value: '#B84A2A' }, { name: 'Slate', value: '#2C3E6B' },
  { name: 'Charcoal', value: '#2B2B2B' }, { name: 'Obsidian', value: '#1A1A1A' },
];

/* ============================================================
   UTILITIES
   ============================================================ */
function hexToRgba(hex, alpha) {
  const h = (hex || '#000000').replace('#', '');
  const r = parseInt(h.slice(0,2),16), g = parseInt(h.slice(2,4),16), b = parseInt(h.slice(4,6),16);
  return `rgba(${r},${g},${b},${alpha})`;
}
function lighten(hex, pct) {
  const h = (hex || '#000000').replace('#', '');
  const r = Math.min(255, parseInt(h.slice(0,2),16) + Math.round(255*pct));
  const g = Math.min(255, parseInt(h.slice(2,4),16) + Math.round(255*pct));
  const b = Math.min(255, parseInt(h.slice(4,6),16) + Math.round(255*pct));
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}

/* ============================================================
   PHOTO COMPONENT
   ============================================================ */
function ResumePhoto({ src, shape, size = '1in', border }) {
  const dim = { width: size, height: size, flexShrink: 0 };
  if (!src) return (
    <div style={{ ...dim, borderRadius: shape==='circle'?'50%':shape==='rounded-square'?'0.1in':'0', background: border?hexToRgba(border,0.2):'#ddd', display:'flex', alignItems:'center', justifyContent:'center', border: border?`2px solid ${hexToRgba(border,0.3)}`:'none' }}>
      <div style={{ color: border||'#aaa', opacity:0.5, fontSize:'0.3in' }}>✦</div>
    </div>
  );
  if (shape === 'circle') return <div style={{ ...dim, borderRadius:'50%', overflow:'hidden', border: border?`3px solid ${border}`:'3px solid rgba(255,255,255,0.3)', flexShrink:0 }}><img src={src} alt="Profile" style={{ width:'100%', height:'100%', objectFit:'cover' }} /></div>;
  if (shape === 'rounded-square') return <div style={{ ...dim, borderRadius:'0.08in', overflow:'hidden', border: border?`2px solid ${hexToRgba(border,0.25)}`:'none', flexShrink:0 }}><img src={src} alt="Profile" style={{ width:'100%', height:'100%', objectFit:'cover' }} /></div>;
  if (shape === 'organic') return <div style={{ ...dim, borderRadius:'60% 40% 55% 45% / 45% 55% 40% 60%', overflow:'hidden', border: border?`2px solid ${hexToRgba(border,0.3)}`:'none', flexShrink:0 }}><img src={src} alt="Profile" style={{ width:'100%', height:'100%', objectFit:'cover' }} /></div>;
  if (shape === 'hexagon') return (
    <div style={{ ...dim, flexShrink:0, position:'relative' }}>
      <svg viewBox="0 0 100 100" style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
        <defs><clipPath id="hex-clip"><polygon points="50,2 93,25 93,75 50,98 7,75 7,25" /></clipPath></defs>
        <image href={src} x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid slice" clipPath="url(#hex-clip)" />
        <polygon points="50,2 93,25 93,75 50,98 7,75 7,25" fill="none" stroke={border||'rgba(255,255,255,0.3)'} strokeWidth="2" />
      </svg>
    </div>
  );
  return <div style={{ ...dim, overflow:'hidden', flexShrink:0 }}><img src={src} alt="Profile" style={{ width:'100%', height:'100%', objectFit:'cover' }} /></div>;
}

/* ============================================================
   SHARED SECTION RENDERERS
   ============================================================ */
function ContactLine({ data, separator='  ·  ', style={} }) {
  const items = [data.contact?.location, data.contact?.phone, data.contact?.email, data.contact?.linkedin, data.contact?.website].filter(Boolean);
  if (!items.length) return null;
  return <div style={style}>{items.join(separator)}</div>;
}
function ContactStack({ data, style={}, itemStyle={}, labelStyle={} }) {
  const items = [
    { label:'Location', value:data.contact?.location }, { label:'Phone', value:data.contact?.phone },
    { label:'Email', value:data.contact?.email }, { label:'LinkedIn', value:data.contact?.linkedin }, { label:'Website', value:data.contact?.website },
  ].filter(x=>x.value);
  return (
    <div style={style}>
      {items.map((item,i) => (
        <div key={i} style={{ marginBottom:'0.05in', ...itemStyle }}>
          {labelStyle && Object.keys(labelStyle).length>0 && <div style={labelStyle}>{item.label}</div>}
          <div style={{ wordBreak:'break-word' }}>{item.value}</div>
        </div>
      ))}
    </div>
  );
}

function SectionTitle({ children, deco, accent, bodyFont, accent2 }) {
  const base = { fontFamily:bodyFont, letterSpacing:'0.15em', fontSize:'9pt', fontWeight:700, textTransform:'uppercase' };
  if (deco==='left-bar') return <div style={{ display:'flex',alignItems:'center',gap:'0.1in',margin:'0.18in 0 0.08in 0' }}><div style={{ width:'3px',height:'0.18in',background:accent,borderRadius:'2px',flexShrink:0 }}/><div style={{ ...base,color:accent }}>{children}</div></div>;
  if (deco==='dot-line') return <div style={{ display:'flex',alignItems:'center',gap:'0.08in',margin:'0.18in 0 0.08in 0' }}><div style={{ width:'6px',height:'6px',borderRadius:'50%',background:accent,flexShrink:0 }}/><div style={{ ...base,color:accent,flex:1 }}>{children}</div><div style={{ flex:1,height:'1px',background:hexToRgba(accent,0.2) }}/></div>;
  if (deco==='mono-label') return <div style={{ margin:'0.18in 0 0.08in 0',display:'flex',alignItems:'center',gap:'0.1in' }}><div style={{ ...base,fontFamily:MONO_FACE,color:accent,fontSize:'8pt' }}>{'// '}{children}</div><div style={{ flex:1,height:'1px',background:hexToRgba(accent,0.18) }}/></div>;
  if (deco==='bracket') return <div style={{ margin:'0.18in 0 0.08in 0' }}><div style={{ ...base,color:accent,fontFamily:MONO_FACE,fontSize:'8.5pt' }}><span style={{opacity:0.5}}>{'{'}</span>{' '}{children}{' '}<span style={{opacity:0.5}}>{'}'}</span></div><div style={{ height:'1px',background:hexToRgba(accent,0.15),marginTop:'0.04in' }}/></div>;
  if (deco==='italic-rule') return <div style={{ margin:'0.2in 0 0.08in 0',paddingBottom:'0.04in',borderBottom:`1px solid ${hexToRgba(accent,0.35)}` }}><div style={{ ...base,fontStyle:'italic',fontWeight:400,letterSpacing:'0.12em',color:accent,fontSize:'10pt' }}>{children}</div></div>;
  if (deco==='soft-band') return <div style={{ background:hexToRgba(accent,0.08),padding:'0.05in 0.1in',margin:'0.16in -0.1in 0.08in -0.1in',borderLeft:`3px solid ${accent}` }}><div style={{ ...base,color:accent }}>{children}</div></div>;
  if (deco==='teal-rule') return <div style={{ display:'flex',alignItems:'center',gap:'0.1in',margin:'0.18in 0 0.08in 0' }}><div style={{ ...base,color:accent,whiteSpace:'nowrap' }}>{children}</div><div style={{ flex:1,height:'2px',background:`linear-gradient(to right, ${accent}, transparent)` }}/></div>;
  if (deco==='pill-header') return <div style={{ margin:'0.18in 0 0.08in 0' }}><span style={{ ...base,color:'#fff',background:accent,padding:'0.025in 0.12in',borderRadius:'50px',fontSize:'8pt' }}>{children}</span></div>;
  if (deco==='serif-rule') return <div style={{ margin:'0.2in 0 0.08in 0',paddingBottom:'0.04in',borderBottom:`1.5px solid ${accent}`,display:'flex',alignItems:'baseline',gap:'0.1in' }}><div style={{ ...base,fontFamily:FRAUNCES,textTransform:'none',fontSize:'11pt',fontWeight:600,letterSpacing:'0.02em',color:accent }}>{children}</div></div>;
  if (deco==='rule-number') return <div style={{ display:'flex',alignItems:'center',gap:'0.08in',margin:'0.18in 0 0.06in 0' }}><div style={{ ...base,color:accent }}>{children}</div><div style={{ flex:1,height:'1px',background:hexToRgba(accent,0.25) }}/></div>;
  if (deco==='orange-bar') return <div style={{ display:'flex',alignItems:'center',gap:'0.1in',margin:'0.16in 0 0.08in 0' }}><div style={{ width:'0.18in',height:'2px',background:accent2||accent,flexShrink:0 }}/><div style={{ ...base,color:'#fff',letterSpacing:'0.2em' }}>{children}</div></div>;
  if (deco==='thick-rule') return <div style={{ margin:'0.16in 0 0.08in 0',paddingBottom:'0.04in',borderBottom:`2.5px solid ${accent2||accent}` }}><div style={{ ...base,color:'#1c1c1c',letterSpacing:'0.2em' }}>{children}</div></div>;
  if (deco==='sidebar-rule') return <div style={{ margin:'0.18in 0 0.07in 0',paddingBottom:'0.03in',borderBottom:`2px solid ${accent}`,...base,color:accent }}>{children}</div>;
  if (deco==='small-caps-rule') return <div style={{ margin:'0.2in 0 0.08in 0',paddingBottom:'0.03in',borderBottom:`1px solid ${accent}`,...base,color:accent }}>{children}</div>;
  return <div style={{ ...base,color:accent,margin:'0.18in 0 0.08in 0',paddingBottom:'0.03in',borderBottom:`1px solid ${hexToRgba(accent,0.3)}` }}>{children}</div>;
}

function ExperienceBlock({ exp, bodyFont, accent, i, total, density, darkBg }) {
  const textColor = darkBg?'rgba(255,255,255,0.92)':'#111';
  const subColor  = darkBg?'rgba(255,255,255,0.65)':'#444';
  const bulletColor = darkBg?'rgba(255,255,255,0.85)':'#1c1c1c';
  return (
    <div style={{ marginBottom: i===total-1?0:(density==='compact'?'0.1in':'0.15in') }}>
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'baseline',gap:'0.2in' }}>
        <div style={{ fontFamily:bodyFont,fontWeight:700,color:textColor,fontSize:'10.5pt' }}>
          {exp.title}{exp.company&&<span style={{ fontWeight:400,color:subColor }}>{' — '}{exp.company}</span>}{exp.location&&<span style={{ fontWeight:400,color:subColor,fontSize:'9.5pt' }}>{', '}{exp.location}</span>}
        </div>
        <div style={{ fontFamily:bodyFont,color:subColor,whiteSpace:'nowrap',fontSize:'9.5pt',flexShrink:0 }}>{[exp.start,exp.end].filter(Boolean).join(' – ')}</div>
      </div>
      {exp.summary&&<div style={{ fontFamily:bodyFont,color:subColor,margin:'0.03in 0',fontSize:'10pt',fontStyle:'italic' }}>{exp.summary}</div>}
      {exp.bullets?.length>0&&<ul style={{ margin:'0.03in 0 0',paddingLeft:'0.2in' }}>{exp.bullets.map((b,j)=><li key={j} style={{ marginBottom:'0.02in',fontFamily:bodyFont,fontSize:'10pt',color:bulletColor }}>{b}</li>)}</ul>}
    </div>
  );
}

function EducationBlock({ ed, bodyFont, darkBg }) {
  const textColor = darkBg?'rgba(255,255,255,0.92)':'#111';
  const subColor  = darkBg?'rgba(255,255,255,0.65)':'#444';
  return (
    <div style={{ marginBottom:'0.1in' }}>
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'baseline',gap:'0.2in' }}>
        <div style={{ fontFamily:bodyFont,fontWeight:600,color:textColor,fontSize:'10.5pt' }}>{ed.degree}{ed.school&&<span style={{ fontWeight:400,color:subColor }}>{' — '}{ed.school}</span>}{ed.location&&<span style={{ fontWeight:400,color:subColor,fontSize:'9.5pt' }}>{', '}{ed.location}</span>}</div>
        <div style={{ fontFamily:bodyFont,color:subColor,whiteSpace:'nowrap',fontSize:'9.5pt',flexShrink:0 }}>{ed.date}</div>
      </div>
      {ed.honors&&<div style={{ fontFamily:bodyFont,fontStyle:'italic',color:subColor,marginTop:'0.02in',fontSize:'9.5pt' }}>{ed.honors}</div>}
    </div>
  );
}

/* ============================================================
   LAYOUT RENDERERS
   ============================================================ */
function renderSections(data, bodyFont, accent, sectionDeco, accent2, skipSummary) {
  const s = data.summary || {};
  return <>
    {!skipSummary && (s.bullets?.length>0||s.skills?.length>0) && <div>
      <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont} accent2={accent2}>Summary</SectionTitle>
      {s.bullets?.map((b,i)=><div key={i} style={{ fontFamily:bodyFont,fontSize:'10pt',color:'#1c1c1c',marginBottom:'0.04in',paddingLeft:'0.14in',borderLeft:`2px solid ${hexToRgba(accent,0.2)}` }}>{b}</div>)}
      {s.skills?.length>0&&<div style={{ display:'flex',flexWrap:'wrap',gap:'0.05in',marginTop:'0.06in' }}>{s.skills.map((sk,i)=><span key={i} style={{ fontFamily:bodyFont,fontSize:'8.5pt',background:hexToRgba(accent,0.08),color:accent,padding:'0.02in 0.1in',borderRadius:'3px',fontWeight:600,border:`1px solid ${hexToRgba(accent,0.2)}` }}>{sk}</span>)}</div>}
    </div>}
    {data.experience?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont} accent2={accent2}>Experience</SectionTitle>{data.experience.map((exp,i)=><ExperienceBlock key={i} exp={exp} bodyFont={bodyFont} accent={accent} i={i} total={data.experience.length} />)}</div>}
    {data.education?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont} accent2={accent2}>Education</SectionTitle>{data.education.map((ed,i)=><EducationBlock key={i} ed={ed} bodyFont={bodyFont} accent={accent} />)}</div>}
    {data.certifications?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont} accent2={accent2}>Certifications</SectionTitle><ul style={{margin:0,paddingLeft:'0.2in'}}>{data.certifications.map((c,i)=><li key={i} style={{fontFamily:bodyFont,fontSize:'10pt',color:'#1c1c1c',marginBottom:'0.03in'}}><span style={{fontWeight:600}}>{c.name}</span>{c.org&&`, ${c.org}`}{c.date&&<span style={{color:'#666'}}> ({c.date})</span>}</li>)}</ul></div>}
    {data.projects?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont} accent2={accent2}>Projects</SectionTitle>{data.projects.map((p,i)=><div key={i} style={{marginBottom:'0.1in'}}><div style={{fontFamily:bodyFont,fontWeight:700,fontSize:'10.5pt'}}>{p.name}</div>{p.description&&<div style={{fontFamily:bodyFont,fontSize:'10pt',color:'#444',margin:'0.02in 0'}}>{p.description}</div>}{p.bullets?.length>0&&<ul style={{margin:'0.02in 0 0',paddingLeft:'0.2in'}}>{p.bullets.map((b,j)=><li key={j} style={{fontFamily:bodyFont,fontSize:'10pt'}}>{b}</li>)}</ul>}</div>)}</div>}
    {data.awards?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont} accent2={accent2}>Awards &amp; Honors</SectionTitle><ul style={{margin:0,paddingLeft:'0.2in'}}>{data.awards.map((a,i)=><li key={i} style={{fontFamily:bodyFont,fontSize:'10pt',color:'#1c1c1c',marginBottom:'0.03in'}}>{a}</li>)}</ul></div>}
  </>;
}

function LayoutDarkHeader({ data, template, accent, accent2 }) {
  const { bodyFont, nameFont, photoShape, sectionDeco, boldHeader } = template;
  const s = data.summary || {}; const a2 = accent2||template.accent2;
  return (
    <div style={{ width:'8.5in',minHeight:'11in',background:'#FAFAFA',fontFamily:bodyFont,boxSizing:'border-box',boxShadow:'0 12px 40px -10px rgba(0,0,0,0.18)' }}>
      <div style={{ background:accent,padding:'0.42in 0.65in',boxSizing:'border-box',position:'relative',overflow:'hidden' }}>
        <div style={{ position:'absolute',top:0,right:0,width:'2.5in',height:'100%',background:hexToRgba('#fff',0.04),clipPath:'polygon(30% 0, 100% 0, 100% 100%, 0% 100%)' }} />
        {a2&&<div style={{ position:'absolute',bottom:0,left:0,right:0,height:'3px',background:a2 }}/>}
        <div style={{ display:'flex',alignItems:'center',gap:'0.3in',position:'relative' }}>
          <ResumePhoto src={data.photo} shape={photoShape} size="1.05in" border={hexToRgba('#fff',0.3)} />
          <div style={{ flex:1 }}>
            <h1 style={{ fontFamily:nameFont,fontSize:boldHeader?'32pt':'28pt',fontWeight:800,color:'#fff',margin:0,lineHeight:1.1,letterSpacing:boldHeader?'0.06em':'-0.01em',textTransform:boldHeader?'uppercase':'none' }}>{data.name||'Your Name'}</h1>
            {s.tagline&&<div style={{ color:hexToRgba('#fff',0.7),fontSize:'10pt',marginTop:'0.07in',fontStyle:'italic' }}>{s.tagline}</div>}
            <ContactLine data={data} separator="  ·  " style={{ color:hexToRgba('#fff',0.72),fontSize:'8.5pt',marginTop:'0.1in',fontFamily:bodyFont }} />
          </div>
        </div>
      </div>
      <div style={{ padding:'0.4in 0.65in 0.6in',boxSizing:'border-box' }}>{renderSections(data, bodyFont, accent, sectionDeco, a2)}</div>
    </div>
  );
}

function LayoutSplitHeader({ data, template, accent }) {
  const { bodyFont, nameFont, photoShape, sectionDeco } = template; const s = data.summary || {};
  return (
    <div style={{ width:'8.5in',minHeight:'11in',background:'#FAFAFA',fontFamily:bodyFont,boxSizing:'border-box',boxShadow:'0 12px 40px -10px rgba(0,0,0,0.18)' }}>
      <div style={{ display:'flex',borderBottom:`3px solid ${accent}` }}>
        <div style={{ width:'2.5in',background:accent,padding:'0.4in 0.35in',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:'0.15in',flexShrink:0 }}>
          <ResumePhoto src={data.photo} shape={photoShape} size="1.15in" border="rgba(255,255,255,0.4)" />
          <ContactStack data={data} style={{ fontSize:'8pt',color:'rgba(255,255,255,0.82)',lineHeight:1.55,textAlign:'center',fontFamily:bodyFont }} labelStyle={{ fontSize:'6.5pt',textTransform:'uppercase',letterSpacing:'0.1em',color:'rgba(255,255,255,0.45)',marginBottom:'1px' }} />
        </div>
        <div style={{ flex:1,padding:'0.4in 0.5in',display:'flex',flexDirection:'column',justifyContent:'center' }}>
          <h1 style={{ fontFamily:nameFont,fontSize:'30pt',fontWeight:800,color:accent,margin:0,lineHeight:1.1,letterSpacing:'-0.01em' }}>{data.name||'Your Name'}</h1>
          {s.tagline&&<div style={{ fontFamily:bodyFont,fontSize:'10.5pt',color:'#555',marginTop:'0.08in',fontStyle:'italic' }}>{s.tagline}</div>}
          {s.bullets?.length>0&&<ul style={{ margin:'0.1in 0 0',paddingLeft:'0.18in' }}>{s.bullets.map((b,i)=><li key={i} style={{ fontFamily:bodyFont,fontSize:'10pt',color:'#333',marginBottom:'0.03in' }}>{b}</li>)}</ul>}
          {s.skills?.length>0&&<div style={{ display:'flex',flexWrap:'wrap',gap:'0.05in',marginTop:'0.1in' }}>{s.skills.map((sk,i)=><span key={i} style={{ fontFamily:bodyFont,fontSize:'8.5pt',background:hexToRgba(accent,0.08),color:accent,padding:'0.025in 0.1in',borderRadius:'50px',fontWeight:600 }}>{sk}</span>)}</div>}
        </div>
      </div>
      <div style={{ padding:'0.35in 0.55in 0.6in',boxSizing:'border-box' }}>{renderSections(data, bodyFont, accent, sectionDeco, null, true)}</div>
    </div>
  );
}

function LayoutAccentStrip({ data, template, accent }) {
  const { bodyFont, nameFont, photoShape, sectionDeco } = template; const s = data.summary || {};
  return (
    <div style={{ width:'8.5in',minHeight:'11in',background:'#FAFAFA',fontFamily:bodyFont,boxSizing:'border-box',display:'flex',boxShadow:'0 12px 40px -10px rgba(0,0,0,0.18)' }}>
      <div style={{ width:'0.18in',background:accent,flexShrink:0 }} />
      <div style={{ flex:1,padding:'0.55in 0.55in 0.6in 0.45in',boxSizing:'border-box' }}>
        <div style={{ display:'flex',alignItems:'flex-start',gap:'0.3in',marginBottom:'0.2in' }}>
          <div style={{ flex:1 }}>
            <h1 style={{ fontFamily:nameFont,fontSize:'30pt',fontWeight:700,color:'#0d0d0d',margin:0,lineHeight:1.1 }}>{data.name||'Your Name'}</h1>
            {s.tagline&&<div style={{ fontFamily:MONO_FACE,fontSize:'8.5pt',color:accent,marginTop:'0.07in' }}>{s.tagline}</div>}
            <ContactLine data={data} separator="  |  " style={{ fontFamily:MONO_FACE,fontSize:'7.5pt',color:'#555',marginTop:'0.08in',letterSpacing:'0.02em' }} />
          </div>
          <ResumePhoto src={data.photo} shape={photoShape} size="1in" border={hexToRgba(accent,0.4)} />
        </div>
        {s.skills?.length>0&&<div style={{ display:'flex',flexWrap:'wrap',gap:'0.05in',padding:'0.1in 0.12in',background:hexToRgba(accent,0.05),borderRadius:'4px',marginBottom:'0.05in',border:`1px solid ${hexToRgba(accent,0.12)}` }}>{s.skills.map((sk,i)=><span key={i} style={{ fontFamily:MONO_FACE,fontSize:'8pt',color:accent,fontWeight:500 }}>{sk}{i<s.skills.length-1?<span style={{opacity:0.4,marginLeft:'0.06in'}}>·</span>:''}</span>)}</div>}
        {renderSections(data, bodyFont, accent, sectionDeco, null)}
      </div>
    </div>
  );
}

function LayoutDarkSidebar({ data, template, accent }) {
  const { bodyFont, nameFont, photoShape, sectionDeco } = template; const s = data.summary || {};
  return (
    <div style={{ width:'8.5in',minHeight:'11in',background:'#FAFAFA',fontFamily:bodyFont,display:'flex',boxSizing:'border-box',boxShadow:'0 12px 40px -10px rgba(0,0,0,0.18)' }}>
      <div style={{ width:'2.35in',background:accent,padding:'0.5in 0.3in 0.5in 0.35in',boxSizing:'border-box',flexShrink:0 }}>
        <ResumePhoto src={data.photo} shape={photoShape} size="1.05in" border="rgba(255,255,255,0.25)" />
        <div style={{ marginTop:'0.18in',fontFamily:nameFont,fontSize:'16pt',fontWeight:700,color:'#fff',lineHeight:1.2,wordBreak:'break-word' }}>{data.name||'Your Name'}</div>
        {s.tagline&&<div style={{ fontFamily:MONO_FACE,fontSize:'7.5pt',color:hexToRgba('#fff',0.6),marginTop:'0.08in',lineHeight:1.4 }}>{s.tagline}</div>}
        <div style={{ marginTop:'0.2in',borderTop:'1px solid rgba(255,255,255,0.15)',paddingTop:'0.15in' }}>
          <div style={{ fontFamily:bodyFont,fontSize:'7pt',textTransform:'uppercase',letterSpacing:'0.18em',color:'rgba(255,255,255,0.45)',marginBottom:'0.08in' }}>Contact</div>
          <ContactStack data={data} style={{ fontFamily:bodyFont,fontSize:'8pt',color:'rgba(255,255,255,0.82)',lineHeight:1.5 }} labelStyle={{ fontSize:'6.5pt',textTransform:'uppercase',letterSpacing:'0.1em',color:'rgba(255,255,255,0.4)' }} />
        </div>
        {s.skills?.length>0&&<div style={{ marginTop:'0.18in',borderTop:'1px solid rgba(255,255,255,0.15)',paddingTop:'0.15in' }}><div style={{ fontFamily:bodyFont,fontSize:'7pt',textTransform:'uppercase',letterSpacing:'0.18em',color:'rgba(255,255,255,0.45)',marginBottom:'0.08in' }}>Skills</div>{s.skills.map((sk,i)=><div key={i} style={{ fontFamily:MONO_FACE,fontSize:'8pt',color:'rgba(255,255,255,0.85)',marginBottom:'0.04in',paddingLeft:'0.1in',borderLeft:'2px solid rgba(255,255,255,0.2)' }}>{sk}</div>)}</div>}
        {data.certifications?.length>0&&<div style={{ marginTop:'0.18in',borderTop:'1px solid rgba(255,255,255,0.15)',paddingTop:'0.15in' }}><div style={{ fontFamily:bodyFont,fontSize:'7pt',textTransform:'uppercase',letterSpacing:'0.18em',color:'rgba(255,255,255,0.45)',marginBottom:'0.08in' }}>Certifications</div>{data.certifications.map((c,i)=><div key={i} style={{ fontFamily:bodyFont,fontSize:'8pt',color:'rgba(255,255,255,0.82)',marginBottom:'0.07in' }}><div style={{fontWeight:600}}>{c.name}</div>{c.org&&<div style={{color:'rgba(255,255,255,0.55)'}}>{c.org}</div>}{c.date&&<div style={{color:'rgba(255,255,255,0.45)'}}>{c.date}</div>}</div>)}</div>}
        {data.education?.length>0&&<div style={{ marginTop:'0.18in',borderTop:'1px solid rgba(255,255,255,0.15)',paddingTop:'0.15in' }}><div style={{ fontFamily:bodyFont,fontSize:'7pt',textTransform:'uppercase',letterSpacing:'0.18em',color:'rgba(255,255,255,0.45)',marginBottom:'0.08in' }}>Education</div>{data.education.map((ed,i)=><div key={i} style={{ fontFamily:bodyFont,fontSize:'8pt',color:'rgba(255,255,255,0.82)',marginBottom:'0.08in' }}><div style={{fontWeight:600}}>{ed.degree}</div>{ed.school&&<div style={{color:'rgba(255,255,255,0.65)'}}>{ed.school}</div>}{ed.date&&<div style={{color:'rgba(255,255,255,0.45)'}}>{ed.date}</div>}</div>)}</div>}
      </div>
      <div style={{ flex:1,padding:'0.5in 0.5in 0.6in 0.4in',boxSizing:'border-box' }}>
        {s.bullets?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Summary</SectionTitle>{s.bullets.map((b,i)=><div key={i} style={{ fontFamily:bodyFont,fontSize:'10pt',color:'#1c1c1c',marginBottom:'0.04in' }}>{b}</div>)}</div>}
        {data.experience?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Experience</SectionTitle>{data.experience.map((exp,i)=><ExperienceBlock key={i} exp={exp} bodyFont={bodyFont} accent={accent} i={i} total={data.experience.length} />)}</div>}
        {data.projects?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Projects</SectionTitle>{data.projects.map((p,i)=><div key={i} style={{marginBottom:'0.1in'}}><div style={{fontFamily:bodyFont,fontWeight:700,fontSize:'10.5pt'}}>{p.name}</div>{p.description&&<div style={{fontFamily:bodyFont,fontSize:'10pt',color:'#444',margin:'0.02in 0'}}>{p.description}</div>}{p.bullets?.length>0&&<ul style={{margin:'0.02in 0 0',paddingLeft:'0.2in'}}>{p.bullets.map((b,j)=><li key={j} style={{fontFamily:bodyFont,fontSize:'10pt'}}>{b}</li>)}</ul>}</div>)}</div>}
        {data.awards?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Awards &amp; Honors</SectionTitle><ul style={{margin:0,paddingLeft:'0.2in'}}>{data.awards.map((a,i)=><li key={i} style={{fontFamily:bodyFont,fontSize:'10pt',color:'#1c1c1c',marginBottom:'0.03in'}}>{a}</li>)}</ul></div>}
      </div>
    </div>
  );
}

function LayoutEditorial({ data, template, accent, accent2 }) {
  const { bodyFont, nameFont, photoShape, sectionDeco } = template; const s = data.summary || {}; const a2 = accent2||template.accent2;
  return (
    <div style={{ width:'8.5in',minHeight:'11in',background:'#FEFEFE',fontFamily:bodyFont,boxSizing:'border-box',boxShadow:'0 12px 40px -10px rgba(0,0,0,0.12)' }}>
      <div style={{ padding:'0.55in 0.7in 0.3in',boxSizing:'border-box',borderBottom:`1px solid ${hexToRgba(accent,0.15)}`,position:'relative' }}>
        <div style={{ display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:'0.3in' }}>
          <div style={{ flex:1 }}>
            <h1 style={{ fontFamily:nameFont,fontSize:'42pt',fontWeight:700,color:'#111',margin:0,lineHeight:1.0,letterSpacing:'-0.02em' }}>{data.name||'Your Name'}</h1>
            {s.tagline&&<div style={{ fontFamily:bodyFont,fontSize:'10.5pt',color:accent,marginTop:'0.08in',fontStyle:'italic' }}>{s.tagline}</div>}
          </div>
          <div style={{ display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'0.1in' }}>
            <ResumePhoto src={data.photo} shape={photoShape} size="1.1in" border={hexToRgba(accent,0.3)} />
            <ContactLine data={data} separator=" · " style={{ fontFamily:bodyFont,fontSize:'8pt',color:'#666',textAlign:'right',maxWidth:'2.5in',lineHeight:1.6 }} />
          </div>
        </div>
        <div style={{ display:'flex',alignItems:'center',gap:'0.1in',marginTop:'0.2in' }}>
          <div style={{ width:'0.4in',height:'3px',background:accent }} />
          <div style={{ flex:1,height:'1px',background:hexToRgba(accent,0.15) }} />
          {a2&&<div style={{ width:'0.15in',height:'3px',background:a2 }}/>}
        </div>
      </div>
      <div style={{ padding:'0.3in 0.7in 0.6in',boxSizing:'border-box' }}>
        {(s.bullets?.length>0||s.skills?.length>0)&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Summary</SectionTitle>{s.bullets?.map((b,i)=><div key={i} style={{ fontFamily:bodyFont,fontSize:'10.5pt',color:'#333',marginBottom:'0.04in',fontStyle:'italic' }}>{b}</div>)}{s.skills?.length>0&&<div style={{ fontFamily:bodyFont,fontSize:'10pt',color:'#444',marginTop:'0.06in' }}>{s.skills.join('  ·  ')}</div>}</div>}
        {renderSections(data, bodyFont, accent, sectionDeco, a2, true)}
      </div>
    </div>
  );
}

function LayoutColorSidebar({ data, template, accent }) {
  const { bodyFont, nameFont, photoShape, sectionDeco } = template; const s = data.summary || {};
  return (
    <div style={{ width:'8.5in',minHeight:'11in',background:'#FAFAFA',fontFamily:bodyFont,display:'flex',boxSizing:'border-box',boxShadow:'0 12px 40px -10px rgba(0,0,0,0.18)' }}>
      <div style={{ width:'2.6in',background:accent,padding:'0.5in 0.32in',boxSizing:'border-box',flexShrink:0 }}>
        <div style={{ display:'flex',justifyContent:'center',marginBottom:'0.2in' }}><ResumePhoto src={data.photo} shape={photoShape} size="1.15in" border="rgba(255,255,255,0.35)" /></div>
        <div style={{ fontFamily:nameFont,fontSize:'18pt',fontWeight:700,color:'#fff',lineHeight:1.15,letterSpacing:'-0.01em',wordBreak:'break-word' }}>{data.name||'Your Name'}</div>
        {s.tagline&&<div style={{ fontFamily:bodyFont,fontSize:'8.5pt',color:'rgba(255,255,255,0.72)',marginTop:'0.07in',fontStyle:'italic',lineHeight:1.45 }}>{s.tagline}</div>}
        <div style={{ marginTop:'0.2in',borderTop:'1px solid rgba(255,255,255,0.18)',paddingTop:'0.18in' }}>
          <div style={{ fontFamily:bodyFont,fontSize:'7pt',textTransform:'uppercase',letterSpacing:'0.2em',color:'rgba(255,255,255,0.45)',marginBottom:'0.1in' }}>Contact</div>
          <ContactStack data={data} style={{ fontFamily:bodyFont,fontSize:'8.5pt',color:'rgba(255,255,255,0.85)',lineHeight:1.55 }} labelStyle={{}} />
        </div>
        {s.skills?.length>0&&<div style={{ marginTop:'0.2in',borderTop:'1px solid rgba(255,255,255,0.18)',paddingTop:'0.18in' }}><div style={{ fontFamily:bodyFont,fontSize:'7pt',textTransform:'uppercase',letterSpacing:'0.2em',color:'rgba(255,255,255,0.45)',marginBottom:'0.1in' }}>Skills</div><div style={{ display:'flex',flexWrap:'wrap',gap:'0.05in' }}>{s.skills.map((sk,i)=><span key={i} style={{ fontFamily:bodyFont,fontSize:'8pt',background:'rgba(255,255,255,0.12)',color:'rgba(255,255,255,0.9)',padding:'0.03in 0.09in',borderRadius:'3px',fontWeight:500 }}>{sk}</span>)}</div></div>}
        {data.certifications?.length>0&&<div style={{ marginTop:'0.2in',borderTop:'1px solid rgba(255,255,255,0.18)',paddingTop:'0.18in' }}><div style={{ fontFamily:bodyFont,fontSize:'7pt',textTransform:'uppercase',letterSpacing:'0.2em',color:'rgba(255,255,255,0.45)',marginBottom:'0.1in' }}>Certifications</div>{data.certifications.map((c,i)=><div key={i} style={{ fontFamily:bodyFont,fontSize:'8pt',color:'rgba(255,255,255,0.85)',marginBottom:'0.07in' }}><div style={{fontWeight:600}}>{c.name}</div>{c.org&&<div style={{color:'rgba(255,255,255,0.6)'}}>{c.org}</div>}{c.date&&<div style={{color:'rgba(255,255,255,0.45)'}}>{c.date}</div>}</div>)}</div>}
        {data.education?.length>0&&<div style={{ marginTop:'0.2in',borderTop:'1px solid rgba(255,255,255,0.18)',paddingTop:'0.18in' }}><div style={{ fontFamily:bodyFont,fontSize:'7pt',textTransform:'uppercase',letterSpacing:'0.2em',color:'rgba(255,255,255,0.45)',marginBottom:'0.1in' }}>Education</div>{data.education.map((ed,i)=><div key={i} style={{ fontFamily:bodyFont,fontSize:'8pt',color:'rgba(255,255,255,0.85)',marginBottom:'0.08in' }}><div style={{fontWeight:600}}>{ed.degree}</div>{ed.school&&<div style={{color:'rgba(255,255,255,0.65)'}}>{ed.school}</div>}{ed.date&&<div style={{color:'rgba(255,255,255,0.45)'}}>{ed.date}</div>}</div>)}</div>}
      </div>
      <div style={{ flex:1,padding:'0.5in 0.5in 0.6in 0.4in',boxSizing:'border-box' }}>
        {s.bullets?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Profile</SectionTitle>{s.bullets.map((b,i)=><div key={i} style={{ fontFamily:bodyFont,fontSize:'10.5pt',color:'#333',marginBottom:'0.04in',lineHeight:1.55 }}>{b}</div>)}</div>}
        {data.experience?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Experience</SectionTitle>{data.experience.map((exp,i)=><ExperienceBlock key={i} exp={exp} bodyFont={bodyFont} accent={accent} i={i} total={data.experience.length} />)}</div>}
        {data.projects?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Projects</SectionTitle>{data.projects.map((p,i)=><div key={i} style={{marginBottom:'0.1in'}}><div style={{fontFamily:bodyFont,fontWeight:700,fontSize:'10.5pt'}}>{p.name}</div>{p.description&&<div style={{fontFamily:bodyFont,fontSize:'10pt',color:'#444',margin:'0.02in 0'}}>{p.description}</div>}{p.bullets?.length>0&&<ul style={{margin:'0.02in 0 0',paddingLeft:'0.2in'}}>{p.bullets.map((b,j)=><li key={j} style={{fontFamily:bodyFont,fontSize:'10pt'}}>{b}</li>)}</ul>}</div>)}</div>}
        {data.awards?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Awards &amp; Honors</SectionTitle><ul style={{margin:0,paddingLeft:'0.2in'}}>{data.awards.map((a,i)=><li key={i} style={{fontFamily:bodyFont,fontSize:'10pt',color:'#1c1c1c',marginBottom:'0.03in'}}>{a}</li>)}</ul></div>}
      </div>
    </div>
  );
}

function LayoutTwoToneHeader({ data, template, accent }) {
  const { bodyFont, nameFont, photoShape, sectionDeco } = template; const s = data.summary || {};
  return (
    <div style={{ width:'8.5in',minHeight:'11in',background:'#FAFAFA',fontFamily:bodyFont,boxSizing:'border-box',boxShadow:'0 12px 40px -10px rgba(0,0,0,0.18)' }}>
      <div style={{ display:'flex',height:'1.6in' }}>
        <div style={{ background:accent,flex:'0 0 2.8in',display:'flex',alignItems:'center',justifyContent:'center' }}><ResumePhoto src={data.photo} shape={photoShape} size="1.1in" border="rgba(255,255,255,0.35)" /></div>
        <div style={{ flex:1,background:hexToRgba(accent,0.06),padding:'0.3in 0.5in',display:'flex',flexDirection:'column',justifyContent:'center',borderBottom:`3px solid ${accent}` }}>
          <h1 style={{ fontFamily:nameFont,fontSize:'26pt',fontWeight:700,color:accent,margin:0,lineHeight:1.1 }}>{data.name||'Your Name'}</h1>
          {s.tagline&&<div style={{ fontFamily:bodyFont,fontSize:'10pt',color:'#555',marginTop:'0.07in',fontStyle:'italic' }}>{s.tagline}</div>}
          <ContactLine data={data} separator="  ·  " style={{ fontFamily:bodyFont,fontSize:'8.5pt',color:'#666',marginTop:'0.08in' }} />
        </div>
      </div>
      <div style={{ padding:'0.38in 0.6in 0.6in',boxSizing:'border-box' }}>{renderSections(data, bodyFont, accent, sectionDeco)}</div>
    </div>
  );
}

function LayoutStructuredCols({ data, template, accent }) {
  const { bodyFont, nameFont, photoShape, sectionDeco } = template; const s = data.summary || {};
  return (
    <div style={{ width:'8.5in',minHeight:'11in',background:'#FAFAFA',fontFamily:bodyFont,boxSizing:'border-box',boxShadow:'0 12px 40px -10px rgba(0,0,0,0.18)' }}>
      <div style={{ padding:'0.5in 0.65in 0.3in',boxSizing:'border-box',background:'#fff',borderBottom:`2px solid ${hexToRgba(accent,0.12)}` }}>
        <div style={{ display:'flex',alignItems:'center',gap:'0.3in' }}>
          <ResumePhoto src={data.photo} shape={photoShape} size="1in" border={hexToRgba(accent,0.3)} />
          <div style={{ flex:1 }}>
            <h1 style={{ fontFamily:nameFont,fontSize:'28pt',fontWeight:700,color:'#111',margin:0,lineHeight:1.1 }}>{data.name||'Your Name'}</h1>
            {s.tagline&&<div style={{ fontFamily:bodyFont,fontSize:'10.5pt',color:accent,marginTop:'0.06in',fontWeight:500 }}>{s.tagline}</div>}
            <ContactLine data={data} separator="  |  " style={{ fontFamily:bodyFont,fontSize:'8.5pt',color:'#666',marginTop:'0.09in' }} />
          </div>
        </div>
      </div>
      <div style={{ display:'flex',padding:'0.35in 0.65in 0.6in',gap:'0.4in',boxSizing:'border-box' }}>
        <div style={{ width:'2.1in',flexShrink:0 }}>
          {s.skills?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Skills</SectionTitle>{s.skills.map((sk,i)=><div key={i} style={{ fontFamily:bodyFont,fontSize:'9pt',color:'#333',marginBottom:'0.04in',paddingLeft:'0.08in',borderLeft:`2px solid ${hexToRgba(accent,0.3)}` }}>{sk}</div>)}</div>}
          {data.certifications?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Credentials</SectionTitle>{data.certifications.map((c,i)=><div key={i} style={{ fontFamily:bodyFont,fontSize:'8.5pt',color:'#333',marginBottom:'0.08in' }}><div style={{fontWeight:600,fontSize:'9pt'}}>{c.name}</div>{c.org&&<div style={{color:'#666'}}>{c.org}</div>}{c.date&&<div style={{color:accent,fontWeight:500}}>{c.date}</div>}</div>)}</div>}
          {data.education?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Education</SectionTitle>{data.education.map((ed,i)=><div key={i} style={{ fontFamily:bodyFont,fontSize:'8.5pt',color:'#333',marginBottom:'0.1in' }}><div style={{fontWeight:600,fontSize:'9pt'}}>{ed.degree}</div>{ed.school&&<div>{ed.school}</div>}{ed.date&&<div style={{color:accent,fontWeight:500}}>{ed.date}</div>}{ed.honors&&<div style={{fontStyle:'italic',color:'#666'}}>{ed.honors}</div>}</div>)}</div>}
          {data.awards?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Awards</SectionTitle><ul style={{margin:0,paddingLeft:'0.15in'}}>{data.awards.map((a,i)=><li key={i} style={{fontFamily:bodyFont,fontSize:'8.5pt',color:'#333',marginBottom:'0.04in'}}>{a}</li>)}</ul></div>}
        </div>
        <div style={{ flex:1 }}>
          {s.bullets?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Summary</SectionTitle>{s.bullets.map((b,i)=><div key={i} style={{ fontFamily:bodyFont,fontSize:'10.5pt',color:'#333',marginBottom:'0.05in' }}>{b}</div>)}</div>}
          {data.experience?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Experience</SectionTitle>{data.experience.map((exp,i)=><ExperienceBlock key={i} exp={exp} bodyFont={bodyFont} accent={accent} i={i} total={data.experience.length} />)}</div>}
          {data.projects?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Projects</SectionTitle>{data.projects.map((p,i)=><div key={i} style={{marginBottom:'0.1in'}}><div style={{fontFamily:bodyFont,fontWeight:700,fontSize:'10.5pt'}}>{p.name}</div>{p.description&&<div style={{fontFamily:bodyFont,fontSize:'10pt',color:'#444',margin:'0.02in 0'}}>{p.description}</div>}{p.bullets?.length>0&&<ul style={{margin:'0.02in 0 0',paddingLeft:'0.2in'}}>{p.bullets.map((b,j)=><li key={j} style={{fontFamily:bodyFont,fontSize:'10pt'}}>{b}</li>)}</ul>}</div>)}</div>}
        </div>
      </div>
    </div>
  );
}

function LayoutFolio({ data, template, accent }) {
  const { bodyFont, nameFont, photoShape, sectionDeco } = template; const s = data.summary || {};
  return (
    <div style={{ width:'8.5in',minHeight:'11in',background:'#FEFDF9',fontFamily:bodyFont,boxSizing:'border-box',boxShadow:'0 12px 40px -10px rgba(0,0,0,0.14)' }}>
      <div style={{ padding:'0.6in 0.75in 0.35in',boxSizing:'border-box',textAlign:'center',position:'relative',borderBottom:`1px solid ${hexToRgba(accent,0.2)}` }}>
        <div style={{ position:'absolute',top:'0.5in',right:'0.7in' }}><ResumePhoto src={data.photo} shape={photoShape} size="1in" border={hexToRgba(accent,0.3)} /></div>
        <h1 style={{ fontFamily:nameFont,fontSize:'34pt',fontWeight:700,color:'#111',margin:0,lineHeight:1.1 }}>{data.name||'Your Name'}</h1>
        {s.tagline&&<div style={{ fontFamily:bodyFont,fontSize:'11pt',color:'#555',marginTop:'0.09in',fontStyle:'italic' }}>{s.tagline}</div>}
        <ContactLine data={data} separator="  ·  " style={{ fontFamily:bodyFont,fontSize:'9pt',color:'#666',marginTop:'0.12in' }} />
        <div style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:'0.12in',marginTop:'0.2in' }}><div style={{ width:'0.6in',height:'1px',background:hexToRgba(accent,0.3) }}/><div style={{ width:'6px',height:'6px',background:accent,transform:'rotate(45deg)' }}/><div style={{ width:'0.6in',height:'1px',background:hexToRgba(accent,0.3) }}/></div>
      </div>
      <div style={{ padding:'0.35in 0.75in 0.6in',boxSizing:'border-box' }}>{renderSections(data, bodyFont, accent, sectionDeco)}</div>
    </div>
  );
}

function LayoutCvDense({ data, template, accent }) {
  const { bodyFont, nameFont, photoShape, sectionDeco } = template; const s = data.summary || {};
  return (
    <div style={{ width:'8.5in',minHeight:'11in',background:'#FAFAFA',fontFamily:bodyFont,display:'flex',boxSizing:'border-box',boxShadow:'0 12px 40px -10px rgba(0,0,0,0.18)' }}>
      <div style={{ width:'2.1in',background:hexToRgba(accent,0.05),borderRight:`2px solid ${hexToRgba(accent,0.12)}`,padding:'0.5in 0.28in',boxSizing:'border-box',flexShrink:0 }}>
        <ResumePhoto src={data.photo} shape={photoShape} size="0.95in" border={hexToRgba(accent,0.3)} />
        <div style={{ marginTop:'0.15in',fontFamily:nameFont,fontSize:'13pt',fontWeight:700,color:'#111',lineHeight:1.2,wordBreak:'break-word' }}>{data.name||'Your Name'}</div>
        {s.tagline&&<div style={{ fontFamily:bodyFont,fontSize:'8pt',color:'#666',marginTop:'0.07in',fontStyle:'italic',lineHeight:1.4 }}>{s.tagline}</div>}
        <div style={{ marginTop:'0.18in',borderTop:`1px solid ${hexToRgba(accent,0.2)}`,paddingTop:'0.15in' }}><ContactStack data={data} style={{ fontFamily:bodyFont,fontSize:'8pt',color:'#444',lineHeight:1.5 }} labelStyle={{ fontSize:'7pt',textTransform:'uppercase',letterSpacing:'0.1em',color:'#999' }} /></div>
        {s.skills?.length>0&&<div style={{ marginTop:'0.18in',borderTop:`1px solid ${hexToRgba(accent,0.2)}`,paddingTop:'0.15in' }}><div style={{ fontFamily:bodyFont,fontSize:'7pt',textTransform:'uppercase',letterSpacing:'0.15em',color:accent,fontWeight:700,marginBottom:'0.08in' }}>Expertise</div>{s.skills.map((sk,i)=><div key={i} style={{ fontFamily:bodyFont,fontSize:'8.5pt',color:'#333',marginBottom:'0.04in' }}>{sk}</div>)}</div>}
        {data.education?.length>0&&<div style={{ marginTop:'0.18in',borderTop:`1px solid ${hexToRgba(accent,0.2)}`,paddingTop:'0.15in' }}><div style={{ fontFamily:bodyFont,fontSize:'7pt',textTransform:'uppercase',letterSpacing:'0.15em',color:accent,fontWeight:700,marginBottom:'0.08in' }}>Education</div>{data.education.map((ed,i)=><div key={i} style={{ fontFamily:bodyFont,fontSize:'8pt',color:'#333',marginBottom:'0.1in' }}><div style={{fontWeight:600}}>{ed.degree}</div>{ed.school&&<div style={{color:'#555'}}>{ed.school}</div>}{ed.date&&<div style={{color:accent,fontWeight:500}}>{ed.date}</div>}{ed.honors&&<div style={{fontStyle:'italic',color:'#777'}}>{ed.honors}</div>}</div>)}</div>}
      </div>
      <div style={{ flex:1,padding:'0.5in 0.5in 0.6in 0.38in',boxSizing:'border-box' }}>
        {s.bullets?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Research Profile</SectionTitle>{s.bullets.map((b,i)=><div key={i} style={{ fontFamily:bodyFont,fontSize:'10.5pt',color:'#333',marginBottom:'0.05in',lineHeight:1.6 }}>{b}</div>)}</div>}
        {data.experience?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Experience</SectionTitle>{data.experience.map((exp,i)=><ExperienceBlock key={i} exp={exp} bodyFont={bodyFont} accent={accent} i={i} total={data.experience.length} density="compact" />)}</div>}
        {data.certifications?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Certifications</SectionTitle><ul style={{margin:0,paddingLeft:'0.2in'}}>{data.certifications.map((c,i)=><li key={i} style={{fontFamily:bodyFont,fontSize:'10pt',color:'#1c1c1c',marginBottom:'0.03in'}}><span style={{fontWeight:600}}>{c.name}</span>{c.org&&`, ${c.org}`}{c.date&&<span style={{color:'#666'}}> ({c.date})</span>}</li>)}</ul></div>}
        {data.projects?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Projects &amp; Publications</SectionTitle>{data.projects.map((p,i)=><div key={i} style={{marginBottom:'0.09in'}}><div style={{fontFamily:bodyFont,fontWeight:700,fontSize:'10.5pt'}}>{p.name}</div>{p.description&&<div style={{fontFamily:bodyFont,fontSize:'10pt',color:'#444',margin:'0.02in 0',fontStyle:'italic'}}>{p.description}</div>}{p.bullets?.length>0&&<ul style={{margin:'0.02in 0 0',paddingLeft:'0.2in'}}>{p.bullets.map((b,j)=><li key={j} style={{fontFamily:bodyFont,fontSize:'10pt'}}>{b}</li>)}</ul>}</div>)}</div>}
        {data.awards?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Honors &amp; Awards</SectionTitle><ul style={{margin:0,paddingLeft:'0.2in'}}>{data.awards.map((a,i)=><li key={i} style={{fontFamily:bodyFont,fontSize:'10pt',color:'#1c1c1c',marginBottom:'0.03in'}}>{a}</li>)}</ul></div>}
      </div>
    </div>
  );
}

function LayoutDiagonalBand({ data, template, accent, accent2 }) {
  const { bodyFont, nameFont, photoShape, sectionDeco } = template; const a2 = accent2||template.accent2; const s = data.summary || {};
  return (
    <div style={{ width:'8.5in',minHeight:'11in',background:'#F8F8F8',fontFamily:bodyFont,boxSizing:'border-box',boxShadow:'0 12px 40px -10px rgba(0,0,0,0.22)' }}>
      <div style={{ position:'relative',overflow:'hidden',height:'1.8in',background:accent }}>
        <div style={{ position:'absolute',top:0,right:0,width:'40%',height:'100%',background:a2||'#555',clipPath:'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)' }} />
        <div style={{ position:'absolute',bottom:0,left:0,right:0,height:'4px',background:a2||'#555' }} />
        <div style={{ position:'relative',display:'flex',alignItems:'center',gap:'0.3in',padding:'0.3in 0.65in',height:'100%',boxSizing:'border-box' }}>
          <ResumePhoto src={data.photo} shape={photoShape} size="1.1in" border="rgba(255,255,255,0.35)" />
          <div>
            <h1 style={{ fontFamily:nameFont,fontSize:'30pt',fontWeight:800,color:'#fff',margin:0,lineHeight:1.0,letterSpacing:'0.04em',textTransform:'uppercase' }}>{data.name||'Your Name'}</h1>
            {s.tagline&&<div style={{ fontFamily:bodyFont,fontSize:'9.5pt',color:'rgba(255,255,255,0.72)',marginTop:'0.07in' }}>{s.tagline}</div>}
            <ContactLine data={data} separator="  ·  " style={{ fontFamily:bodyFont,fontSize:'8.5pt',color:'rgba(255,255,255,0.68)',marginTop:'0.07in' }} />
          </div>
        </div>
      </div>
      <div style={{ padding:'0.38in 0.65in 0.6in',boxSizing:'border-box' }}>{renderSections(data, bodyFont, accent, sectionDeco, a2)}</div>
    </div>
  );
}

function LayoutSidebarClassic({ data, template, accent }) {
  const { bodyFont, nameFont, photoShape, sectionDeco } = template; const s = data.summary || {};
  return (
    <div style={{ width:'8.5in',minHeight:'11in',background:'#FAFAFA',fontFamily:bodyFont,display:'flex',boxSizing:'border-box',boxShadow:'0 12px 40px -10px rgba(0,0,0,0.18)' }}>
      <div style={{ width:'2.45in',background:accent,padding:'0.55in 0.3in',boxSizing:'border-box',flexShrink:0 }}>
        <div style={{ display:'flex',justifyContent:'center',marginBottom:'0.18in' }}><ResumePhoto src={data.photo} shape={photoShape} size="1.05in" border="rgba(255,255,255,0.3)" /></div>
        <div style={{ fontFamily:nameFont,fontSize:'18pt',fontWeight:800,color:'#fff',lineHeight:1.15,marginBottom:'0.06in',letterSpacing:'-0.01em',wordBreak:'break-word' }}>{data.name||'Your Name'}</div>
        {s.tagline&&<div style={{ fontSize:'8.5pt',color:'rgba(255,255,255,0.72)',marginBottom:'0.22in',lineHeight:1.45,fontStyle:'italic' }}>{s.tagline}</div>}
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.2)',paddingTop:'0.15in' }}>
          <div style={{ fontSize:'7pt',textTransform:'uppercase',letterSpacing:'0.18em',color:'rgba(255,255,255,0.45)',marginBottom:'0.08in' }}>Contact</div>
          <ContactStack data={data} style={{ fontSize:'8.5pt',color:'rgba(255,255,255,0.88)',lineHeight:1.55,fontFamily:bodyFont }} labelStyle={{ fontSize:'7.5pt',color:'rgba(255,255,255,0.5)',textTransform:'uppercase',letterSpacing:'0.1em' }} />
        </div>
        {s.skills?.length>0&&<div style={{ marginTop:'0.18in',borderTop:'1px solid rgba(255,255,255,0.2)',paddingTop:'0.15in' }}><div style={{ fontSize:'7pt',textTransform:'uppercase',letterSpacing:'0.18em',color:'rgba(255,255,255,0.45)',marginBottom:'0.08in' }}>Skills</div>{s.skills.map((sk,i)=><div key={i} style={{ fontSize:'8.5pt',color:'rgba(255,255,255,0.88)',marginBottom:'0.025in',display:'flex',alignItems:'center',gap:'0.06in' }}><span style={{ width:'4px',height:'4px',borderRadius:'50%',background:'rgba(255,255,255,0.5)',flexShrink:0,display:'inline-block' }}/>{sk}</div>)}</div>}
        {data.certifications?.length>0&&<div style={{ marginTop:'0.18in',borderTop:'1px solid rgba(255,255,255,0.2)',paddingTop:'0.15in' }}><div style={{ fontSize:'7pt',textTransform:'uppercase',letterSpacing:'0.18em',color:'rgba(255,255,255,0.45)',marginBottom:'0.08in' }}>Certifications</div>{data.certifications.map((c,i)=><div key={i} style={{ fontFamily:bodyFont,fontSize:'8pt',color:'rgba(255,255,255,0.88)',marginBottom:'0.07in' }}><div style={{fontWeight:600}}>{c.name}</div>{c.org&&<div style={{color:'rgba(255,255,255,0.6)'}}>{c.org}</div>}{c.date&&<div style={{color:'rgba(255,255,255,0.5)'}}>{c.date}</div>}</div>)}</div>}
        {data.education?.length>0&&<div style={{ marginTop:'0.18in',borderTop:'1px solid rgba(255,255,255,0.2)',paddingTop:'0.15in' }}><div style={{ fontSize:'7pt',textTransform:'uppercase',letterSpacing:'0.18em',color:'rgba(255,255,255,0.45)',marginBottom:'0.08in' }}>Education</div>{data.education.map((ed,i)=><div key={i} style={{ fontFamily:bodyFont,fontSize:'8pt',color:'rgba(255,255,255,0.88)',marginBottom:'0.08in' }}><div style={{fontWeight:600}}>{ed.degree}</div>{ed.school&&<div style={{color:'rgba(255,255,255,0.7)'}}>{ed.school}</div>}{ed.date&&<div style={{color:'rgba(255,255,255,0.55)'}}>{ed.date}</div>}</div>)}</div>}
      </div>
      <div style={{ flex:1,padding:'0.55in 0.45in 0.55in 0.4in',boxSizing:'border-box' }}>
        {s.bullets?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Summary</SectionTitle><ul style={{margin:0,paddingLeft:'0.2in'}}>{s.bullets.map((b,i)=><li key={i} style={{marginBottom:'0.04in',fontSize:'10pt',color:'#1c1c1c',fontFamily:bodyFont}}>{b}</li>)}</ul></div>}
        {data.experience?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Experience</SectionTitle>{data.experience.map((exp,i)=><ExperienceBlock key={i} exp={exp} bodyFont={bodyFont} accent={accent} i={i} total={data.experience.length} />)}</div>}
        {data.projects?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Projects</SectionTitle>{data.projects.map((p,i)=><div key={i} style={{marginBottom:'0.1in'}}><div style={{fontFamily:bodyFont,fontWeight:700,fontSize:'10.5pt'}}>{p.name}</div>{p.description&&<div style={{fontFamily:bodyFont,fontSize:'10pt',color:'#444',margin:'0.02in 0'}}>{p.description}</div>}{p.bullets?.length>0&&<ul style={{margin:'0.02in 0 0',paddingLeft:'0.2in'}}>{p.bullets.map((b,j)=><li key={j} style={{fontFamily:bodyFont,fontSize:'10pt'}}>{b}</li>)}</ul>}</div>)}</div>}
        {data.awards?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Awards &amp; Honors</SectionTitle><ul style={{margin:0,paddingLeft:'0.2in'}}>{data.awards.map((a,i)=><li key={i} style={{fontFamily:bodyFont,fontSize:'10pt',color:'#1c1c1c',marginBottom:'0.03in'}}>{a}</li>)}</ul></div>}
      </div>
    </div>
  );
}

function LayoutHeaderBand({ data, template, accent }) {
  const { bodyFont, nameFont, photoShape, sectionDeco } = template; const s = data.summary || {};
  return (
    <div style={{ width:'8.5in',minHeight:'11in',background:'#FAFAFA',fontFamily:bodyFont,boxSizing:'border-box',boxShadow:'0 12px 40px -10px rgba(0,0,0,0.18)' }}>
      <div style={{ background:accent,padding:'0.42in 0.75in 0.38in',boxSizing:'border-box',display:'flex',alignItems:'center',gap:'0.3in' }}>
        <ResumePhoto src={data.photo} shape={photoShape} size="1in" border="rgba(255,255,255,0.3)" />
        <div style={{ flex:1,textAlign:'center' }}>
          <div style={{ fontFamily:nameFont,fontSize:'34pt',fontWeight:800,color:'#fff',letterSpacing:'-0.02em',lineHeight:1.1 }}>{data.name||'Your Name'}</div>
          <ContactLine data={data} separator="  ·  " style={{ color:'rgba(255,255,255,0.75)',fontSize:'9pt',marginTop:'0.12in',fontFamily:bodyFont }} />
          {s.tagline&&<div style={{ color:'rgba(255,255,255,0.65)',fontSize:'10pt',marginTop:'0.09in',fontStyle:'italic',fontFamily:bodyFont }}>{s.tagline}</div>}
        </div>
      </div>
      <div style={{ padding:'0.45in 0.75in 0.65in',boxSizing:'border-box' }}>{renderSections(data, bodyFont, accent, sectionDeco)}</div>
    </div>
  );
}

/* ============================================================
   NEW LAYOUTS — ATS, Student, Executive, Finance/Legal,
   Hospitality, Fitness, Real Estate, Freelancer
   ============================================================ */

/* ── ATS Single Column (Signal) — pure single col, accent name only ── */
function LayoutAtsSingleCol({ data, template, accent }) {
  const { bodyFont, nameFont, sectionDeco } = template; const s = data.summary || {};
  const tc = '#111'; const sc = '#555';
  return (
    <div style={{ width:'8.5in', minHeight:'11in', background:'#fff', fontFamily:bodyFont, boxSizing:'border-box', boxShadow:'0 12px 40px -10px rgba(0,0,0,0.12)', padding:'0.65in 0.8in 0.7in' }}>
      <div style={{ borderBottom:`2px solid ${accent}`, paddingBottom:'0.18in', marginBottom:'0.22in' }}>
        <h1 style={{ fontFamily:nameFont, fontSize:'26pt', fontWeight:700, color:accent, margin:0, lineHeight:1.1 }}>{data.name||'Your Name'}</h1>
        {s.tagline&&<div style={{ fontFamily:bodyFont, fontSize:'10.5pt', color:sc, marginTop:'0.05in', fontStyle:'italic' }}>{s.tagline}</div>}
        <ContactLine data={data} separator='  ·  ' style={{ fontFamily:bodyFont, fontSize:'9pt', color:sc, marginTop:'0.08in' }} />
      </div>
      {(s.bullets?.length>0||s.skills?.length>0)&&<div style={{ marginBottom:'0.18in' }}>
        <div style={{ fontFamily:bodyFont, fontSize:'9pt', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.15em', color:accent, marginBottom:'0.06in' }}>Summary</div>
        {s.bullets?.map((b,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:'10pt', color:tc, marginBottom:'0.04in', lineHeight:1.6 }}>{b}</div>)}
        {s.skills?.length>0&&<div style={{ fontFamily:bodyFont, fontSize:'10pt', color:tc, marginTop:'0.06in' }}><span style={{ fontWeight:600 }}>Skills: </span>{s.skills.join(', ')}</div>}
      </div>}
      {data.experience?.length>0&&<div style={{ marginBottom:'0.18in' }}>
        <div style={{ fontFamily:bodyFont, fontSize:'9pt', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.15em', color:accent, borderBottom:`1px solid ${hexToRgba(accent,0.25)}`, paddingBottom:'0.04in', marginBottom:'0.1in' }}>Experience</div>
        {data.experience.map((exp,i)=><div key={i} style={{ marginBottom:'0.13in' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
            <div style={{ fontFamily:bodyFont, fontWeight:700, fontSize:'10.5pt', color:tc }}>{exp.title}{exp.company&&<span style={{ fontWeight:400, color:sc }}> — {exp.company}</span>}{exp.location&&<span style={{ fontWeight:400, color:sc, fontSize:'9.5pt' }}>, {exp.location}</span>}</div>
            <div style={{ fontFamily:bodyFont, fontSize:'9.5pt', color:sc, whiteSpace:'nowrap', flexShrink:0 }}>{[exp.start,exp.end].filter(Boolean).join(' – ')}</div>
          </div>
          {exp.bullets?.length>0&&<ul style={{ margin:'0.03in 0 0', paddingLeft:'0.2in' }}>{exp.bullets.map((b,j)=><li key={j} style={{ fontFamily:bodyFont, fontSize:'10pt', color:tc, marginBottom:'0.02in', lineHeight:1.55 }}>{b}</li>)}</ul>}
        </div>)}
      </div>}
      {data.education?.length>0&&<div style={{ marginBottom:'0.18in' }}>
        <div style={{ fontFamily:bodyFont, fontSize:'9pt', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.15em', color:accent, borderBottom:`1px solid ${hexToRgba(accent,0.25)}`, paddingBottom:'0.04in', marginBottom:'0.1in' }}>Education</div>
        {data.education.map((ed,i)=><div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:'0.08in' }}>
          <div style={{ fontFamily:bodyFont, fontSize:'10.5pt', color:tc }}><span style={{ fontWeight:700 }}>{ed.degree}</span>{ed.school&&<span style={{ fontWeight:400, color:sc }}> — {ed.school}</span>}{ed.honors&&<div style={{ fontStyle:'italic', color:sc, fontSize:'9.5pt' }}>{ed.honors}</div>}</div>
          <div style={{ fontFamily:bodyFont, fontSize:'9.5pt', color:sc, whiteSpace:'nowrap', flexShrink:0 }}>{ed.date}</div>
        </div>)}
      </div>}
      {data.certifications?.length>0&&<div style={{ marginBottom:'0.18in' }}>
        <div style={{ fontFamily:bodyFont, fontSize:'9pt', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.15em', color:accent, borderBottom:`1px solid ${hexToRgba(accent,0.25)}`, paddingBottom:'0.04in', marginBottom:'0.1in' }}>Certifications</div>
        <ul style={{ margin:0, paddingLeft:'0.2in' }}>{data.certifications.map((c,i)=><li key={i} style={{ fontFamily:bodyFont, fontSize:'10pt', color:tc, marginBottom:'0.03in' }}><span style={{ fontWeight:600 }}>{c.name}</span>{c.org&&` — ${c.org}`}{c.date&&<span style={{ color:sc }}> ({c.date})</span>}</li>)}</ul>
      </div>}
      {data.awards?.length>0&&<div>
        <div style={{ fontFamily:bodyFont, fontSize:'9pt', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.15em', color:accent, borderBottom:`1px solid ${hexToRgba(accent,0.25)}`, paddingBottom:'0.04in', marginBottom:'0.1in' }}>Awards &amp; Honors</div>
        <ul style={{ margin:0, paddingLeft:'0.2in' }}>{data.awards.map((a,i)=><li key={i} style={{ fontFamily:bodyFont, fontSize:'10pt', color:tc, marginBottom:'0.03in' }}>{a}</li>)}</ul>
      </div>}
    </div>
  );
}

/* ── ATS Lined Accent (Baseline) — left rule accent, single col ── */
function LayoutAtsLined({ data, template, accent }) {
  const { bodyFont, nameFont } = template; const s = data.summary || {};
  const tc = '#111'; const sc = '#555';
  const SecHead = ({ children }) => (
    <div style={{ display:'flex', alignItems:'center', gap:'0.1in', margin:'0.2in 0 0.08in' }}>
      <div style={{ fontFamily:bodyFont, fontSize:'8.5pt', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.18em', color:accent, whiteSpace:'nowrap' }}>{children}</div>
      <div style={{ flex:1, height:'1px', background:hexToRgba(accent,0.2) }} />
    </div>
  );
  return (
    <div style={{ width:'8.5in', minHeight:'11in', background:'#fff', fontFamily:bodyFont, boxSizing:'border-box', boxShadow:'0 12px 40px -10px rgba(0,0,0,0.12)', display:'flex' }}>
      <div style={{ width:'0.12in', background:accent, flexShrink:0 }} />
      <div style={{ flex:1, padding:'0.6in 0.75in 0.7in 0.5in', boxSizing:'border-box' }}>
        <h1 style={{ fontFamily:nameFont, fontSize:'28pt', fontWeight:700, color:'#111', margin:0, lineHeight:1.1, letterSpacing:'-0.01em' }}>{data.name||'Your Name'}</h1>
        {s.tagline&&<div style={{ fontFamily:bodyFont, fontSize:'10.5pt', color:accent, marginTop:'0.05in', fontWeight:500 }}>{s.tagline}</div>}
        <ContactLine data={data} separator='  ·  ' style={{ fontFamily:bodyFont, fontSize:'8.5pt', color:sc, marginTop:'0.07in' }} />
        {(s.bullets?.length>0||s.skills?.length>0)&&<><SecHead>Summary</SecHead>{s.bullets?.map((b,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:'10pt', color:tc, marginBottom:'0.04in', lineHeight:1.6 }}>{b}</div>)}{s.skills?.length>0&&<div style={{ fontFamily:bodyFont, fontSize:'10pt', color:tc, marginTop:'0.06in' }}><span style={{ fontWeight:600 }}>Core Skills: </span>{s.skills.join('  ·  ')}</div>}</>}
        {data.experience?.length>0&&<><SecHead>Experience</SecHead>{data.experience.map((exp,i)=><div key={i} style={{ marginBottom:'0.14in' }}><div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}><div style={{ fontFamily:bodyFont, fontWeight:700, fontSize:'10.5pt', color:tc }}>{exp.title}{exp.company&&<span style={{ fontWeight:400, color:sc }}> — {exp.company}</span>}</div><div style={{ fontSize:'9pt', color:sc, whiteSpace:'nowrap', flexShrink:0 }}>{[exp.start,exp.end].filter(Boolean).join(' – ')}</div></div>{exp.location&&<div style={{ fontSize:'9pt', color:sc }}>{exp.location}</div>}{exp.bullets?.length>0&&<ul style={{ margin:'0.04in 0 0', paddingLeft:'0.2in' }}>{exp.bullets.map((b,j)=><li key={j} style={{ fontSize:'10pt', color:tc, marginBottom:'0.02in', lineHeight:1.55 }}>{b}</li>)}</ul>}</div>)}</>}
        {data.education?.length>0&&<><SecHead>Education</SecHead>{data.education.map((ed,i)=><div key={i} style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.08in' }}><div><div style={{ fontFamily:bodyFont, fontWeight:700, fontSize:'10.5pt', color:tc }}>{ed.degree}{ed.school&&<span style={{ fontWeight:400, color:sc }}> — {ed.school}</span>}</div>{ed.honors&&<div style={{ fontSize:'9pt', color:sc, fontStyle:'italic' }}>{ed.honors}</div>}</div><div style={{ fontSize:'9pt', color:sc, whiteSpace:'nowrap', flexShrink:0 }}>{ed.date}</div></div>)}</>}
        {data.certifications?.length>0&&<><SecHead>Certifications</SecHead><ul style={{ margin:0, paddingLeft:'0.2in' }}>{data.certifications.map((c,i)=><li key={i} style={{ fontSize:'10pt', color:tc, marginBottom:'0.03in' }}><span style={{ fontWeight:600 }}>{c.name}</span>{c.org&&` — ${c.org}`}{c.date&&<span style={{ color:sc }}> ({c.date})</span>}</li>)}</ul></>}
        {data.projects?.length>0&&<><SecHead>Projects</SecHead>{data.projects.map((p,i)=><div key={i} style={{ marginBottom:'0.1in' }}><div style={{ fontWeight:700, fontSize:'10.5pt', color:tc }}>{p.name}</div>{p.description&&<div style={{ fontSize:'10pt', color:sc, margin:'0.02in 0', fontStyle:'italic' }}>{p.description}</div>}{p.bullets?.length>0&&<ul style={{ margin:'0.02in 0 0', paddingLeft:'0.2in' }}>{p.bullets.map((b,j)=><li key={j} style={{ fontSize:'10pt', color:tc }}>{b}</li>)}</ul>}</div>)}</>}
        {data.awards?.length>0&&<><SecHead>Awards &amp; Honors</SecHead><ul style={{ margin:0, paddingLeft:'0.2in' }}>{data.awards.map((a,i)=><li key={i} style={{ fontSize:'10pt', color:tc, marginBottom:'0.03in' }}>{a}</li>)}</ul></>}
      </div>
    </div>
  );
}

/* ── Student / Graduate (Launch) — education-first, clean, fresh ── */
function LayoutStudentFresh({ data, template, accent }) {
  const { bodyFont, nameFont, sectionDeco } = template; const s = data.summary || {};
  return (
    <div style={{ width:'8.5in', minHeight:'11in', background:'#FAFAFA', fontFamily:bodyFont, boxSizing:'border-box', boxShadow:'0 12px 40px -10px rgba(0,0,0,0.15)' }}>
      <div style={{ background:`linear-gradient(135deg, ${accent} 0%, ${lighten(accent,0.15)} 100%)`, padding:'0.45in 0.7in', boxSizing:'border-box' }}>
        <h1 style={{ fontFamily:nameFont, fontSize:'28pt', fontWeight:800, color:'#fff', margin:0, lineHeight:1.1 }}>{data.name||'Your Name'}</h1>
        {s.tagline&&<div style={{ fontFamily:bodyFont, fontSize:'10pt', color:'rgba(255,255,255,0.8)', marginTop:'0.06in', fontStyle:'italic' }}>{s.tagline}</div>}
        <ContactLine data={data} separator='  ·  ' style={{ color:'rgba(255,255,255,0.75)', fontSize:'8.5pt', marginTop:'0.1in', fontFamily:bodyFont }} />
      </div>
      <div style={{ padding:'0.35in 0.7in 0.6in', boxSizing:'border-box' }}>
        {data.education?.length>0&&<div style={{ marginBottom:'0.2in' }}>
          <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Education</SectionTitle>
          {data.education.map((ed,i)=><div key={i} style={{ background:`${hexToRgba(accent,0.04)}`, border:`1px solid ${hexToRgba(accent,0.12)}`, borderRadius:'4px', padding:'0.1in 0.15in', marginBottom:'0.1in' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
              <div style={{ fontFamily:bodyFont, fontWeight:700, fontSize:'10.5pt', color:'#111' }}>{ed.degree}</div>
              <div style={{ fontFamily:bodyFont, fontSize:'9.5pt', color:'#666', flexShrink:0 }}>{ed.date}</div>
            </div>
            <div style={{ fontFamily:bodyFont, fontSize:'10pt', color:accent, fontWeight:500 }}>{ed.school}{ed.location&&`, ${ed.location}`}</div>
            {ed.honors&&<div style={{ fontFamily:bodyFont, fontSize:'9.5pt', color:'#555', fontStyle:'italic', marginTop:'0.03in' }}>{ed.honors}</div>}
          </div>)}
        </div>}
        {(s.bullets?.length>0||s.skills?.length>0)&&<div style={{ marginBottom:'0.18in' }}>
          <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>About Me</SectionTitle>
          {s.bullets?.map((b,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:'10pt', color:'#333', marginBottom:'0.05in', lineHeight:1.6 }}>{b}</div>)}
          {s.skills?.length>0&&<div style={{ display:'flex', flexWrap:'wrap', gap:'0.05in', marginTop:'0.08in' }}>{s.skills.map((sk,i)=><span key={i} style={{ fontFamily:bodyFont, fontSize:'8.5pt', background:hexToRgba(accent,0.1), color:accent, padding:'0.02in 0.1in', borderRadius:'50px', fontWeight:600 }}>{sk}</span>)}</div>}
        </div>}
        {data.experience?.length>0&&<div style={{ marginBottom:'0.18in' }}>
          <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Experience</SectionTitle>
          {data.experience.map((exp,i)=><ExperienceBlock key={i} exp={exp} bodyFont={bodyFont} accent={accent} i={i} total={data.experience.length} />)}
        </div>}
        {data.projects?.length>0&&<div style={{ marginBottom:'0.18in' }}>
          <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Projects &amp; Activities</SectionTitle>
          {data.projects.map((p,i)=><div key={i} style={{ marginBottom:'0.1in' }}><div style={{ fontFamily:bodyFont, fontWeight:700, fontSize:'10.5pt', color:'#111' }}>{p.name}</div>{p.description&&<div style={{ fontFamily:bodyFont, fontSize:'10pt', color:'#555', margin:'0.02in 0' }}>{p.description}</div>}{p.bullets?.length>0&&<ul style={{ margin:'0.02in 0 0', paddingLeft:'0.2in' }}>{p.bullets.map((b,j)=><li key={j} style={{ fontFamily:bodyFont, fontSize:'10pt', color:'#1c1c1c' }}>{b}</li>)}</ul>}</div>)}
        </div>}
        {data.certifications?.length>0&&<div>
          <SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Certifications &amp; Awards</SectionTitle>
          <ul style={{ margin:0, paddingLeft:'0.2in' }}>{[...data.certifications.map(c=>`${c.name}${c.org?` — ${c.org}`:''}${c.date?` (${c.date})`:''}`), ...data.awards].filter(Boolean).map((a,i)=><li key={i} style={{ fontFamily:bodyFont, fontSize:'10pt', color:'#1c1c1c', marginBottom:'0.03in' }}>{a}</li>)}</ul>
        </div>}
      </div>
    </div>
  );
}

/* ── Executive / Prestige — commanding two-section layout ── */
function LayoutExecPrestige({ data, template, accent }) {
  const { bodyFont, nameFont, sectionDeco } = template; const s = data.summary || {};
  return (
    <div style={{ width:'8.5in', minHeight:'11in', background:'#F9F8F6', fontFamily:bodyFont, boxSizing:'border-box', boxShadow:'0 12px 40px -10px rgba(0,0,0,0.2)' }}>
      <div style={{ padding:'0.65in 0.8in 0.3in', boxSizing:'border-box', borderBottom:`3px solid ${accent}` }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', gap:'0.3in' }}>
          <div>
            <h1 style={{ fontFamily:nameFont, fontSize:'34pt', fontWeight:800, color:'#111', margin:0, lineHeight:1.05, letterSpacing:'-0.02em' }}>{data.name||'Your Name'}</h1>
            {s.tagline&&<div style={{ fontFamily:bodyFont, fontSize:'12pt', color:accent, marginTop:'0.08in', fontWeight:600, letterSpacing:'0.02em' }}>{s.tagline}</div>}
          </div>
          <div style={{ textAlign:'right', fontFamily:bodyFont, fontSize:'8.5pt', color:'#666', lineHeight:1.8, flexShrink:0 }}>
            {[data.contact?.email, data.contact?.phone, data.contact?.location, data.contact?.linkedin].filter(Boolean).map((v,i)=><div key={i}>{v}</div>)}
          </div>
        </div>
        <div style={{ display:'flex', gap:'0.1in', marginTop:'0.25in' }}>
          <div style={{ height:'4px', width:'0.6in', background:accent }} />
          <div style={{ height:'4px', flex:1, background:hexToRgba(accent,0.15) }} />
        </div>
      </div>
      <div style={{ display:'flex', padding:'0.35in 0.8in 0.6in', gap:'0.45in', boxSizing:'border-box' }}>
        <div style={{ width:'2.2in', flexShrink:0 }}>
          {(s.bullets?.length>0)&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Executive Summary</SectionTitle>{s.bullets.map((b,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:'9.5pt', color:'#333', marginBottom:'0.06in', lineHeight:1.65, paddingLeft:'0.1in', borderLeft:`2px solid ${hexToRgba(accent,0.25)}` }}>{b}</div>)}</div>}
          {s.skills?.length>0&&<div style={{ marginTop:'0.12in' }}><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Core Competencies</SectionTitle>{s.skills.map((sk,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:'9pt', color:'#333', marginBottom:'0.05in', display:'flex', alignItems:'center', gap:'0.07in' }}><span style={{ width:'5px', height:'5px', background:accent, transform:'rotate(45deg)', flexShrink:0, display:'inline-block' }}/>{sk}</div>)}</div>}
          {data.education?.length>0&&<div style={{ marginTop:'0.12in' }}><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Education</SectionTitle>{data.education.map((ed,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:'9pt', color:'#333', marginBottom:'0.1in' }}><div style={{ fontWeight:700, color:'#111' }}>{ed.degree}</div><div style={{ color:accent }}>{ed.school}</div><div style={{ color:'#777' }}>{[ed.location,ed.date].filter(Boolean).join(' · ')}</div>{ed.honors&&<div style={{ fontStyle:'italic', color:'#777', fontSize:'8.5pt' }}>{ed.honors}</div>}</div>)}</div>}
          {data.certifications?.length>0&&<div style={{ marginTop:'0.12in' }}><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Credentials</SectionTitle>{data.certifications.map((c,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:'8.5pt', color:'#333', marginBottom:'0.07in' }}><div style={{ fontWeight:600 }}>{c.name}</div>{c.org&&<div style={{ color:'#777' }}>{c.org}</div>}{c.date&&<div style={{ color:accent, fontWeight:500 }}>{c.date}</div>}</div>)}</div>}
        </div>
        <div style={{ flex:1 }}>
          {data.experience?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Career History</SectionTitle>{data.experience.map((exp,i)=><ExperienceBlock key={i} exp={exp} bodyFont={bodyFont} accent={accent} i={i} total={data.experience.length} />)}</div>}
          {data.projects?.length>0&&<div style={{ marginTop:'0.1in' }}><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Board &amp; Advisory</SectionTitle>{data.projects.map((p,i)=><div key={i} style={{ marginBottom:'0.1in' }}><div style={{ fontFamily:bodyFont, fontWeight:700, fontSize:'10.5pt' }}>{p.name}</div>{p.description&&<div style={{ fontFamily:bodyFont, fontSize:'10pt', color:'#555', margin:'0.02in 0' }}>{p.description}</div>}{p.bullets?.length>0&&<ul style={{ margin:'0.02in 0 0', paddingLeft:'0.2in' }}>{p.bullets.map((b,j)=><li key={j} style={{ fontFamily:bodyFont, fontSize:'10pt' }}>{b}</li>)}</ul>}</div>)}</div>}
          {data.awards?.length>0&&<div style={{ marginTop:'0.1in' }}><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Recognition</SectionTitle><ul style={{ margin:0, paddingLeft:'0.2in' }}>{data.awards.map((a,i)=><li key={i} style={{ fontFamily:bodyFont, fontSize:'10pt', color:'#1c1c1c', marginBottom:'0.03in' }}>{a}</li>)}</ul></div>}
        </div>
      </div>
    </div>
  );
}

/* ── Finance / Legal (Sterling) — ultra-formal, serif-first ── */
function LayoutFormalSerif({ data, template, accent }) {
  const { bodyFont, nameFont, sectionDeco } = template; const s = data.summary || {};
  return (
    <div style={{ width:'8.5in', minHeight:'11in', background:'#FFFFFE', fontFamily:bodyFont, boxSizing:'border-box', boxShadow:'0 12px 40px -10px rgba(0,0,0,0.12)' }}>
      <div style={{ padding:'0.6in 0.85in 0.28in', boxSizing:'border-box', textAlign:'center' }}>
        <h1 style={{ fontFamily:nameFont, fontSize:'28pt', fontWeight:700, color:'#111', margin:0, lineHeight:1.1, letterSpacing:'0.02em' }}>{data.name||'Your Name'}</h1>
        {s.tagline&&<div style={{ fontFamily:bodyFont, fontSize:'10pt', color:'#555', marginTop:'0.07in', fontStyle:'italic' }}>{s.tagline}</div>}
        <ContactLine data={data} separator='  |  ' style={{ fontFamily:bodyFont, fontSize:'8.5pt', color:'#666', marginTop:'0.1in' }} />
        <div style={{ margin:'0.18in auto 0', width:'1.2in', height:'2px', background:accent }} />
        <div style={{ margin:'0.04in auto 0', width:'0.5in', height:'1px', background:hexToRgba(accent,0.35) }} />
      </div>
      <div style={{ padding:'0.2in 0.85in 0.6in', boxSizing:'border-box' }}>
        {renderSections(data, bodyFont, accent, sectionDeco)}
      </div>
    </div>
  );
}

/* ── Hospitality / Chef (Mise en Place) — warm, badge-heavy ── */
function LayoutHospitality({ data, template, accent, accent2 }) {
  const { bodyFont, nameFont, sectionDeco } = template; const s = data.summary || {}; const a2 = accent2||template.accent2||'#C17A3A';
  return (
    <div style={{ width:'8.5in', minHeight:'11in', background:'#FAF7F2', fontFamily:bodyFont, boxSizing:'border-box', display:'flex', boxShadow:'0 12px 40px -10px rgba(0,0,0,0.18)' }}>
      <div style={{ width:'2.5in', background:accent, padding:'0.5in 0.3in', boxSizing:'border-box', flexShrink:0 }}>
        <ResumePhoto src={data.photo} shape={template.photoShape} size="1.05in" border="rgba(255,255,255,0.3)" />
        <div style={{ fontFamily:nameFont, fontSize:'17pt', fontWeight:700, color:'#fff', marginTop:'0.15in', lineHeight:1.2, wordBreak:'break-word' }}>{data.name||'Your Name'}</div>
        {s.tagline&&<div style={{ fontFamily:bodyFont, fontSize:'8.5pt', color:'rgba(255,255,255,0.72)', marginTop:'0.07in', fontStyle:'italic', lineHeight:1.4 }}>{s.tagline}</div>}
        <div style={{ marginTop:'0.18in', borderTop:`1px solid ${hexToRgba(a2,0.5)}`, paddingTop:'0.15in' }}>
          <div style={{ fontFamily:bodyFont, fontSize:'7pt', textTransform:'uppercase', letterSpacing:'0.2em', color:hexToRgba(a2,0.9), marginBottom:'0.08in', fontWeight:700 }}>Contact</div>
          <ContactStack data={data} style={{ fontFamily:bodyFont, fontSize:'8pt', color:'rgba(255,255,255,0.85)', lineHeight:1.55 }} labelStyle={{}} />
        </div>
        {s.skills?.length>0&&<div style={{ marginTop:'0.18in', borderTop:`1px solid ${hexToRgba(a2,0.5)}`, paddingTop:'0.15in' }}>
          <div style={{ fontFamily:bodyFont, fontSize:'7pt', textTransform:'uppercase', letterSpacing:'0.2em', color:hexToRgba(a2,0.9), marginBottom:'0.1in', fontWeight:700 }}>Specialties</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'0.05in' }}>{s.skills.map((sk,i)=><span key={i} style={{ fontFamily:bodyFont, fontSize:'7.5pt', background:hexToRgba(a2,0.25), color:'rgba(255,255,255,0.95)', padding:'0.03in 0.09in', borderRadius:'3px', fontWeight:500, border:`1px solid ${hexToRgba(a2,0.4)}` }}>{sk}</span>)}</div>
        </div>}
        {data.certifications?.length>0&&<div style={{ marginTop:'0.18in', borderTop:`1px solid ${hexToRgba(a2,0.5)}`, paddingTop:'0.15in' }}>
          <div style={{ fontFamily:bodyFont, fontSize:'7pt', textTransform:'uppercase', letterSpacing:'0.2em', color:hexToRgba(a2,0.9), marginBottom:'0.08in', fontWeight:700 }}>Certifications</div>
          {data.certifications.map((c,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:'7.5pt', color:'rgba(255,255,255,0.85)', marginBottom:'0.06in' }}><div style={{ fontWeight:600 }}>{c.name}</div>{c.date&&<div style={{ color:'rgba(255,255,255,0.55)' }}>{c.date}</div>}</div>)}
        </div>}
        {data.education?.length>0&&<div style={{ marginTop:'0.18in', borderTop:`1px solid ${hexToRgba(a2,0.5)}`, paddingTop:'0.15in' }}>
          <div style={{ fontFamily:bodyFont, fontSize:'7pt', textTransform:'uppercase', letterSpacing:'0.2em', color:hexToRgba(a2,0.9), marginBottom:'0.08in', fontWeight:700 }}>Training</div>
          {data.education.map((ed,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:'8pt', color:'rgba(255,255,255,0.85)', marginBottom:'0.08in' }}><div style={{ fontWeight:600 }}>{ed.degree}</div>{ed.school&&<div style={{ color:'rgba(255,255,255,0.65)' }}>{ed.school}</div>}{ed.date&&<div style={{ color:'rgba(255,255,255,0.45)' }}>{ed.date}</div>}</div>)}
        </div>}
      </div>
      <div style={{ flex:1, padding:'0.5in 0.45in 0.6in 0.4in', boxSizing:'border-box' }}>
        {s.bullets?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Profile</SectionTitle>{s.bullets.map((b,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:'10pt', color:'#333', marginBottom:'0.05in', lineHeight:1.6 }}>{b}</div>)}</div>}
        {data.experience?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Experience</SectionTitle>{data.experience.map((exp,i)=><ExperienceBlock key={i} exp={exp} bodyFont={bodyFont} accent={accent} i={i} total={data.experience.length} />)}</div>}
        {data.awards?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Awards &amp; Recognition</SectionTitle><ul style={{ margin:0, paddingLeft:'0.2in' }}>{data.awards.map((a,i)=><li key={i} style={{ fontFamily:bodyFont, fontSize:'10pt', color:'#1c1c1c', marginBottom:'0.03in' }}>{a}</li>)}</ul></div>}
      </div>
    </div>
  );
}

/* ── Fitness / Wellness (Elevate) — bold energetic header ── */
function LayoutFitness({ data, template, accent, accent2 }) {
  const { bodyFont, nameFont, sectionDeco } = template; const s = data.summary || {}; const a2 = accent2||template.accent2||'#E05C20';
  return (
    <div style={{ width:'8.5in', minHeight:'11in', background:'#F8F9FA', fontFamily:bodyFont, boxSizing:'border-box', boxShadow:'0 12px 40px -10px rgba(0,0,0,0.18)' }}>
      <div style={{ background:accent, padding:'0.4in 0.65in', boxSizing:'border-box', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:0, right:0, width:'3in', height:'100%', background:hexToRgba(a2,0.15), clipPath:'polygon(40% 0, 100% 0, 100% 100%, 0% 100%)' }} />
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'4px', background:a2 }} />
        <div style={{ position:'relative', display:'flex', alignItems:'center', gap:'0.3in' }}>
          <ResumePhoto src={data.photo} shape={template.photoShape} size="1.1in" border={hexToRgba(a2,0.6)} />
          <div>
            <h1 style={{ fontFamily:nameFont, fontSize:'30pt', fontWeight:800, color:'#fff', margin:0, lineHeight:1.05, letterSpacing:'0.02em', textTransform:'uppercase' }}>{data.name||'Your Name'}</h1>
            {s.tagline&&<div style={{ fontFamily:bodyFont, fontSize:'10pt', color:hexToRgba(a2,0.95), marginTop:'0.07in', fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', fontSize:'9pt' }}>{s.tagline}</div>}
            <ContactLine data={data} separator='  ·  ' style={{ color:'rgba(255,255,255,0.72)', fontSize:'8.5pt', marginTop:'0.09in', fontFamily:bodyFont }} />
          </div>
        </div>
      </div>
      <div style={{ display:'flex', padding:'0.35in 0.65in 0.6in', gap:'0.4in', boxSizing:'border-box' }}>
        <div style={{ width:'2in', flexShrink:0 }}>
          {s.skills?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Specialties</SectionTitle>{s.skills.map((sk,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:'9pt', color:'#333', marginBottom:'0.05in', paddingLeft:'0.08in', borderLeft:`3px solid ${hexToRgba(a2,0.6)}` }}>{sk}</div>)}</div>}
          {data.certifications?.length>0&&<div style={{ marginTop:'0.12in' }}><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Certifications</SectionTitle>{data.certifications.map((c,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:'8.5pt', color:'#333', marginBottom:'0.08in', background:hexToRgba(a2,0.08), border:`1px solid ${hexToRgba(a2,0.2)}`, borderRadius:'4px', padding:'0.05in 0.1in' }}><div style={{ fontWeight:700, color:accent }}>{c.name}</div>{c.org&&<div style={{ color:'#666' }}>{c.org}</div>}{c.date&&<div style={{ color:a2, fontWeight:600 }}>{c.date}</div>}</div>)}</div>}
          {data.education?.length>0&&<div style={{ marginTop:'0.12in' }}><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Education</SectionTitle>{data.education.map((ed,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:'8.5pt', color:'#333', marginBottom:'0.08in' }}><div style={{ fontWeight:600 }}>{ed.degree}</div>{ed.school&&<div style={{ color:'#666' }}>{ed.school}</div>}{ed.date&&<div style={{ color:accent, fontWeight:500 }}>{ed.date}</div>}</div>)}</div>}
        </div>
        <div style={{ flex:1 }}>
          {s.bullets?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>About</SectionTitle>{s.bullets.map((b,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:'10pt', color:'#333', marginBottom:'0.05in', lineHeight:1.6 }}>{b}</div>)}</div>}
          {data.experience?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Experience</SectionTitle>{data.experience.map((exp,i)=><ExperienceBlock key={i} exp={exp} bodyFont={bodyFont} accent={accent} i={i} total={data.experience.length} />)}</div>}
          {data.awards?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Awards &amp; Recognition</SectionTitle><ul style={{ margin:0, paddingLeft:'0.2in' }}>{data.awards.map((a,i)=><li key={i} style={{ fontFamily:bodyFont, fontSize:'10pt', color:'#1c1c1c', marginBottom:'0.03in' }}>{a}</li>)}</ul></div>}
        </div>
      </div>
    </div>
  );
}

/* ── Real Estate (Listing) — photo right, metrics-forward ── */
function LayoutRealEstate({ data, template, accent }) {
  const { bodyFont, nameFont, sectionDeco } = template; const s = data.summary || {};
  return (
    <div style={{ width:'8.5in', minHeight:'11in', background:'#FAFAFA', fontFamily:bodyFont, boxSizing:'border-box', boxShadow:'0 12px 40px -10px rgba(0,0,0,0.18)' }}>
      <div style={{ background:'#fff', padding:'0.45in 0.7in 0.3in', boxSizing:'border-box', borderBottom:`2px solid ${accent}` }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'0.3in' }}>
          <div style={{ flex:1 }}>
            <h1 style={{ fontFamily:nameFont, fontSize:'30pt', fontWeight:800, color:'#111', margin:0, lineHeight:1.1, letterSpacing:'-0.01em' }}>{data.name||'Your Name'}</h1>
            {s.tagline&&<div style={{ fontFamily:bodyFont, fontSize:'11pt', color:accent, marginTop:'0.07in', fontWeight:600 }}>{s.tagline}</div>}
            <ContactLine data={data} separator='  ·  ' style={{ fontFamily:bodyFont, fontSize:'8.5pt', color:'#666', marginTop:'0.1in' }} />
            {s.skills?.length>0&&<div style={{ display:'flex', flexWrap:'wrap', gap:'0.05in', marginTop:'0.1in' }}>{s.skills.map((sk,i)=><span key={i} style={{ fontFamily:bodyFont, fontSize:'8pt', background:hexToRgba(accent,0.08), color:accent, padding:'0.02in 0.1in', borderRadius:'3px', fontWeight:600, border:`1px solid ${hexToRgba(accent,0.18)}` }}>{sk}</span>)}</div>}
          </div>
          <ResumePhoto src={data.photo} shape={template.photoShape} size="1.15in" border={hexToRgba(accent,0.3)} />
        </div>
      </div>
      <div style={{ padding:'0.32in 0.7in 0.6in', boxSizing:'border-box' }}>
        {s.bullets?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Profile</SectionTitle>{s.bullets.map((b,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:'10.5pt', color:'#333', marginBottom:'0.05in', lineHeight:1.6 }}>{b}</div>)}</div>}
        {data.experience?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Career History</SectionTitle>{data.experience.map((exp,i)=><ExperienceBlock key={i} exp={exp} bodyFont={bodyFont} accent={accent} i={i} total={data.experience.length} />)}</div>}
        {data.education?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Education &amp; Licensing</SectionTitle>{data.education.map((ed,i)=><EducationBlock key={i} ed={ed} bodyFont={bodyFont} accent={accent} />)}</div>}
        {data.certifications?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Designations &amp; Certifications</SectionTitle><ul style={{ margin:0, paddingLeft:'0.2in' }}>{data.certifications.map((c,i)=><li key={i} style={{ fontFamily:bodyFont, fontSize:'10pt', color:'#1c1c1c', marginBottom:'0.03in' }}><span style={{ fontWeight:600 }}>{c.name}</span>{c.org&&`, ${c.org}`}{c.date&&<span style={{ color:'#666' }}> ({c.date})</span>}</li>)}</ul></div>}
        {data.awards?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Awards &amp; Recognition</SectionTitle><ul style={{ margin:0, paddingLeft:'0.2in' }}>{data.awards.map((a,i)=><li key={i} style={{ fontFamily:bodyFont, fontSize:'10pt', color:'#1c1c1c', marginBottom:'0.03in' }}>{a}</li>)}</ul></div>}
      </div>
    </div>
  );
}

/* ── Freelancer / Contractor (Craft) — project-first, portfolio-ready ── */
function LayoutFreelancer({ data, template, accent }) {
  const { bodyFont, nameFont, sectionDeco } = template; const s = data.summary || {};
  return (
    <div style={{ width:'8.5in', minHeight:'11in', background:'#F9F9F9', fontFamily:bodyFont, boxSizing:'border-box', boxShadow:'0 12px 40px -10px rgba(0,0,0,0.15)' }}>
      <div style={{ background:accent, padding:'0.4in 0.65in 0.35in', boxSizing:'border-box' }}>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:'0.3in' }}>
          <div>
            <h1 style={{ fontFamily:nameFont, fontSize:'28pt', fontWeight:800, color:'#fff', margin:0, lineHeight:1.1 }}>{data.name||'Your Name'}</h1>
            {s.tagline&&<div style={{ fontFamily:bodyFont, fontSize:'10pt', color:'rgba(255,255,255,0.75)', marginTop:'0.06in', letterSpacing:'0.04em', fontWeight:500 }}>{s.tagline}</div>}
          </div>
          <div style={{ textAlign:'right', fontFamily:bodyFont, fontSize:'8pt', color:'rgba(255,255,255,0.72)', lineHeight:1.75, flexShrink:0 }}>
            {[data.contact?.email, data.contact?.phone, data.contact?.website, data.contact?.linkedin].filter(Boolean).map((v,i)=><div key={i}>{v}</div>)}
          </div>
        </div>
      </div>
      <div style={{ background:hexToRgba(accent,0.07), padding:'0.12in 0.65in', boxSizing:'border-box', borderBottom:`1px solid ${hexToRgba(accent,0.15)}` }}>
        {s.skills?.length>0&&<div style={{ display:'flex', flexWrap:'wrap', gap:'0.05in' }}>{s.skills.map((sk,i)=><span key={i} style={{ fontFamily:bodyFont, fontSize:'8pt', background:hexToRgba(accent,0.1), color:accent, padding:'0.02in 0.1in', borderRadius:'50px', fontWeight:600, border:`1px solid ${hexToRgba(accent,0.2)}` }}>{sk}</span>)}</div>}
      </div>
      <div style={{ padding:'0.35in 0.65in 0.6in', boxSizing:'border-box' }}>
        {s.bullets?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>About</SectionTitle>{s.bullets.map((b,i)=><div key={i} style={{ fontFamily:bodyFont, fontSize:'10pt', color:'#333', marginBottom:'0.05in', lineHeight:1.65 }}>{b}</div>)}</div>}
        {data.projects?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Selected Work</SectionTitle>{data.projects.map((p,i)=><div key={i} style={{ marginBottom:'0.14in', paddingLeft:'0.15in', borderLeft:`3px solid ${hexToRgba(accent,0.3)}` }}><div style={{ fontFamily:bodyFont, fontWeight:700, fontSize:'10.5pt', color:'#111' }}>{p.name}</div>{p.description&&<div style={{ fontFamily:bodyFont, fontSize:'10pt', color:accent, fontWeight:500, margin:'0.02in 0' }}>{p.description}</div>}{p.bullets?.length>0&&<ul style={{ margin:'0.04in 0 0', paddingLeft:'0.2in' }}>{p.bullets.map((b,j)=><li key={j} style={{ fontFamily:bodyFont, fontSize:'10pt', color:'#333', marginBottom:'0.02in' }}>{b}</li>)}</ul>}</div>)}</div>}
        {data.experience?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Work History</SectionTitle>{data.experience.map((exp,i)=><ExperienceBlock key={i} exp={exp} bodyFont={bodyFont} accent={accent} i={i} total={data.experience.length} />)}</div>}
        {data.education?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Education</SectionTitle>{data.education.map((ed,i)=><EducationBlock key={i} ed={ed} bodyFont={bodyFont} accent={accent} />)}</div>}
        {data.certifications?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Certifications</SectionTitle><ul style={{ margin:0, paddingLeft:'0.2in' }}>{data.certifications.map((c,i)=><li key={i} style={{ fontFamily:bodyFont, fontSize:'10pt', color:'#1c1c1c', marginBottom:'0.03in' }}><span style={{ fontWeight:600 }}>{c.name}</span>{c.org&&`, ${c.org}`}{c.date&&<span style={{ color:'#666' }}> ({c.date})</span>}</li>)}</ul></div>}
        {data.awards?.length>0&&<div><SectionTitle deco={sectionDeco} accent={accent} bodyFont={bodyFont}>Awards &amp; Recognition</SectionTitle><ul style={{ margin:0, paddingLeft:'0.2in' }}>{data.awards.map((a,i)=><li key={i} style={{ fontFamily:bodyFont, fontSize:'10pt', color:'#1c1c1c', marginBottom:'0.03in' }}>{a}</li>)}</ul></div>}
      </div>
    </div>
  );
}

/* ============================================================
   TEMPLATE PREVIEW ROUTER
   ============================================================ */
const TemplatePreview = React.forwardRef(function TemplatePreview({ template, data, accent, accent2 }, ref) {
  const eff = useMemo(() => ({ ...template, accent2: accent2||template.accent2 }), [template, accent2]);
  const props = { data, template: eff, accent, accent2: accent2||template.accent2 };
  const inner = (() => {
    switch (eff.layout) {
      case 'dark-header':     return <LayoutDarkHeader {...props} />;
      case 'split-header':    return <LayoutSplitHeader {...props} />;
      case 'accent-strip':    return <LayoutAccentStrip {...props} />;
      case 'dark-sidebar':    return <LayoutDarkSidebar {...props} />;
      case 'editorial':       return <LayoutEditorial {...props} />;
      case 'color-sidebar':   return <LayoutColorSidebar {...props} />;
      case 'two-tone-header': return <LayoutTwoToneHeader {...props} />;
      case 'structured-cols': return <LayoutStructuredCols {...props} />;
      case 'folio':           return <LayoutFolio {...props} />;
      case 'cv-dense':        return <LayoutCvDense {...props} />;
      case 'diagonal-band':   return <LayoutDiagonalBand {...props} />;
      case 'sidebar-classic': return <LayoutSidebarClassic {...props} />;
      case 'header-band':     return <LayoutHeaderBand {...props} />;
      case 'ats-single-col':  return <LayoutAtsSingleCol {...props} />;
      case 'ats-lined':       return <LayoutAtsLined {...props} />;
      case 'student-fresh':   return <LayoutStudentFresh {...props} />;
      case 'exec-prestige':   return <LayoutExecPrestige {...props} />;
      case 'formal-serif':    return <LayoutFormalSerif {...props} />;
      case 'hospitality':     return <LayoutHospitality {...props} />;
      case 'fitness':         return <LayoutFitness {...props} />;
      case 'real-estate':     return <LayoutRealEstate {...props} />;
      case 'freelancer':      return <LayoutFreelancer {...props} />;
      default:                return <LayoutDarkHeader {...props} />;
    }
  })();
  return <div ref={ref}>{inner}</div>;
});

/* ============================================================
   PHOTO UPLOAD
   ============================================================ */
function PhotoUpload({ photo, onChange }) {
  const fileRef = useRef(null);
  const handleFile = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange(ev.target.result);
    reader.readAsDataURL(file);
  };
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-wider text-stone-500 mb-1 font-medium">Profile Photo</label>
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-stone-200 flex items-center justify-center bg-stone-100 flex-shrink-0">
          {photo ? <img src={photo} alt="Profile" className="w-full h-full object-cover" /> : <User className="w-6 h-6 text-stone-400" />}
        </div>
        <div className="flex flex-col gap-1.5">
          <button onClick={() => fileRef.current?.click()} className="tool-body text-xs bg-stone-900 hover:bg-stone-700 text-white px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors">
            <Camera className="w-3 h-3" />{photo ? 'Change photo' : 'Upload photo'}
          </button>
          {photo && <button onClick={() => onChange(null)} className="tool-body text-xs text-stone-500 hover:text-red-600 transition-colors text-left">Remove photo</button>}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
    </div>
  );
}

/* ============================================================
   FORM COMPONENTS
   ============================================================ */
const fieldClass = "w-full px-2.5 py-1.5 text-sm border border-stone-300 rounded bg-white focus:outline-none focus:border-stone-600 focus:ring-1 focus:ring-stone-600 transition-colors";
const labelClass = "block text-[11px] uppercase tracking-wider text-stone-500 mb-1 font-medium";
const subSectionClass = "border border-stone-200 rounded-md p-3 bg-stone-50/50";

function ListInput({ label, items, onChange, placeholder = "Add item" }) {
  const update = (i, v) => onChange(items.map((it,idx) => idx===i ? v : it));
  const add = () => onChange([...items, ""]);
  const remove = (i) => onChange(items.filter((_,idx) => idx!==i));
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="space-y-1.5">
        {items.map((item,i) => (
          <div key={i} className="flex gap-1.5">
            <input className={fieldClass} value={item} onChange={e=>update(i,e.target.value)} placeholder={placeholder} />
            <button onClick={() => remove(i)} className="px-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" aria-label="Remove"><X className="w-4 h-4" /></button>
          </div>
        ))}
        <button onClick={add} className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1 px-2 py-1 rounded hover:bg-stone-100 transition-colors"><Plus className="w-3 h-3" /> Add</button>
      </div>
    </div>
  );
}

function CollapsibleSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-stone-200 last:border-b-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-3 text-left group">
        <span className="text-sm font-semibold tracking-wide text-stone-800 group-hover:text-stone-950">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
      </button>
      {open && <div className="pb-4 space-y-3">{children}</div>}
    </div>
  );
}

function ResumeForm({ data, setData }) {
  const update = (path, value) => {
    setData(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const parts = path.split('.'); let cur = next;
      for (let i=0; i<parts.length-1; i++) cur = cur[parts[i]];
      cur[parts[parts.length-1]] = value;
      return next;
    });
  };
  const updateExp  = (i,k,v) => setData(p => ({ ...p, experience: p.experience.map((e,idx) => idx===i?{...e,[k]:v}:e) }));
  const updateEdu  = (i,k,v) => setData(p => ({ ...p, education: p.education.map((e,idx) => idx===i?{...e,[k]:v}:e) }));
  const updateCert = (i,k,v) => setData(p => ({ ...p, certifications: p.certifications.map((e,idx) => idx===i?{...e,[k]:v}:e) }));
  return (
    <div className="space-y-1">
      <CollapsibleSection title="Identity & Contact">
        <PhotoUpload photo={data.photo} onChange={v=>update('photo',v)} />
        <div><label className={labelClass}>Full name</label><input className={fieldClass} value={data.name} onChange={e=>update('name',e.target.value)} placeholder="Your name" /></div>
        <div className="grid grid-cols-2 gap-2">
          <div><label className={labelClass}>Phone</label><input className={fieldClass} value={data.contact.phone} onChange={e=>update('contact.phone',e.target.value)} /></div>
          <div><label className={labelClass}>Email</label><input className={fieldClass} value={data.contact.email} onChange={e=>update('contact.email',e.target.value)} /></div>
          <div><label className={labelClass}>Location</label><input className={fieldClass} value={data.contact.location} onChange={e=>update('contact.location',e.target.value)} /></div>
          <div><label className={labelClass}>LinkedIn</label><input className={fieldClass} value={data.contact.linkedin} onChange={e=>update('contact.linkedin',e.target.value)} /></div>
          <div className="col-span-2"><label className={labelClass}>Website</label><input className={fieldClass} value={data.contact.website} onChange={e=>update('contact.website',e.target.value)} /></div>
        </div>
      </CollapsibleSection>
      <CollapsibleSection title="Summary">
        <div><label className={labelClass}>Tagline</label><input className={fieldClass} value={data.summary.tagline} onChange={e=>update('summary.tagline',e.target.value)} placeholder="e.g. Senior Product Designer with 10+ years" /></div>
        <ListInput label="Bullets" items={data.summary.bullets} onChange={v=>update('summary.bullets',v)} placeholder="A short summary point" />
        <ListInput label="Skills" items={data.summary.skills} onChange={v=>update('summary.skills',v)} placeholder="A skill" />
      </CollapsibleSection>
      <CollapsibleSection title="Experience">
        {data.experience.map((exp,i) => (
          <div key={i} className={subSectionClass}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs uppercase tracking-wider text-stone-500 font-medium">Role {i+1}</span>
              <button onClick={() => setData(p=>({...p,experience:p.experience.filter((_,j)=>j!==i)}))} className="text-stone-400 hover:text-red-600 transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input className={fieldClass} placeholder="Title" value={exp.title} onChange={e=>updateExp(i,'title',e.target.value)} />
                <input className={fieldClass} placeholder="Company" value={exp.company} onChange={e=>updateExp(i,'company',e.target.value)} />
                <input className={fieldClass} placeholder="Location" value={exp.location} onChange={e=>updateExp(i,'location',e.target.value)} />
                <div className="grid grid-cols-2 gap-2">
                  <input className={fieldClass} placeholder="Start" value={exp.start} onChange={e=>updateExp(i,'start',e.target.value)} />
                  <input className={fieldClass} placeholder="End" value={exp.end} onChange={e=>updateExp(i,'end',e.target.value)} />
                </div>
              </div>
              <textarea className={fieldClass} rows={2} placeholder="Optional summary paragraph" value={exp.summary} onChange={e=>updateExp(i,'summary',e.target.value)} />
              <ListInput label="Bullets" items={exp.bullets} onChange={v=>updateExp(i,'bullets',v)} placeholder="A bullet point" />
            </div>
          </div>
        ))}
        <button onClick={() => setData(p=>({...p,experience:[...p.experience,{title:"",company:"",location:"",start:"",end:"",summary:"",bullets:[]}]}))} className="w-full py-2 border border-dashed border-stone-300 text-stone-600 hover:bg-stone-50 hover:border-stone-400 rounded text-sm flex items-center justify-center gap-1 transition-colors"><Plus className="w-4 h-4" /> Add role</button>
      </CollapsibleSection>
      <CollapsibleSection title="Education">
        {data.education.map((ed,i) => (
          <div key={i} className={subSectionClass}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs uppercase tracking-wider text-stone-500 font-medium">Entry {i+1}</span>
              <button onClick={() => setData(p=>({...p,education:p.education.filter((_,j)=>j!==i)}))} className="text-stone-400 hover:text-red-600"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input className={fieldClass} placeholder="Degree" value={ed.degree} onChange={e=>updateEdu(i,'degree',e.target.value)} />
              <input className={fieldClass} placeholder="School" value={ed.school} onChange={e=>updateEdu(i,'school',e.target.value)} />
              <input className={fieldClass} placeholder="Location" value={ed.location} onChange={e=>updateEdu(i,'location',e.target.value)} />
              <input className={fieldClass} placeholder="Date" value={ed.date} onChange={e=>updateEdu(i,'date',e.target.value)} />
              <input className={fieldClass+" col-span-2"} placeholder="Honors (optional)" value={ed.honors} onChange={e=>updateEdu(i,'honors',e.target.value)} />
            </div>
          </div>
        ))}
        <button onClick={() => setData(p=>({...p,education:[...p.education,{degree:"",school:"",location:"",date:"",honors:""}]}))} className="w-full py-2 border border-dashed border-stone-300 text-stone-600 hover:bg-stone-50 hover:border-stone-400 rounded text-sm flex items-center justify-center gap-1 transition-colors"><Plus className="w-4 h-4" /> Add education</button>
      </CollapsibleSection>
      <CollapsibleSection title="Certifications" defaultOpen={false}>
        {data.certifications.map((c,i) => (
          <div key={i} className={subSectionClass}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs uppercase tracking-wider text-stone-500 font-medium">Certification {i+1}</span>
              <button onClick={() => setData(p=>({...p,certifications:p.certifications.filter((_,j)=>j!==i)}))} className="text-stone-400 hover:text-red-600"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <input className={fieldClass+" col-span-2"} placeholder="Name" value={c.name} onChange={e=>updateCert(i,'name',e.target.value)} />
              <input className={fieldClass} placeholder="Date" value={c.date} onChange={e=>updateCert(i,'date',e.target.value)} />
              <input className={fieldClass+" col-span-3"} placeholder="Issuing organization" value={c.org} onChange={e=>updateCert(i,'org',e.target.value)} />
            </div>
          </div>
        ))}
        <button onClick={() => setData(p=>({...p,certifications:[...p.certifications,{name:"",org:"",date:""}]}))} className="w-full py-2 border border-dashed border-stone-300 text-stone-600 hover:bg-stone-50 hover:border-stone-400 rounded text-sm flex items-center justify-center gap-1 transition-colors"><Plus className="w-4 h-4" /> Add certification</button>
      </CollapsibleSection>
      <CollapsibleSection title="Projects" defaultOpen={false}>
        {data.projects.map((p,i) => (
          <div key={i} className={subSectionClass}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs uppercase tracking-wider text-stone-500 font-medium">Project {i+1}</span>
              <button onClick={() => setData(pr=>({...pr,projects:pr.projects.filter((_,j)=>j!==i)}))} className="text-stone-400 hover:text-red-600"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-2">
              <input className={fieldClass} placeholder="Project name" value={p.name} onChange={e=>setData(pr=>({...pr,projects:pr.projects.map((x,idx)=>idx===i?{...x,name:e.target.value}:x)}))} />
              <textarea className={fieldClass} rows={2} placeholder="Description" value={p.description} onChange={e=>setData(pr=>({...pr,projects:pr.projects.map((x,idx)=>idx===i?{...x,description:e.target.value}:x)}))} />
              <ListInput label="Bullets" items={p.bullets} onChange={v=>setData(pr=>({...pr,projects:pr.projects.map((x,idx)=>idx===i?{...x,bullets:v}:x)}))} placeholder="A bullet point" />
            </div>
          </div>
        ))}
        <button onClick={() => setData(p=>({...p,projects:[...p.projects,{name:"",description:"",bullets:[]}]}))} className="w-full py-2 border border-dashed border-stone-300 text-stone-600 hover:bg-stone-50 hover:border-stone-400 rounded text-sm flex items-center justify-center gap-1 transition-colors"><Plus className="w-4 h-4" /> Add project</button>
      </CollapsibleSection>
      <CollapsibleSection title="Awards" defaultOpen={false}>
        <ListInput label="Awards & Honors" items={data.awards} onChange={v=>update('awards',v)} placeholder="An award or honor" />
      </CollapsibleSection>
    </div>
  );
}

/* ============================================================
   COVER LETTER DATA MODEL
   ============================================================ */
const EMPTY_CL = {
  recipientName: "",
  recipientTitle: "",
  company: "",
  companyAddress: "",
  date: "",
  senderName: "",
  senderTitle: "",
  senderEmail: "",
  senderPhone: "",
  senderLocation: "",
  opening: "",
  body1: "",
  body2: "",
  body3: "",
  closing: "",
};

const SAMPLE_CL = {
  recipientName: "Claire Henderson",
  recipientTitle: "Director of Nursing",
  company: "Gold Coast University Hospital",
  companyAddress: "1 Hospital Blvd, Southport QLD 4215",
  date: "June 7, 2026",
  senderName: "Amelia Torres",
  senderTitle: "Senior Registered Nurse — Emergency & Critical Care",
  senderEmail: "amelia.torres@email.com",
  senderPhone: "+61 411 234 567",
  senderLocation: "Brisbane, QLD",
  opening: "Eleven years in emergency and critical care have taught me that the best nursing teams aren't just clinically excellent — they make patients feel genuinely safe in the most frightening moments of their lives. Gold Coast University Hospital's reputation for patient-centred care and its investment in nursing development are exactly what drew me to this Senior Clinical Nurse Consultant role.",
  body1: "At Princess Alexandra Hospital I have spent the past five years as a senior clinician in one of Queensland's busiest emergency departments. In that time I led a triage protocol redesign that cut average wait times by 22%, championed the facility-wide rollout of ieMR digital charting across 35 nursing staff, and served as After-Hours Nursing Coordinator managing clinical escalations across the entire hospital. These experiences have given me a strong command of high-acuity environments, patient flow management, and the operational realities of large public hospital nursing.",
  body2: "Before moving to emergency I spent four years in the ICU at Royal Brisbane and Women's Hospital, developing advanced competencies in ventilated patient care, CRRT, and IABP management. Across both settings I have been a committed preceptor — mentoring more than 40 graduate nurses through transition programs and receiving consistent recognition for the quality of my clinical supervision. I hold a Graduate Certificate in Emergency Nursing from Griffith University and current ACLS and APLS certifications.",
  body3: "I would welcome the opportunity to discuss how my background in high-acuity emergency and critical care nursing, combined with my leadership experience and passion for mentoring the next generation of nurses, could contribute to your team at Gold Coast University Hospital.",
  closing: "Thank you for your time and consideration. I look forward to hearing from you.",
};

/* ============================================================
   COVER LETTER PREVIEW — template-aware
   ============================================================ */
function CoverLetterPreview({ cl, template, accent, accent2 }) {
  const empty = !cl.senderName && !cl.company && !cl.opening;
  const tpl = template || TEMPLATES['corporate-boardroom'];
  const ac  = accent  || tpl.accent;
  const ac2 = accent2 || tpl.accent2;
  const nameFont = tpl.nameFont || INTER;
  const bodyFont = tpl.bodyFont || INTER;
  const layout   = tpl.layout   || 'dark-header';
  const boldHeader = tpl.boldHeader || false;

  if (empty) return (
    <div style={{ width:'8.5in', minHeight:'11in', background:'#FAFAFA', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 12px 40px -10px rgba(0,0,0,0.18)', boxSizing:'border-box' }}>
      <div style={{ textAlign:'center', color:'#bbb', fontFamily:INTER, fontSize:'11pt' }}>
        <div style={{ fontSize:'24pt', marginBottom:'0.15in' }}>✉</div>
        Fill in the form to preview your cover letter
      </div>
    </div>
  );

  const paragraphs = [cl.opening, cl.body1, cl.body2, cl.body3].filter(Boolean);
  const salutation = `Dear ${cl.recipientName || 'Hiring Manager'},`;
  const closingLine = cl.closing || 'Thank you for your time and consideration.';

  /* ── Shared body block (date, recipient, salutation, body, sign-off) ── */
  const BodyBlock = ({ pad='0.5in 0.7in 0.7in', darkBg=false }) => {
    const tc = darkBg ? 'rgba(255,255,255,0.92)' : '#1c1c1c';
    const sc = darkBg ? 'rgba(255,255,255,0.6)'  : '#555';
    const hf = darkBg ? hexToRgba('#fff',0.55) : '#999';
    return (
      <div style={{ padding:pad, boxSizing:'border-box' }}>
        {cl.date && <div style={{ fontFamily:bodyFont, fontSize:'9.5pt', color:sc, marginBottom:'0.2in' }}>{cl.date}</div>}
        {(cl.recipientName||cl.recipientTitle||cl.company) && (
          <div style={{ fontFamily:bodyFont, fontSize:'9.5pt', color:tc, lineHeight:1.7, marginBottom:'0.28in' }}>
            {cl.recipientName && <div style={{ fontWeight:600 }}>{cl.recipientName}</div>}
            {cl.recipientTitle && <div style={{ color:sc }}>{cl.recipientTitle}</div>}
            {cl.company && <div style={{ color:sc }}>{cl.company}</div>}
            {cl.companyAddress && <div style={{ color:hf }}>{cl.companyAddress}</div>}
          </div>
        )}
        <div style={{ fontFamily:bodyFont, fontSize:'10.5pt', color:tc, marginBottom:'0.2in' }}>{salutation}</div>
        {paragraphs.map((p,i) => <p key={i} style={{ fontFamily:bodyFont, fontSize:'10.5pt', color:tc, lineHeight:1.78, margin:'0 0 0.18in 0' }}>{p}</p>)}
        <div style={{ fontFamily:bodyFont, fontSize:'10.5pt', color:tc, marginTop:'0.06in' }}>{closingLine}</div>
        <div style={{ fontFamily:bodyFont, fontSize:'10.5pt', color:tc, marginTop:'0.28in' }}>Sincerely,</div>
        <div style={{ fontFamily:nameFont, fontSize:'12pt', fontWeight:700, color: darkBg ? '#fff' : ac, marginTop:'0.32in', letterSpacing:'-0.01em' }}>{cl.senderName||''}</div>
        {cl.senderTitle && <div style={{ fontFamily:bodyFont, fontSize:'9pt', color:sc, marginTop:'0.04in', fontStyle:'italic' }}>{cl.senderTitle}</div>}
      </div>
    );
  };

  /* ── Contact line helper ── */
  const contactItems = [cl.senderEmail, cl.senderPhone, cl.senderLocation].filter(Boolean);
  const contactStr   = contactItems.join('  ·  ');

  /* ── dark-header / trades-operator style ── */
  if (['dark-header','diagonal-band','header-band'].includes(layout)) {
    const isDiag = layout === 'diagonal-band';
    const isBand = layout === 'header-band';
    return (
      <div style={{ width:'8.5in', minHeight:'11in', background:'#FAFAFA', boxSizing:'border-box', boxShadow:'0 12px 40px -10px rgba(0,0,0,0.18)' }}>
        <div style={{ background:ac, padding: isBand ? '0.38in 0.75in' : '0.42in 0.65in', boxSizing:'border-box', position:'relative', overflow:'hidden' }}>
          {!isDiag && !isBand && ac2 && <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'3px', background:ac2 }} />}
          {isDiag && <><div style={{ position:'absolute', top:0, right:0, width:'40%', height:'100%', background:ac2||'#555', clipPath:'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)' }}/><div style={{ position:'absolute', bottom:0, left:0, right:0, height:'4px', background:ac2||'#555' }}/></>}
          <div style={{ position:'relative' }}>
            <h1 style={{ fontFamily:nameFont, fontSize: boldHeader?'30pt':'26pt', fontWeight:800, color:'#fff', margin:0, lineHeight:1.1, letterSpacing: boldHeader?'0.05em':'-0.01em', textTransform: boldHeader?'uppercase':'none' }}>{cl.senderName||'Your Name'}</h1>
            {cl.senderTitle && <div style={{ color:hexToRgba('#fff',0.7), fontSize:'10pt', marginTop:'0.06in', fontFamily:bodyFont, fontStyle:'italic' }}>{cl.senderTitle}</div>}
            {contactStr && <div style={{ color:hexToRgba('#fff',0.65), fontSize:'8.5pt', marginTop:'0.09in', fontFamily:bodyFont }}>{contactStr}</div>}
          </div>
        </div>
        <BodyBlock pad="0.45in 0.65in 0.7in" />
      </div>
    );
  }

  /* ── split-header (Meridian) ── */
  if (layout === 'split-header') {
    return (
      <div style={{ width:'8.5in', minHeight:'11in', background:'#FAFAFA', boxSizing:'border-box', boxShadow:'0 12px 40px -10px rgba(0,0,0,0.18)' }}>
        <div style={{ display:'flex', borderBottom:`3px solid ${ac}` }}>
          <div style={{ width:'2.5in', background:ac, padding:'0.4in 0.35in', display:'flex', flexDirection:'column', justifyContent:'center', gap:'0.08in', flexShrink:0 }}>
            <div style={{ fontFamily:nameFont, fontSize:'16pt', fontWeight:800, color:'#fff', lineHeight:1.15, wordBreak:'break-word' }}>{cl.senderName||'Your Name'}</div>
            {cl.senderTitle && <div style={{ fontFamily:bodyFont, fontSize:'8.5pt', color:'rgba(255,255,255,0.7)', fontStyle:'italic' }}>{cl.senderTitle}</div>}
            <div style={{ marginTop:'0.1in', fontFamily:bodyFont, fontSize:'8pt', color:'rgba(255,255,255,0.78)', lineHeight:1.65 }}>
              {cl.senderEmail && <div>{cl.senderEmail}</div>}
              {cl.senderPhone && <div>{cl.senderPhone}</div>}
              {cl.senderLocation && <div>{cl.senderLocation}</div>}
            </div>
          </div>
          <div style={{ flex:1, padding:'0.35in 0.45in', display:'flex', flexDirection:'column', justifyContent:'flex-end' }}>
            <h1 style={{ fontFamily:nameFont, fontSize:'26pt', fontWeight:800, color:ac, margin:0, lineHeight:1.1 }}>{cl.senderName||'Your Name'}</h1>
          </div>
        </div>
        <BodyBlock pad="0.38in 0.55in 0.7in" />
      </div>
    );
  }

  /* ── accent-strip (Stack) ── */
  if (layout === 'accent-strip') {
    return (
      <div style={{ width:'8.5in', minHeight:'11in', background:'#FAFAFA', boxSizing:'border-box', display:'flex', boxShadow:'0 12px 40px -10px rgba(0,0,0,0.18)' }}>
        <div style={{ width:'0.18in', background:ac, flexShrink:0 }} />
        <div style={{ flex:1, padding:'0.55in 0.55in 0.7in 0.45in', boxSizing:'border-box' }}>
          <div style={{ marginBottom:'0.35in', paddingBottom:'0.2in', borderBottom:`1px solid ${hexToRgba(ac,0.15)}` }}>
            <h1 style={{ fontFamily:nameFont, fontSize:'26pt', fontWeight:700, color:'#0d0d0d', margin:0, lineHeight:1.1 }}>{cl.senderName||'Your Name'}</h1>
            {cl.senderTitle && <div style={{ fontFamily:MONO_FACE, fontSize:'8.5pt', color:ac, marginTop:'0.06in' }}>{cl.senderTitle}</div>}
            {contactStr && <div style={{ fontFamily:MONO_FACE, fontSize:'7.5pt', color:'#555', marginTop:'0.07in', letterSpacing:'0.02em' }}>{contactStr}</div>}
          </div>
          <BodyBlock pad="0" />
        </div>
      </div>
    );
  }

  /* ── dark-sidebar / color-sidebar / sidebar-classic / cv-dense / hospitality ── */
  if (['dark-sidebar','color-sidebar','sidebar-classic','cv-dense','hospitality'].includes(layout)) {
    const isCv   = layout === 'cv-dense';
    const sideW  = isCv ? '2.1in' : layout === 'dark-sidebar' ? '2.35in' : layout === 'sidebar-classic' ? '2.45in' : '2.6in';
    const sideBg = ac;
    const dark   = true;
    return (
      <div style={{ width:'8.5in', minHeight:'11in', background:'#FAFAFA', boxSizing:'border-box', display:'flex', boxShadow:'0 12px 40px -10px rgba(0,0,0,0.18)' }}>
        <div style={{ width:sideW, background: isCv ? hexToRgba(ac,0.06) : sideBg, padding:'0.5in 0.3in', boxSizing:'border-box', flexShrink:0, borderRight: isCv ? `2px solid ${hexToRgba(ac,0.12)}` : 'none' }}>
          <div style={{ fontFamily:nameFont, fontSize: isCv?'14pt':'17pt', fontWeight:700, color: isCv?'#111':'#fff', lineHeight:1.2, wordBreak:'break-word' }}>{cl.senderName||'Your Name'}</div>
          {cl.senderTitle && <div style={{ fontFamily:bodyFont, fontSize:'8.5pt', color: isCv?'#666':'rgba(255,255,255,0.68)', marginTop:'0.06in', fontStyle:'italic', lineHeight:1.4 }}>{cl.senderTitle}</div>}
          <div style={{ marginTop:'0.2in', borderTop: isCv ? `1px solid ${hexToRgba(ac,0.2)}` : '1px solid rgba(255,255,255,0.18)', paddingTop:'0.15in' }}>
            <div style={{ fontFamily:bodyFont, fontSize:'7pt', textTransform:'uppercase', letterSpacing:'0.16em', color: isCv?ac:'rgba(255,255,255,0.45)', fontWeight:700, marginBottom:'0.1in' }}>Contact</div>
            {[cl.senderEmail, cl.senderPhone, cl.senderLocation].filter(Boolean).map((v,i)=>(
              <div key={i} style={{ fontFamily:bodyFont, fontSize:'8pt', color: isCv?'#444':'rgba(255,255,255,0.82)', marginBottom:'0.05in', wordBreak:'break-word' }}>{v}</div>
            ))}
          </div>
        </div>
        <div style={{ flex:1 }}><BodyBlock pad="0.5in 0.45in 0.7in 0.4in" /></div>
      </div>
    );
  }

  /* ── editorial (Verso) ── */
  if (layout === 'editorial') {
    return (
      <div style={{ width:'8.5in', minHeight:'11in', background:'#FEFEFE', boxSizing:'border-box', boxShadow:'0 12px 40px -10px rgba(0,0,0,0.12)' }}>
        <div style={{ padding:'0.55in 0.7in 0.3in', boxSizing:'border-box', borderBottom:`1px solid ${hexToRgba(ac,0.15)}` }}>
          <h1 style={{ fontFamily:nameFont, fontSize:'38pt', fontWeight:700, color:'#111', margin:0, lineHeight:1.0, letterSpacing:'-0.02em' }}>{cl.senderName||'Your Name'}</h1>
          {cl.senderTitle && <div style={{ fontFamily:bodyFont, fontSize:'10.5pt', color:ac, marginTop:'0.07in', fontStyle:'italic' }}>{cl.senderTitle}</div>}
          {contactStr && <div style={{ fontFamily:bodyFont, fontSize:'8pt', color:'#666', marginTop:'0.08in' }}>{contactStr}</div>}
          <div style={{ display:'flex', alignItems:'center', gap:'0.1in', marginTop:'0.18in' }}>
            <div style={{ width:'0.4in', height:'3px', background:ac }} />
            <div style={{ flex:1, height:'1px', background:hexToRgba(ac,0.15) }} />
            {ac2 && <div style={{ width:'0.15in', height:'3px', background:ac2 }} />}
          </div>
        </div>
        <BodyBlock pad="0.35in 0.7in 0.7in" />
      </div>
    );
  }

  /* ── two-tone-header (Clarity) ── */
  if (layout === 'two-tone-header') {
    return (
      <div style={{ width:'8.5in', minHeight:'11in', background:'#FAFAFA', boxSizing:'border-box', boxShadow:'0 12px 40px -10px rgba(0,0,0,0.18)' }}>
        <div style={{ display:'flex', borderBottom:`3px solid ${ac}` }}>
          <div style={{ background:ac, flex:'0 0 2.8in', display:'flex', alignItems:'center', justifyContent:'center', padding:'0.3in' }}>
            <div style={{ fontFamily:nameFont, fontSize:'14pt', fontWeight:700, color:'#fff', textAlign:'center', lineHeight:1.2 }}>{cl.senderName||'Your Name'}</div>
          </div>
          <div style={{ flex:1, background:hexToRgba(ac,0.06), padding:'0.3in 0.5in', display:'flex', flexDirection:'column', justifyContent:'center' }}>
            <h1 style={{ fontFamily:nameFont, fontSize:'22pt', fontWeight:700, color:ac, margin:0, lineHeight:1.1 }}>{cl.senderName||'Your Name'}</h1>
            {cl.senderTitle && <div style={{ fontFamily:bodyFont, fontSize:'10pt', color:'#555', marginTop:'0.05in', fontStyle:'italic' }}>{cl.senderTitle}</div>}
            {contactStr && <div style={{ fontFamily:bodyFont, fontSize:'8.5pt', color:'#666', marginTop:'0.07in' }}>{contactStr}</div>}
          </div>
        </div>
        <BodyBlock pad="0.4in 0.6in 0.7in" />
      </div>
    );
  }

  /* ── structured-cols / folio / cv-dense — clean centred header ── */
  if (['structured-cols','folio'].includes(layout)) {
    return (
      <div style={{ width:'8.5in', minHeight:'11in', background: layout==='folio'?'#FEFDF9':'#FAFAFA', boxSizing:'border-box', boxShadow:'0 12px 40px -10px rgba(0,0,0,0.14)' }}>
        <div style={{ padding:'0.55in 0.75in 0.3in', textAlign:'center', borderBottom:`1px solid ${hexToRgba(ac,0.2)}`, boxSizing:'border-box' }}>
          <h1 style={{ fontFamily:nameFont, fontSize:'30pt', fontWeight:700, color:'#111', margin:0, lineHeight:1.1 }}>{cl.senderName||'Your Name'}</h1>
          {cl.senderTitle && <div style={{ fontFamily:bodyFont, fontSize:'10.5pt', color:'#555', marginTop:'0.07in', fontStyle:'italic' }}>{cl.senderTitle}</div>}
          {contactStr && <div style={{ fontFamily:bodyFont, fontSize:'9pt', color:'#666', marginTop:'0.1in' }}>{contactStr}</div>}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'0.12in', marginTop:'0.18in' }}>
            <div style={{ width:'0.6in', height:'1px', background:hexToRgba(ac,0.3) }} />
            <div style={{ width:'6px', height:'6px', background:ac, transform:'rotate(45deg)' }} />
            <div style={{ width:'0.6in', height:'1px', background:hexToRgba(ac,0.3) }} />
          </div>
        </div>
        <BodyBlock pad="0.38in 0.75in 0.7in" />
      </div>
    );
  }

  /* ── ATS single-col — ultra clean, accent name ── */
  if (['ats-single-col','ats-lined'].includes(layout)) {
    const isLined = layout === 'ats-lined';
    return (
      <div style={{ width:'8.5in', minHeight:'11in', background:'#fff', boxSizing:'border-box', boxShadow:'0 12px 40px -10px rgba(0,0,0,0.12)', display:'flex' }}>
        {isLined && <div style={{ width:'0.12in', background:ac, flexShrink:0 }} />}
        <div style={{ flex:1, padding:'0.65in 0.8in 0.7in', boxSizing:'border-box' }}>
          <div style={{ borderBottom:`2px solid ${ac}`, paddingBottom:'0.18in', marginBottom:'0.3in' }}>
            <h1 style={{ fontFamily:nameFont, fontSize:'26pt', fontWeight:700, color:ac, margin:0, lineHeight:1.1 }}>{cl.senderName||'Your Name'}</h1>
            {cl.senderTitle&&<div style={{ fontFamily:bodyFont, fontSize:'10pt', color:'#555', marginTop:'0.04in', fontStyle:'italic' }}>{cl.senderTitle}</div>}
            {contactStr&&<div style={{ fontFamily:bodyFont, fontSize:'8.5pt', color:'#666', marginTop:'0.07in' }}>{contactStr}</div>}
          </div>
          <BodyBlock pad="0" />
        </div>
      </div>
    );
  }

  /* ── student-fresh — gradient header ── */
  if (layout === 'student-fresh') {
    return (
      <div style={{ width:'8.5in', minHeight:'11in', background:'#FAFAFA', boxSizing:'border-box', boxShadow:'0 12px 40px -10px rgba(0,0,0,0.15)' }}>
        <div style={{ background:`linear-gradient(135deg, ${ac} 0%, ${lighten(ac,0.15)} 100%)`, padding:'0.45in 0.7in', boxSizing:'border-box' }}>
          <h1 style={{ fontFamily:nameFont, fontSize:'26pt', fontWeight:800, color:'#fff', margin:0, lineHeight:1.1 }}>{cl.senderName||'Your Name'}</h1>
          {cl.senderTitle&&<div style={{ fontFamily:bodyFont, fontSize:'10pt', color:'rgba(255,255,255,0.78)', marginTop:'0.05in', fontStyle:'italic' }}>{cl.senderTitle}</div>}
          {contactStr&&<div style={{ fontFamily:bodyFont, fontSize:'8.5pt', color:'rgba(255,255,255,0.72)', marginTop:'0.08in' }}>{contactStr}</div>}
        </div>
        <BodyBlock pad="0.4in 0.7in 0.7in" />
      </div>
    );
  }

  /* ── exec-prestige — commanding two-section ── */
  if (layout === 'exec-prestige') {
    return (
      <div style={{ width:'8.5in', minHeight:'11in', background:'#F9F8F6', boxSizing:'border-box', boxShadow:'0 12px 40px -10px rgba(0,0,0,0.2)' }}>
        <div style={{ padding:'0.6in 0.8in 0.28in', boxSizing:'border-box', borderBottom:`3px solid ${ac}` }}>
          <h1 style={{ fontFamily:nameFont, fontSize:'32pt', fontWeight:800, color:'#111', margin:0, lineHeight:1.05, letterSpacing:'-0.02em' }}>{cl.senderName||'Your Name'}</h1>
          {cl.senderTitle&&<div style={{ fontFamily:bodyFont, fontSize:'12pt', color:ac, marginTop:'0.07in', fontWeight:600 }}>{cl.senderTitle}</div>}
          {contactStr&&<div style={{ fontFamily:bodyFont, fontSize:'8.5pt', color:'#666', marginTop:'0.09in' }}>{contactStr}</div>}
          <div style={{ display:'flex', gap:'0.1in', marginTop:'0.22in' }}>
            <div style={{ height:'4px', width:'0.6in', background:ac }} />
            <div style={{ height:'4px', flex:1, background:hexToRgba(ac,0.15) }} />
          </div>
        </div>
        <BodyBlock pad="0.4in 0.8in 0.7in" />
      </div>
    );
  }

  /* ── formal-serif — centred conservative ── */
  if (layout === 'formal-serif') {
    return (
      <div style={{ width:'8.5in', minHeight:'11in', background:'#FFFFFE', boxSizing:'border-box', boxShadow:'0 12px 40px -10px rgba(0,0,0,0.1)' }}>
        <div style={{ padding:'0.6in 0.85in 0.28in', boxSizing:'border-box', textAlign:'center' }}>
          <h1 style={{ fontFamily:nameFont, fontSize:'26pt', fontWeight:700, color:'#111', margin:0, lineHeight:1.1, letterSpacing:'0.02em' }}>{cl.senderName||'Your Name'}</h1>
          {cl.senderTitle&&<div style={{ fontFamily:bodyFont, fontSize:'10pt', color:'#555', marginTop:'0.06in', fontStyle:'italic' }}>{cl.senderTitle}</div>}
          {contactStr&&<div style={{ fontFamily:bodyFont, fontSize:'8.5pt', color:'#666', marginTop:'0.09in' }}>{contactStr}</div>}
          <div style={{ margin:'0.18in auto 0', width:'1.2in', height:'2px', background:ac }} />
          <div style={{ margin:'0.04in auto 0', width:'0.5in', height:'1px', background:hexToRgba(ac,0.35) }} />
        </div>
        <BodyBlock pad="0.22in 0.85in 0.7in" />
      </div>
    );
  }

  /* ── fitness — bold energetic ── */
  if (layout === 'fitness') {
    return (
      <div style={{ width:'8.5in', minHeight:'11in', background:'#F8F9FA', boxSizing:'border-box', boxShadow:'0 12px 40px -10px rgba(0,0,0,0.18)' }}>
        <div style={{ background:ac, padding:'0.4in 0.65in', boxSizing:'border-box', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'4px', background:ac2||hexToRgba('#fff',0.3) }} />
          <h1 style={{ fontFamily:nameFont, fontSize:'28pt', fontWeight:800, color:'#fff', margin:0, lineHeight:1.05, letterSpacing:'0.02em', textTransform:'uppercase' }}>{cl.senderName||'Your Name'}</h1>
          {cl.senderTitle&&<div style={{ fontFamily:bodyFont, fontSize:'9pt', color:hexToRgba(ac2||'#fff',0.9), marginTop:'0.06in', fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase' }}>{cl.senderTitle}</div>}
          {contactStr&&<div style={{ fontFamily:bodyFont, fontSize:'8.5pt', color:'rgba(255,255,255,0.72)', marginTop:'0.09in' }}>{contactStr}</div>}
        </div>
        <BodyBlock pad="0.42in 0.65in 0.7in" />
      </div>
    );
  }

  /* ── real-estate — photo right ── */
  if (layout === 'real-estate') {
    return (
      <div style={{ width:'8.5in', minHeight:'11in', background:'#FAFAFA', boxSizing:'border-box', boxShadow:'0 12px 40px -10px rgba(0,0,0,0.18)' }}>
        <div style={{ background:'#fff', padding:'0.42in 0.7in 0.28in', boxSizing:'border-box', borderBottom:`2px solid ${ac}` }}>
          <h1 style={{ fontFamily:nameFont, fontSize:'28pt', fontWeight:800, color:'#111', margin:0, lineHeight:1.1 }}>{cl.senderName||'Your Name'}</h1>
          {cl.senderTitle&&<div style={{ fontFamily:bodyFont, fontSize:'11pt', color:ac, marginTop:'0.06in', fontWeight:600 }}>{cl.senderTitle}</div>}
          {contactStr&&<div style={{ fontFamily:bodyFont, fontSize:'8.5pt', color:'#666', marginTop:'0.09in' }}>{contactStr}</div>}
        </div>
        <BodyBlock pad="0.38in 0.7in 0.7in" />
      </div>
    );
  }

  /* ── freelancer — accent header + skills strip ── */
  if (layout === 'freelancer') {
    return (
      <div style={{ width:'8.5in', minHeight:'11in', background:'#F9F9F9', boxSizing:'border-box', boxShadow:'0 12px 40px -10px rgba(0,0,0,0.15)' }}>
        <div style={{ background:ac, padding:'0.38in 0.65in 0.32in', boxSizing:'border-box' }}>
          <h1 style={{ fontFamily:nameFont, fontSize:'26pt', fontWeight:800, color:'#fff', margin:0, lineHeight:1.1 }}>{cl.senderName||'Your Name'}</h1>
          {cl.senderTitle&&<div style={{ fontFamily:bodyFont, fontSize:'10pt', color:'rgba(255,255,255,0.75)', marginTop:'0.05in', fontWeight:500 }}>{cl.senderTitle}</div>}
          {contactStr&&<div style={{ fontFamily:bodyFont, fontSize:'8pt', color:'rgba(255,255,255,0.65)', marginTop:'0.08in' }}>{contactStr}</div>}
        </div>
        <BodyBlock pad="0.4in 0.65in 0.7in" />
      </div>
    );
  }

  /* ── fallback: clean minimal ── */
  return (
    <div style={{ width:'8.5in', minHeight:'11in', background:'#FAFAFA', boxSizing:'border-box', boxShadow:'0 12px 40px -10px rgba(0,0,0,0.18)', padding:'0.7in 0.8in 0.7in' }}>
      <div style={{ paddingBottom:'0.25in', marginBottom:'0.35in', borderBottom:`2px solid ${ac}` }}>
        <h1 style={{ fontFamily:nameFont, fontSize:'26pt', fontWeight:700, color:'#111', margin:0, lineHeight:1.1 }}>{cl.senderName||'Your Name'}</h1>
        {cl.senderTitle && <div style={{ fontFamily:bodyFont, fontSize:'10pt', color:ac, marginTop:'0.05in', fontStyle:'italic' }}>{cl.senderTitle}</div>}
        {contactStr && <div style={{ fontFamily:bodyFont, fontSize:'8.5pt', color:'#666', marginTop:'0.08in' }}>{contactStr}</div>}
      </div>
      <BodyBlock pad="0" />
    </div>
  );
}

/* ============================================================
   COVER LETTER FORM (embedded in left panel)
   ============================================================ */
function CoverLetterForm({ cl, setCl }) {
  const set = (k, v) => setCl(p => ({ ...p, [k]: v }));
  return (
    <div className="space-y-1">
      <CollapsibleSection title="CL — Your Details">
        <div><label className={labelClass}>Full name</label><input className={fieldClass} value={cl.senderName} onChange={e=>set('senderName',e.target.value)} placeholder="Jordan Ellis" /></div>
        <div><label className={labelClass}>Your title</label><input className={fieldClass} value={cl.senderTitle} onChange={e=>set('senderTitle',e.target.value)} placeholder="Senior Product Designer" /></div>
        <div className="grid grid-cols-2 gap-2">
          <div><label className={labelClass}>Email</label><input className={fieldClass} value={cl.senderEmail} onChange={e=>set('senderEmail',e.target.value)} placeholder="you@email.com" /></div>
          <div><label className={labelClass}>Phone</label><input className={fieldClass} value={cl.senderPhone} onChange={e=>set('senderPhone',e.target.value)} placeholder="+1 (415) 000-0000" /></div>
        </div>
        <div><label className={labelClass}>Location</label><input className={fieldClass} value={cl.senderLocation} onChange={e=>set('senderLocation',e.target.value)} placeholder="San Francisco, CA" /></div>
      </CollapsibleSection>

      <CollapsibleSection title="CL — Recipient & Company">
        <div><label className={labelClass}>Date</label><input className={fieldClass} value={cl.date} onChange={e=>set('date',e.target.value)} placeholder="May 28, 2026" /></div>
        <div className="grid grid-cols-2 gap-2">
          <div><label className={labelClass}>Hiring manager name</label><input className={fieldClass} value={cl.recipientName} onChange={e=>set('recipientName',e.target.value)} placeholder="Sarah Johnson" /></div>
          <div><label className={labelClass}>Their title</label><input className={fieldClass} value={cl.recipientTitle} onChange={e=>set('recipientTitle',e.target.value)} placeholder="Head of Design" /></div>
        </div>
        <div><label className={labelClass}>Company</label><input className={fieldClass} value={cl.company} onChange={e=>set('company',e.target.value)} placeholder="Atlassian" /></div>
        <div><label className={labelClass}>Company address <span className="normal-case font-normal text-stone-400">(optional)</span></label><input className={fieldClass} value={cl.companyAddress} onChange={e=>set('companyAddress',e.target.value)} placeholder="341 George St, Sydney NSW 2000" /></div>
      </CollapsibleSection>

      <CollapsibleSection title="CL — Letter Body">
        <p className="tool-body text-xs text-stone-500 leading-relaxed -mt-1">Write each paragraph separately. The preview assembles them in order.</p>
        <div><label className={labelClass}>Opening paragraph</label><textarea className={fieldClass} rows={4} value={cl.opening} onChange={e=>set('opening',e.target.value)} placeholder="Hook the reader — why this company, why now, what drives you." /></div>
        <div><label className={labelClass}>Body paragraph 1</label><textarea className={fieldClass} rows={4} value={cl.body1} onChange={e=>set('body1',e.target.value)} placeholder="Your strongest relevant achievement or experience." /></div>
        <div><label className={labelClass}>Body paragraph 2 <span className="normal-case font-normal text-stone-400">(optional)</span></label><textarea className={fieldClass} rows={4} value={cl.body2} onChange={e=>set('body2',e.target.value)} placeholder="A second achievement, skill, or angle." /></div>
        <div><label className={labelClass}>Body paragraph 3 <span className="normal-case font-normal text-stone-400">(optional)</span></label><textarea className={fieldClass} rows={3} value={cl.body3} onChange={e=>set('body3',e.target.value)} placeholder="Why you're excited about this specific role or team." /></div>
        <div><label className={labelClass}>Closing sentence</label><input className={fieldClass} value={cl.closing} onChange={e=>set('closing',e.target.value)} placeholder="Thank you for your time and consideration." /></div>
      </CollapsibleSection>
    </div>
  );
}

/* ============================================================
   EXPORT HELPERS
   ============================================================ */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href=url; a.download=filename; a.rel='noopener'; a.style.display='none';
  document.body.appendChild(a); a.click();
  setTimeout(()=>{ if(a.parentNode) a.parentNode.removeChild(a); URL.revokeObjectURL(url); }, 1500);
}

function exportToPDF(printAreaEl, data) {
  if (!printAreaEl) return;
  const resumeHTML = printAreaEl.innerHTML;
  const fullDoc = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${(data.name||'Resume').replace(/[<>&"']/g,'')}</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Sora:wght@400;500;600;700;800&family=Fraunces:ital,wght@0,400;0,600;0,700;1,400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Playfair+Display:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"><style>@page{size:letter;margin:0}html,body{margin:0;padding:0;background:white;-webkit-print-color-adjust:exact;print-color-adjust:exact}@media print{body{background:white}}</style></head><body>${resumeHTML}<script>(function(){function go(){try{window.focus();window.print();}catch(e){}}if(document.fonts&&document.fonts.ready){document.fonts.ready.then(function(){setTimeout(go,150)});}else{setTimeout(go,700);}})()</script></body></html>`;
  const w = window.open('','_blank','width=900,height=1100');
  if (!w) {
    const blob = new Blob([fullDoc], { type:'text/html;charset=utf-8' });
    downloadBlob(blob, ((data.name||'resume').replace(/[^a-z0-9]+/gi,'_').toLowerCase())+'.html');
    alert("Pop-ups are blocked, so we downloaded an HTML file instead — open it in your browser and use Ctrl/Cmd+P to save as PDF.");
    return;
  }
  w.document.open(); w.document.write(fullDoc); w.document.close();
}

function rtfEscape(s) { if (s==null) return ''; return String(s).replace(/\\/g,'\\\\').replace(/\{/g,'\\{').replace(/\}/g,'\\}').replace(/[\u0080-\uFFFF]/g,c=>`\\u${c.charCodeAt(0)}?`).replace(/\t/g,'\\tab ').replace(/\n/g,'\\line '); }
function hexToRtfColor(hex) { const h=(hex||'#000000').replace('#',''); return {r:parseInt(h.slice(0,2),16),g:parseInt(h.slice(2,4),16),b:parseInt(h.slice(4,6),16)}; }

function exportToWord(data, template, accent, accent2, name) {
  const filename = (name||'resume').replace(/[^a-z0-9]+/gi,'_').toLowerCase()+'.rtf';
  const accentRGB = hexToRtfColor(accent);
  const accent2RGB = accent2?hexToRtfColor(accent2):null;
  let colorTable = `{\\colortbl;\\red17\\green17\\blue17;\\red60\\green60\\blue60;\\red232\\green232\\blue232;\\red${accentRGB.r}\\green${accentRGB.g}\\blue${accentRGB.b};`;
  if (accent2RGB) colorTable += `\\red${accent2RGB.r}\\green${accent2RGB.g}\\blue${accent2RGB.b};`;
  colorTable += '}';
  const useSerif = template.bodyFont?.includes('Baskerville')||template.bodyFont?.includes('Playfair');
  const fontTable = useSerif?`{\\fonttbl{\\f0\\froman\\fcharset0 Garamond;}{\\f1\\fswiss\\fcharset0 Arial;}}`:`{\\fonttbl{\\f0\\fswiss\\fcharset0 Arial;}{\\f1\\froman\\fcharset0 Garamond;}}`;
  const out = [];
  out.push(`{\\rtf1\\ansi\\ansicpg1252\\deff0\\nouicompat`);
  out.push(fontTable); out.push(colorTable);
  out.push(`\\paperw12240\\paperh15840\\margl1080\\margr1080\\margt1080\\margb1080`);
  out.push(`\\f0\\fs22\\cf1`);
  if (data.name) out.push(`{\\pard\\ql\\sb0\\sa120\\fs52\\b\\cf1 ${rtfEscape(data.name)}\\par}`);
  const ci=[data.contact.location,data.contact.phone,data.contact.email,data.contact.linkedin,data.contact.website].filter(Boolean);
  if (ci.length) out.push(`{\\pard\\ql\\sb0\\sa240\\fs19\\cf2 ${rtfEscape(ci.join('  |  '))}\\par}`);
  const sh=(t)=>{ out.push(`{\\pard\\ql\\sb240\\sa60\\cf4\\fs19\\b ${rtfEscape(t.toUpperCase())}\\b0\\par}`); out.push(`{\\pard\\ql\\sb0\\sa120\\brdrb\\brdrs\\brdrw10\\brdrcf4\\par}`); };
  const s = data.summary||{};
  if (s.tagline||s.bullets?.length||s.skills?.length) {
    sh('Summary');
    if (s.bullets?.length) s.bullets.forEach(b=>out.push(`{\\pard\\fi-280\\li360\\sa60\\cf1\\fs22 \\u8226? \\tab ${rtfEscape(b)}\\par}`));
    if (s.tagline) out.push(`{\\pard\\ql\\sa60\\cf1\\fs22\\i ${rtfEscape(s.tagline)}\\i0\\par}`);
    if (s.skills?.length) out.push(`{\\pard\\ql\\sa120\\cf1\\fs22 ${rtfEscape(s.skills.join('  ·  '))}\\par}`);
  }
  if (data.experience?.length) { sh('Experience'); data.experience.forEach(exp=>{ const tl=[exp.title?`{\\b ${rtfEscape(exp.title)}\\b0}`:'',exp.company?` \\u8212? ${rtfEscape(exp.company)}`:'',exp.location?`, ${rtfEscape(exp.location)}`:''].join(''); const dr=[exp.start,exp.end].filter(Boolean).join(' \\u8212? '); out.push(`{\\pard\\ql\\sb120\\sa40\\tx9000\\tqr\\tx9000\\cf1\\fs22 ${tl}\\tab ${rtfEscape(dr)}\\par}`); if (exp.summary) out.push(`{\\pard\\ql\\sa40\\cf1\\fs22\\i ${rtfEscape(exp.summary)}\\i0\\par}`); if (exp.bullets?.length) exp.bullets.forEach(b=>out.push(`{\\pard\\fi-280\\li360\\sa30\\cf1\\fs22 \\u8226? \\tab ${rtfEscape(b)}\\par}`)); out.push(`{\\pard\\sb60\\par}`); }); }
  if (data.education?.length) { sh('Education'); data.education.forEach(ed=>{ const l=[ed.degree?`{\\b ${rtfEscape(ed.degree)}\\b0}`:'',ed.school?` \\u8212? ${rtfEscape(ed.school)}`:'',ed.location?`, ${rtfEscape(ed.location)}`:''].join(''); out.push(`{\\pard\\ql\\sb80\\sa40\\tx9000\\tqr\\tx9000\\cf1\\fs22 ${l}\\tab ${rtfEscape(ed.date||'')}\\par}`); if (ed.honors) out.push(`{\\pard\\ql\\sa40\\cf2\\fs21\\i ${rtfEscape(ed.honors)}\\i0\\par}`); }); }
  if (data.certifications?.length) { sh('Certifications & Licenses'); data.certifications.forEach(c=>out.push(`{\\pard\\fi-280\\li360\\sa40\\cf1\\fs22 \\u8226? \\tab {\\b ${rtfEscape(c.name)}\\b0}${c.org?`, ${rtfEscape(c.org)}`:''}${c.date?` (${rtfEscape(c.date)})`:''}`)); }
  if (data.projects?.length) { sh('Projects'); data.projects.forEach(p=>{ if(p.name) out.push(`{\\pard\\ql\\sb80\\sa40\\cf1\\fs22\\b ${rtfEscape(p.name)}\\b0\\par}`); if(p.description) out.push(`{\\pard\\ql\\sa40\\cf1\\fs22\\i ${rtfEscape(p.description)}\\i0\\par}`); if(p.bullets?.length) p.bullets.forEach(b=>out.push(`{\\pard\\fi-280\\li360\\sa30\\cf1\\fs22 \\u8226? \\tab ${rtfEscape(b)}\\par}`)); }); }
  if (data.awards?.length) { sh('Awards & Honors'); data.awards.forEach(a=>out.push(`{\\pard\\fi-280\\li360\\sa40\\cf1\\fs22 \\u8226? \\tab ${rtfEscape(a)}\\par}`)); }
  out.push(`}`);
  const blob = new Blob([out.join('\n')], { type:'application/rtf' });
  downloadBlob(blob, filename);
}

/* ============================================================
   FONTS CSS
   ============================================================ */
const TOOL_FONTS_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Sora:wght@400;500;600;700;800&family=Fraunces:ital,wght@0,400;0,600;0,700;1,400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Playfair+Display:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Cormorant+Garamond:wght@400;500;600;700&display=swap');
  .tool-display { font-family: 'Cormorant Garamond', Georgia, serif; }
  .tool-body { font-family: 'Inter', system-ui, sans-serif; }
  .pdf-print-area { position: absolute; left: -99999px; top: 0; width: 8.5in; pointer-events: none; }
  .preview-scroll::-webkit-scrollbar { width: 10px; height: 10px; }
  .preview-scroll::-webkit-scrollbar-track { background: transparent; }
  .preview-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 5px; }
  .preview-scroll::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.25); }
`;

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function ResumeGenerator() {
  const [unlocked, setUnlocked] = useState(false);
  const [pwInput, setPwInput] = useState('');
  const [pwError, setPwError] = useState(false);
  const [data, setData] = useState(SAMPLE_RESUME);
  const [cl, setCl] = useState(SAMPLE_CL);
  const [selectedTemplate, setSelectedTemplate] = useState('creative-editorial');
  const [activeCategory, setActiveCategory] = useState('creative');
  const [accentOverrides, setAccentOverrides] = useState({});
  const [clAccentOverride, setClAccentOverride] = useState(null);
  const [isExporting, setIsExporting] = useState(null);
  const [previewScale, setPreviewScale] = useState(0.78);
  const [previewHeight, setPreviewHeight] = useState(11 * 96);
  const [clScale, setClScale] = useState(0.78);
  const [clHeight, setClHeight] = useState(11 * 96);
  const [rightPanel, setRightPanel] = useState('resume');
  const previewRef     = useRef(null);
  const previewWrapRef = useRef(null);
  const clPreviewRef   = useRef(null);
  const clWrapRef      = useRef(null);
  const printAreaRef   = useRef(null);

  useEffect(() => {
    const fit = () => {
      if (previewWrapRef.current) {
        const w = previewWrapRef.current.clientWidth;
        setPreviewScale(Math.max(0.35, Math.min(1, (w-32)/(8.5*96))));
      }
      if (clWrapRef.current) {
        const w = clWrapRef.current.clientWidth;
        setClScale(Math.max(0.35, Math.min(1, (w-32)/(8.5*96))));
      }
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [unlocked, rightPanel]);

  useEffect(() => {
    if (!previewRef.current) return;
    const ob = new ResizeObserver(entries => { for (const e of entries) setPreviewHeight(e.contentRect.height+32); });
    ob.observe(previewRef.current);
    return () => ob.disconnect();
  }, [unlocked, selectedTemplate, data]);

  useEffect(() => {
    if (!clPreviewRef.current) return;
    const ob = new ResizeObserver(entries => { for (const e of entries) setClHeight(e.contentRect.height+32); });
    ob.observe(clPreviewRef.current);
    return () => ob.disconnect();
  }, [unlocked, cl, selectedTemplate, accentOverrides, clAccentOverride]);

  const template       = TEMPLATES[selectedTemplate];
  const overrides      = accentOverrides[selectedTemplate] || {};
  const effectiveAccent  = overrides.accent  || template.accent;
  const effectiveAccent2 = overrides.accent2 || template.accent2;
  const hasOverride    = !!(overrides.accent || overrides.accent2);

  // CL accent: uses override if set, otherwise mirrors resume accent
  const clAccent  = clAccentOverride || effectiveAccent;
  const clAccent2 = effectiveAccent2;
  const clHasOverride = !!clAccentOverride;

  const setAccent  = c => setAccentOverrides(p => ({ ...p, [selectedTemplate]: { ...(p[selectedTemplate]||{}), accent: c } }));
  const setAccent2 = c => setAccentOverrides(p => ({ ...p, [selectedTemplate]: { ...(p[selectedTemplate]||{}), accent2: c } }));
  const resetAccent = () => setAccentOverrides(p => { const n={...p}; delete n[selectedTemplate]; return n; });

  const pickCategory = catId => {
    setActiveCategory(catId);
    const cat = CATEGORIES.find(c=>c.id===catId);
    if (cat && !cat.variants.includes(selectedTemplate)) setSelectedTemplate(cat.variants[0]);
  };

  const handleUnlock = () => {
    if (pwInput === 'ResumeVersion4') { setUnlocked(true); setPwError(false); }
    else { setPwError(true); setPwInput(''); }
  };

  const handleExportPDF = () => {
    setIsExporting('pdf');
    try { exportToPDF(printAreaRef.current, data); }
    catch (err) { console.error(err); alert('PDF export failed: '+(err?.message||'')); }
    finally { setTimeout(()=>setIsExporting(null), 500); }
  };

  const handleExportDocx = () => {
    setIsExporting('docx');
    try { exportToWord(data, template, effectiveAccent, effectiveAccent2, data.name); }
    catch (err) { console.error(err); alert('Word export failed.'); }
    finally { setTimeout(()=>setIsExporting(null), 400); }
  };

  const handleExportCL = () => {
    if (!clPreviewRef.current) return;
    const fonts = `https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Sora:wght@400;500;600;700;800&family=Fraunces:ital,wght@0,400;0,600;0,700;1,400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Playfair+Display:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap`;
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Cover Letter</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?${fonts}"><style>@page{size:letter;margin:0}html,body{margin:0;padding:0;background:white;-webkit-print-color-adjust:exact;print-color-adjust:exact}</style></head><body>${clPreviewRef.current.innerHTML}<script>(function(){function go(){window.focus();window.print();}if(document.fonts&&document.fonts.ready){document.fonts.ready.then(function(){setTimeout(go,200);});}else{setTimeout(go,800);}})()</script></body></html>`;
    const w = window.open('','_blank','width=900,height=1100');
    if (!w) { alert('Please allow pop-ups to print.'); return; }
    w.document.open(); w.document.write(html); w.document.close();
  };

  const handleExportCLWord = () => {
    const accentRGB = hexToRtfColor(clAccent);
    const filename = ((cl.senderName||'cover-letter').replace(/[^a-z0-9]+/gi,'_').toLowerCase())+'_cover_letter.rtf';
    const useSerif = template.bodyFont?.includes('Baskerville')||template.bodyFont?.includes('Playfair')||template.bodyFont?.includes('Fraunces');
    const fontTable = useSerif
      ? `{\\fonttbl{\\f0\\froman\\fcharset0 Garamond;}{\\f1\\fswiss\\fcharset0 Arial;}}`
      : `{\\fonttbl{\\f0\\fswiss\\fcharset0 Arial;}{\\f1\\froman\\fcharset0 Garamond;}}`;
    const colorTable = `{\\colortbl;\\red17\\green17\\blue17;\\red80\\green80\\blue80;\\red${accentRGB.r}\\green${accentRGB.g}\\blue${accentRGB.b};}`;
    const out = [];
    out.push(`{\\rtf1\\ansi\\ansicpg1252\\deff0\\nouicompat`);
    out.push(fontTable);
    out.push(colorTable);
    out.push(`\\paperw12240\\paperh15840\\margl1152\\margr1152\\margt1152\\margb1152`);
    out.push(`\\f0\\fs22\\cf1`);
    // Sender name + title
    if (cl.senderName) out.push(`{\\pard\\ql\\sb0\\sa60\\fs40\\b\\cf3 ${rtfEscape(cl.senderName)}\\b0\\par}`);
    if (cl.senderTitle) out.push(`{\\pard\\ql\\sb0\\sa40\\fs22\\i\\cf2 ${rtfEscape(cl.senderTitle)}\\i0\\par}`);
    // Contact line
    const contactItems = [cl.senderEmail, cl.senderPhone, cl.senderLocation].filter(Boolean);
    if (contactItems.length) out.push(`{\\pard\\ql\\sb0\\sa240\\fs19\\cf2 ${rtfEscape(contactItems.join('  ·  '))}\\par}`);
    // Divider rule
    out.push(`{\\pard\\ql\\sb0\\sa240\\brdrb\\brdrs\\brdrw15\\brdrcf3\\par}`);
    // Date
    if (cl.date) out.push(`{\\pard\\ql\\sb0\\sa120\\fs20\\cf2 ${rtfEscape(cl.date)}\\par}`);
    // Recipient block
    if (cl.recipientName||cl.recipientTitle||cl.company) {
      out.push(`{\\pard\\ql\\sb120\\sa0\\fs21\\cf1`);
      if (cl.recipientName) out.push(`{\\b ${rtfEscape(cl.recipientName)}\\b0}\\line `);
      if (cl.recipientTitle) out.push(`${rtfEscape(cl.recipientTitle)}\\line `);
      if (cl.company) out.push(`${rtfEscape(cl.company)}\\line `);
      if (cl.companyAddress) out.push(`{\\cf2 ${rtfEscape(cl.companyAddress)}}`);
      out.push(`\\par}`);
    }
    // Salutation
    const salutation = `Dear ${cl.recipientName || 'Hiring Manager'},`;
    out.push(`{\\pard\\ql\\sb240\\sa120\\fs22\\cf1 ${rtfEscape(salutation)}\\par}`);
    // Body paragraphs
    [cl.opening, cl.body1, cl.body2, cl.body3].filter(Boolean).forEach(p => {
      out.push(`{\\pard\\ql\\sb0\\sa180\\fs22\\cf1 ${rtfEscape(p)}\\par}`);
    });
    // Closing
    if (cl.closing) out.push(`{\\pard\\ql\\sb60\\sa120\\fs22\\cf1 ${rtfEscape(cl.closing)}\\par}`);
    // Sign-off
    out.push(`{\\pard\\ql\\sb180\\sa60\\fs22\\cf1 Sincerely,\\par}`);
    out.push(`{\\pard\\ql\\sb240\\sa0\\fs24\\b\\cf3 ${rtfEscape(cl.senderName||'')}\\b0\\par}`);
    if (cl.senderTitle) out.push(`{\\pard\\ql\\sb40\\sa0\\fs20\\i\\cf2 ${rtfEscape(cl.senderTitle)}\\i0\\par}`);
    out.push(`}`);
    const blob = new Blob([out.join('\n')], { type:'application/rtf' });
    downloadBlob(blob, filename);
  };

  /* Accent control strip — reused for both resume and cover letter */
  const AccentStrip = ({ accent, accent2, setAcc, setAcc2, hasOvr, resetOvr, label='Accent', showMirror=false, isMirrored=false, onMirror }) => (
    <div className="border-t border-stone-100 py-2.5 flex items-center gap-3 flex-wrap">
      <span className="tool-body text-[10px] uppercase tracking-[0.22em] text-stone-500 font-medium">{label}</span>
      {showMirror && (
        <button onClick={onMirror} className={`tool-body text-[10px] px-2 py-0.5 rounded border transition-all ${isMirrored?'bg-stone-900 text-white border-stone-900':'border-stone-300 text-stone-600 hover:border-stone-500'}`}>
          {isMirrored ? '✓ Mirrors resume' : 'Mirror resume'}
        </button>
      )}
      {!isMirrored && <>
        <div className="flex items-center gap-1.5">
          <label className="relative w-7 h-7 rounded-full overflow-hidden border border-stone-300 cursor-pointer hover:border-stone-500 transition-colors">
            <input type="color" value={accent} onChange={e=>setAcc(e.target.value)} className="absolute inset-0 w-full h-full cursor-pointer opacity-0" />
            <span className="absolute inset-0 pointer-events-none" style={{ background: accent }} />
          </label>
          <input type="text" value={accent.toUpperCase()}
            onChange={e=>{const v=e.target.value.trim();if(/^#?[0-9a-fA-F]{0,6}$/.test(v))setAcc(v.startsWith('#')?v:'#'+v);}}
            className="tool-body w-[5.5rem] px-2 py-1 text-[11px] font-mono uppercase border border-stone-300 rounded bg-white focus:outline-none focus:border-stone-600" />
        </div>
        <div className="hidden sm:flex items-center gap-1">
          {ACCENT_PRESETS.map(p => {
            const active = accent.toLowerCase()===p.value.toLowerCase();
            return <button key={p.value} onClick={()=>setAcc(p.value)} className={`w-5 h-5 rounded-full border transition-transform hover:scale-110 ${active?'border-stone-900 ring-1 ring-stone-900 ring-offset-1':'border-stone-300'}`} style={{ background:p.value }} title={p.name} aria-label={p.name} />;
          })}
        </div>
        {template.accent2 && setAcc2 && (
          <>
            <span className="text-stone-300 hidden sm:inline">|</span>
            <span className="tool-body text-[10px] uppercase tracking-[0.22em] text-stone-500 font-medium">Secondary</span>
            <label className="relative w-7 h-7 rounded-full overflow-hidden border border-stone-300 cursor-pointer hover:border-stone-500 transition-colors">
              <input type="color" value={accent2||'#E05C20'} onChange={e=>setAcc2(e.target.value)} className="absolute inset-0 w-full h-full cursor-pointer opacity-0" />
              <span className="absolute inset-0 pointer-events-none" style={{ background:accent2||'#E05C20' }} />
            </label>
          </>
        )}
        {hasOvr && <button onClick={resetOvr} className="tool-body ml-auto text-[11px] text-stone-600 hover:text-stone-900 underline underline-offset-2 decoration-stone-300 hover:decoration-stone-700 transition-colors">Reset</button>}
      </>}
    </div>
  );

  /* ── PASSWORD GATE ── */
  if (!unlocked) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center" style={{ background: '#FAF7F0' }}>
        <style>{TOOL_FONTS_CSS}</style>
        <div className="w-full max-w-sm mx-auto px-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-stone-900 mb-5"><Lock className="w-5 h-5 text-white" /></div>
            <h1 className="tool-display text-4xl text-stone-900 italic mb-2">Résumé</h1>
            <p className="tool-body text-sm text-stone-500">Enter the password to continue.</p>
          </div>
          <div className="bg-white border border-stone-300/80 rounded-md shadow-sm overflow-hidden">
            <input type="password" value={pwInput} onChange={e=>{setPwInput(e.target.value);setPwError(false);}} onKeyDown={e=>e.key==='Enter'&&handleUnlock()} placeholder="Password" autoFocus
              className={`tool-body w-full px-4 py-3 text-sm text-stone-800 focus:outline-none bg-transparent border-b ${pwError?'border-red-300':'border-stone-200'}`} />
            <div className="px-4 py-3 flex items-center justify-between bg-stone-50/50">
              {pwError ? <span className="tool-body text-xs text-red-600">Incorrect password — try again.</span> : <span/>}
              <button onClick={handleUnlock} className="tool-body bg-stone-900 hover:bg-stone-700 text-white px-5 py-2 rounded text-sm font-medium transition-colors">Unlock</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── MAIN EDITOR ── */
  return (
    <div className="min-h-screen w-full" style={{ background: '#F0EDE3' }}>
      <style>{TOOL_FONTS_CSS}</style>

      {/* Header */}
      <header className="bg-white/70 backdrop-blur-sm border-b border-stone-300/70 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="tool-display text-xl text-stone-900 italic leading-none">Résumé</div>
          <span className="hidden sm:inline text-stone-300">|</span>
          <span className="hidden sm:inline tool-body text-xs uppercase tracking-[0.2em] text-stone-500">Editor</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { setData(SAMPLE_RESUME); setCl(SAMPLE_CL); setSelectedTemplate('creative-editorial'); setActiveCategory('creative'); setClAccentOverride(null); }}
            className="tool-body text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-stone-100 transition-colors">
            <RotateCcw className="w-3.5 h-3.5" /> Load sample
          </button>
          <button onClick={() => { setData(EMPTY_RESUME); setCl(EMPTY_CL); }}
            className="tool-body text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-stone-100 border border-stone-200 hover:border-stone-400 transition-colors">
            <X className="w-3 h-3" /> Clear
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,28rem)_minmax(0,1fr)] gap-0">

        {/* ── LEFT PANEL: Resume form + Cover Letter form ── */}
        <aside className="bg-white border-r border-stone-200 lg:h-[calc(100vh-49px)] lg:overflow-y-auto preview-scroll">
          <div className="p-5">
            {/* Resume section header */}
            <div className="flex items-center gap-2 mb-4">
              <Edit3 className="w-4 h-4 text-stone-500" />
              <h2 className="tool-display text-lg text-stone-900">Resume</h2>
            </div>
            <p className="tool-body text-xs text-stone-500 mb-5 leading-relaxed">Fill in your details. The preview updates as you type.</p>
            <ResumeForm data={data} setData={setData} />

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-stone-200" />
              <div className="flex items-center gap-1.5">
                <FileEdit className="w-3.5 h-3.5 text-stone-400" />
                <span className="tool-body text-xs uppercase tracking-[0.18em] text-stone-400 font-medium">Cover Letter</span>
              </div>
              <div className="flex-1 h-px bg-stone-200" />
            </div>
            <p className="tool-body text-xs text-stone-500 mb-5 leading-relaxed">Fill in your cover letter details below. Switch to the Cover Letter tab to see the preview.</p>
            <CoverLetterForm cl={cl} setCl={setCl} />
          </div>
        </aside>

        {/* ── RIGHT PANEL: tabs ── */}
        <main className="lg:h-[calc(100vh-49px)] flex flex-col overflow-hidden">

          {/* Tab bar */}
          <div className="bg-white border-b border-stone-200 px-3 md:px-5 pt-0 flex items-end gap-0">
            <button onClick={() => setRightPanel('resume')} className={`tool-body px-4 py-2.5 text-xs uppercase tracking-[0.15em] border-b-2 transition-colors ${rightPanel==='resume'?'border-stone-900 text-stone-900 font-medium':'border-transparent text-stone-500 hover:text-stone-800'}`}>Resume</button>
            <button onClick={() => setRightPanel('coverletter')} className={`tool-body px-4 py-2.5 text-xs uppercase tracking-[0.15em] border-b-2 transition-colors flex items-center gap-1.5 ${rightPanel==='coverletter'?'border-stone-900 text-stone-900 font-medium':'border-transparent text-stone-500 hover:text-stone-800'}`}>
              <FileEdit className="w-3 h-3" /> Cover Letter
            </button>
          </div>

          {/* ── RESUME TAB ── */}
          {rightPanel === 'resume' && <>
            <div className="bg-white border-b border-stone-200 px-3 md:px-5 pt-3">
              <div className="flex gap-1 overflow-x-auto preview-scroll pb-px">
                {CATEGORIES.map(cat => (
                  <button key={cat.id} onClick={() => pickCategory(cat.id)}
                    className={`tool-body px-3 py-2 text-xs uppercase tracking-[0.15em] whitespace-nowrap border-b-2 transition-colors ${activeCategory===cat.id?'border-stone-900 text-stone-900 font-medium':'border-transparent text-stone-500 hover:text-stone-800'}`}>
                    {cat.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 py-3">
                {CATEGORIES.find(c=>c.id===activeCategory).variants.map(tplId => {
                  const tpl = TEMPLATES[tplId];
                  const active = tplId === selectedTemplate;
                  const tplAccent = (accentOverrides[tplId]?.accent) || tpl.accent;
                  return (
                    <button key={tplId} onClick={() => setSelectedTemplate(tplId)}
                      className={`tool-body text-left px-3.5 py-2 rounded text-xs border transition-all ${active?'border-stone-900 bg-stone-900 text-white shadow-sm':'border-stone-300 bg-white text-stone-700 hover:border-stone-500'}`}>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: tplAccent }} />
                        <span className="font-medium">{tpl.label}</span>
                        {active && <Check className="w-3 h-3 ml-1" />}
                      </div>
                      <div className={`text-[10.5px] mt-0.5 leading-tight ${active?'text-stone-300':'text-stone-500'}`}>{tpl.blurb}</div>
                    </button>
                  );
                })}
              </div>
              <AccentStrip accent={effectiveAccent} accent2={effectiveAccent2} setAcc={setAccent} setAcc2={setAccent2} hasOvr={hasOverride} resetOvr={resetAccent} label="Accent" />
            </div>

            <div ref={previewWrapRef} className="flex-1 overflow-auto preview-scroll p-4 md:p-8" style={{ background:'#E8E4D8' }}>
              <div style={{ width:`${8.5*previewScale}in`, minHeight:`${previewHeight*previewScale}px`, margin:'0 auto', paddingBottom:'2rem' }}>
                <div style={{ transform:`scale(${previewScale})`, transformOrigin:'top left', width:'8.5in' }}>
                  <TemplatePreview ref={previewRef} template={template} data={data} accent={effectiveAccent} accent2={effectiveAccent2} />
                </div>
              </div>
            </div>

            <div className="border-t border-stone-200 bg-white px-4 py-3 flex items-center justify-between gap-3">
              <div className="hidden md:block">
                <div className="tool-body text-[10px] uppercase tracking-[0.2em] text-stone-500">Currently</div>
                <div className="tool-display text-base text-stone-900">{template.label}</div>
              </div>
              <div className="flex gap-2 ml-auto">
                <button onClick={handleExportDocx} disabled={isExporting!==null}
                  className="tool-body bg-white border border-stone-900 text-stone-900 hover:bg-stone-100 disabled:opacity-50 px-4 py-2.5 rounded text-sm font-medium flex items-center gap-2 transition-colors">
                  {isExporting==='docx'?<Loader2 className="w-4 h-4 animate-spin"/>:<FileText className="w-4 h-4"/>} Download Word
                </button>
                <button onClick={handleExportPDF} disabled={isExporting!==null}
                  className="tool-body bg-stone-900 hover:bg-stone-700 disabled:bg-stone-400 text-white px-4 py-2.5 rounded text-sm font-medium flex items-center gap-2 transition-colors">
                  {isExporting==='pdf'?<Loader2 className="w-4 h-4 animate-spin"/>:<Download className="w-4 h-4"/>} Download PDF
                </button>
              </div>
            </div>
          </>}

          {/* ── COVER LETTER TAB ── */}
          {rightPanel === 'coverletter' && <>
            {/* Template + accent strip for CL */}
            <div className="bg-white border-b border-stone-200 px-3 md:px-5 pt-3">
              <div className="flex gap-1 overflow-x-auto preview-scroll pb-px">
                {CATEGORIES.map(cat => (
                  <button key={cat.id} onClick={() => pickCategory(cat.id)}
                    className={`tool-body px-3 py-2 text-xs uppercase tracking-[0.15em] whitespace-nowrap border-b-2 transition-colors ${activeCategory===cat.id?'border-stone-900 text-stone-900 font-medium':'border-transparent text-stone-500 hover:text-stone-800'}`}>
                    {cat.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 py-3">
                {CATEGORIES.find(c=>c.id===activeCategory).variants.map(tplId => {
                  const tpl = TEMPLATES[tplId];
                  const active = tplId === selectedTemplate;
                  const tplAccent = (accentOverrides[tplId]?.accent) || tpl.accent;
                  return (
                    <button key={tplId} onClick={() => setSelectedTemplate(tplId)}
                      className={`tool-body text-left px-3.5 py-2 rounded text-xs border transition-all ${active?'border-stone-900 bg-stone-900 text-white shadow-sm':'border-stone-300 bg-white text-stone-700 hover:border-stone-500'}`}>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: tplAccent }} />
                        <span className="font-medium">{tpl.label}</span>
                        {active && <Check className="w-3 h-3 ml-1" />}
                      </div>
                      <div className={`text-[10.5px] mt-0.5 leading-tight ${active?'text-stone-300':'text-stone-500'}`}>{tpl.blurb}</div>
                    </button>
                  );
                })}
              </div>
              <AccentStrip
                accent={clAccent} accent2={clAccent2}
                setAcc={v => setClAccentOverride(v)}
                setAcc2={null}
                hasOvr={clHasOverride}
                resetOvr={() => setClAccentOverride(null)}
                label="Cover letter accent"
                showMirror={true}
                isMirrored={!clAccentOverride}
                onMirror={() => setClAccentOverride(null)}
              />
            </div>

            <div ref={clWrapRef} className="flex-1 overflow-auto preview-scroll p-4 md:p-8" style={{ background:'#E8E4D8' }}>
              <div style={{ width:`${8.5*clScale}in`, minHeight:`${clHeight*clScale}px`, margin:'0 auto', paddingBottom:'2rem' }}>
                <div style={{ transform:`scale(${clScale})`, transformOrigin:'top left', width:'8.5in' }}>
                  <div ref={clPreviewRef}>
                    <CoverLetterPreview cl={cl} template={template} accent={clAccent} accent2={clAccent2} />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-stone-200 bg-white px-4 py-3 flex items-center justify-between gap-3">
              <div className="hidden md:block">
                <div className="tool-body text-[10px] uppercase tracking-[0.2em] text-stone-500">Style</div>
                <div className="tool-display text-base text-stone-900">{template.label}{!clAccentOverride ? ' · Mirroring resume' : ''}</div>
              </div>
              <div className="flex gap-2 ml-auto">
                <button onClick={handleExportCLWord}
                  className="tool-body bg-white border border-stone-900 text-stone-900 hover:bg-stone-100 px-4 py-2.5 rounded text-sm font-medium flex items-center gap-2 transition-colors">
                  <FileText className="w-4 h-4" /> Download Word
                </button>
                <button onClick={handleExportCL}
                  className="tool-body bg-stone-900 hover:bg-stone-700 text-white px-4 py-2.5 rounded text-sm font-medium flex items-center gap-2 transition-colors">
                  <Download className="w-4 h-4" /> Download PDF
                </button>
              </div>
            </div>
          </>}

        </main>
      </div>

      {/* Off-screen resume print area */}
      <div ref={printAreaRef} className="pdf-print-area" aria-hidden="true">
        <TemplatePreview template={template} data={data} accent={effectiveAccent} accent2={effectiveAccent2} />
      </div>
    </div>
  );
}
