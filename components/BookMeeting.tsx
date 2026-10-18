import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../utils/supabase';

const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL as string | undefined;

// Start times only — a session runs as long as it needs, so we never promise a duration.
const TIMES = [9, 10, 11, 12, 13, 14];

const L = {
  en: {
    eyebrow: 'Book a meeting', head: "Let's talk.",
    name: 'Name', email: 'Email', phone: 'Number', company: 'Company',
    request: 'Request', sending: 'Sending…', tz: 'Jeddah time · GMT+3',
    taken: 'That time was just booked — please pick another.',
    sent: 'Request sent.', confirm: "A confirmation email is on its way to your inbox.", done: 'Done',
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    dowShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    dowFull: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    am: 'AM', pm: 'PM',
  },
  ar: {
    eyebrow: 'احجز اجتماعاً', head: 'لنتحدّث.',
    name: 'الاسم', email: 'البريد الإلكتروني', phone: 'رقم الجوال', company: 'اسم الشركة',
    request: 'إرسال الطلب', sending: 'جارٍ الإرسال…', tz: 'بتوقيت جدة · GMT+3',
    taken: 'هذا الموعد محجوز — الرجاء اختيار وقت آخر.',
    sent: 'تم إرسال طلبك.', confirm: 'وصلتك رسالة تأكيد على بريدك الإلكتروني.', done: 'تم',
    months: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
    dowShort: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
    dowFull: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
    am: 'ص', pm: 'م',
  },
};

type Step = 'date' | 'time' | 'form' | 'done';

export const BookMeeting: React.FC = () => {
  const { isLeadFormOpen, closeLeadForm, language } = useLanguage();
  const ar = language === 'ar';
  const s = L[language] ?? L.en;
  const fontCls = ar ? 'font-arabic' : 'font-mono';

  const today = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }, []);
  const [view, setView] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<number | null>(null);
  const [step, setStep] = useState<Step>('date');
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', company_website: '' });
  const [sending, setSending] = useState(false);
  // Slots already booked (keyed "YYYY-MM-DD:hour"), loaded from Supabase so two
  // people can never pick the same date+time. slotTaken = a race was just lost.
  const [taken, setTaken] = useState<Set<string>>(new Set());
  const [slotTaken, setSlotTaken] = useState(false);

  useEffect(() => {
    if (isLeadFormOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      const t = setTimeout(() => {
        setStep('date'); setDate(null); setTime(null);
        setForm({ name: '', email: '', phone: '', company: '', company_website: '' });
        setView(new Date(today.getFullYear(), today.getMonth(), 1));
      }, 300);
      return () => clearTimeout(t);
    }
  }, [isLeadFormOpen, today]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeLeadForm(); };
    if (isLeadFormOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isLeadFormOpen, closeLeadForm]);

  const sameMonth = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
  const isWorkday = (d: Date) => d.getDay() >= 0 && d.getDay() <= 4; // Sun–Thu
  const key = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const human = (d: Date) => ar ? `${s.dowFull[d.getDay()]}، ${d.getDate()} ${s.months[d.getMonth()]}` : `${s.dowFull[d.getDay()]}, ${d.getDate()} ${s.months[d.getMonth()].slice(0, 3)}`;
  const fmtTime = (h: number) => { const ap = h < 12 ? s.am : s.pm; const hh = h % 12 || 12; return `${hh}:00 ${ap}`; };
  const maxView = new Date(today.getFullYear(), today.getMonth() + 3, 1);

  // Pull the list of already-booked slots so we can gray them out. Best-effort:
  // if Supabase is unreachable the calendar still works, the DB just stays the
  // final guard against a double-booking at submit time.
  const refreshTaken = useCallback(async () => {
    if (!supabase) return;
    const from = key(today);
    const to = key(new Date(today.getFullYear(), today.getMonth() + 4, 0));
    try {
      const { data, error } = await supabase.rpc('taken_slots', { p_from: from, p_to: to });
      if (error || !Array.isArray(data)) return;
      setTaken(new Set(data.map((r: { slot_date: string; slot_hour: number }) => `${r.slot_date}:${r.slot_hour}`)));
    } catch { /* ignore — availability is best-effort */ }
  }, [today]);

  useEffect(() => { if (isLeadFormOpen) { setSlotTaken(false); refreshTaken(); } }, [isLeadFormOpen, refreshTaken]);

  // Current moment in Jeddah/Riyadh (GMT+3), so a slot that already passed there
  // can't be booked no matter what timezone the visitor's device is in.
  const riyadhNow = () => {
    const d = new Date();
    const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Riyadh' }).format(d);
    const hour = parseInt(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Riyadh', hour: '2-digit', hourCycle: 'h23' }).format(d), 10);
    return { date, hour };
  };
  const isPastSlot = (d: Date, h: number) => { const n = riyadhNow(); return key(d) === n.date && h <= n.hour; };
  const slotIsTaken = (d: Date, h: number) => taken.has(`${key(d)}:${h}`);
  const slotOff = (d: Date, h: number) => slotIsTaken(d, h) || isPastSlot(d, h);
  const dayFull = (d: Date) => TIMES.every((h) => slotOff(d, h));

  const days = useMemo(() => {
    const first = new Date(view.getFullYear(), view.getMonth(), 1);
    const start = first.getDay();
    const total = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < start; i++) cells.push(null);
    for (let d = 1; d <= total; d++) cells.push(new Date(view.getFullYear(), view.getMonth(), d));
    return cells;
  }, [view]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.company_website) { setStep('done'); return; }
    if (!date || time === null) return;
    if (isPastSlot(date, time)) { setSlotTaken(true); setStep('time'); return; } // slot passed while filling
    setSending(true);
    setSlotTaken(false);

    // 1) Reserve the slot in Supabase FIRST. The database refuses a second booking
    //    for the same date+time, so two clients can never collide. If the exact
    //    slot was just taken, bounce the user back to pick another time.
    if (supabase) {
      try {
        const { data, error } = await supabase.rpc('book_slot', {
          p_date: key(date), p_hour: time,
          p_name: form.name.trim(), p_email: form.email.trim(),
          p_phone: form.phone.trim(), p_company: form.company.trim(),
          p_language: language, p_honeypot: form.company_website || '',
        });
        if (!error && data === 'taken') {
          setSending(false); setSlotTaken(true);
          await refreshTaken(); setStep('time'); return;
        }
        // 'ok' | 'invalid' | network error → never lose the lead; email anyway.
      } catch { /* Supabase hiccup — fall through to the email automation */ }
    }

    const payload = {
      type: 'meeting',
      name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), company: form.company.trim(),
      date: key(date), dateHuman: `${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]}, ${date.getDate()} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][date.getMonth()]} ${date.getFullYear()}`,
      time: `${(time % 12 || 12)}:00 ${time < 12 ? 'AM' : 'PM'}`, timeHour: time,
      timezone: 'Asia/Riyadh', language, source: 'book-overlay',
    };
    try { if (WEBHOOK_URL) await fetch(WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); }
    catch { /* n8n still receives it; never block the user */ }
    finally { setSending(false); setStep('done'); }
  };

  // text-base (16px) is deliberate: iOS Safari auto-zooms into any input whose
  // font is < 16px, which is what forced the "I had to zoom out" on mobile.
  const input = `w-full bg-transparent border-b border-white/15 py-2.5 text-white ${fontCls} text-base focus:border-jarvis-orange outline-none transition placeholder:text-gray-600`;
  const back = ar ? '›' : '‹';

  return (
    <AnimatePresence>
      {isLeadFormOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={closeLeadForm}
          dir={ar ? 'rtl' : 'ltr'}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0.97, opacity: 0, y: 16 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.97, opacity: 0, y: 16 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[400px] max-h-[90vh] overflow-y-auto bg-[#0a0908] border border-white/10 clip-hex p-6 sm:p-8"
          >
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,#FF4500,transparent)' }} />
            <button onClick={closeLeadForm} aria-label="Close" className="absolute top-5 right-5 rtl:right-auto rtl:left-5 text-gray-600 hover:text-jarvis-orange transition"><X className="w-5 h-5" /></button>

            <div className="mb-7">
              <div className={`${fontCls} text-[10px] tracking-[0.3em] text-jarvis-orange uppercase`}>{s.eyebrow}</div>
              <h2 className={`mt-2 text-2xl font-extrabold tracking-tight text-white ${ar ? 'font-arabic' : ''}`}>{s.head}</h2>
            </div>

            <AnimatePresence mode="wait">
              {step === 'date' && (
                <motion.div key="date" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
                  <div className="flex items-center justify-between mb-4">
                    <button onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))} disabled={sameMonth(view, today)} className="w-8 h-8 grid place-items-center text-gray-500 hover:text-jarvis-orange disabled:opacity-20 disabled:pointer-events-none transition">{ar ? '›' : '‹'}</button>
                    <span className={`${fontCls} text-xs tracking-wide text-gray-300`}>{s.months[view.getMonth()]} {view.getFullYear()}</span>
                    <button onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))} disabled={view >= maxView} className="w-8 h-8 grid place-items-center text-gray-500 hover:text-jarvis-orange disabled:opacity-20 disabled:pointer-events-none transition">{ar ? '‹' : '›'}</button>
                  </div>
                  <div className={`grid grid-cols-7 text-center ${fontCls} text-[9px] text-gray-600 uppercase mb-2`}>
                    {s.dowShort.map((d, i) => <div key={i} className={i > 4 ? 'text-gray-800' : ''}>{d}</div>)}
                  </div>
                  <div className="grid grid-cols-7 gap-y-1">
                    {days.map((d, i) => {
                      if (!d) return <div key={i} />;
                      const disabled = d < today || !isWorkday(d) || dayFull(d);
                      const sel = date && key(date) === key(d);
                      return (
                        <button key={i} disabled={disabled}
                          onClick={() => { setSlotTaken(false); setDate(d); setTime(null); setStep('time'); }}
                          className={`aspect-square grid place-items-center font-mono text-sm rounded-sm transition
                            ${disabled ? 'text-gray-700 cursor-not-allowed' : sel ? 'bg-jarvis-orange text-black font-bold' : 'text-gray-300 hover:text-jarvis-orange'}`}>
                          {d.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {step === 'time' && date && (
                <motion.div key="time" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
                  <button onClick={() => setStep('date')} className={`${fontCls} text-[10px] text-gray-500 hover:text-jarvis-orange uppercase tracking-widest mb-5`}>{back} {human(date)}</button>
                  {slotTaken && <p className={`mb-3 ${fontCls} text-[11px] text-jarvis-orange ${ar ? 'font-arabic' : ''}`}>{s.taken}</p>}
                  <div className="grid grid-cols-3 gap-2">
                    {TIMES.map((h) => {
                      const off = slotOff(date, h);
                      const booked = slotIsTaken(date, h);
                      return (
                      <button key={h} disabled={off} onClick={() => { setSlotTaken(false); setTime(h); setStep('form'); }}
                        className={`py-3 font-mono text-xs rounded-sm border transition
                          ${off ? `border-white/5 text-gray-700 cursor-not-allowed ${booked ? 'line-through' : ''}` : time === h ? 'bg-jarvis-orange text-black border-jarvis-orange font-bold' : 'border-white/10 text-gray-300 hover:border-jarvis-orange hover:text-jarvis-orange'}`}>
                        {fmtTime(h)}
                      </button>
                      );
                    })}
                  </div>
                  <p className={`mt-5 ${fontCls} text-[10px] text-gray-600`}>{s.tz}</p>
                </motion.div>
              )}

              {step === 'form' && date && time !== null && (
                <motion.form key="form" onSubmit={submit} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }} className="space-y-5">
                  <button type="button" onClick={() => setStep('time')} className={`${fontCls} text-[10px] text-gray-500 hover:text-jarvis-orange uppercase tracking-widest`}>{back} {human(date)} · {fmtTime(time)}</button>
                  <input name="company_website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.company_website} onChange={(e) => setForm({ ...form, company_website: e.target.value })} className="absolute left-[-9999px] w-0 h-0 opacity-0" />
                  <input required placeholder={s.name} autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} />
                  <input required type="email" placeholder={s.email} autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={input} />
                  <input required type="tel" placeholder={s.phone} autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={input} />
                  <input required placeholder={s.company} autoComplete="organization" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className={input} />
                  <button type="submit" disabled={sending} className={`w-full mt-2 py-3.5 bg-jarvis-orange text-black ${fontCls} font-bold text-xs uppercase tracking-[0.3em] hover:bg-white transition disabled:opacity-50 disabled:pointer-events-none`}>
                    {sending ? s.sending : s.request}
                  </button>
                </motion.form>
              )}

              {step === 'done' && (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="py-6 text-center">
                  <div className="inline-grid place-items-center w-14 h-14 bg-jarvis-orange rounded-full mb-5"><Check className="w-7 h-7 text-black" strokeWidth={3} /></div>
                  <h3 className={`text-xl font-bold text-white ${ar ? 'font-arabic' : ''}`}>{s.sent}</h3>
                  {date && time !== null && <p className="mt-2 font-mono text-xs text-gray-400">{human(date)} · {fmtTime(time)}</p>}
                  <p className={`mt-1 ${fontCls} text-[11px] text-gray-600`}>{s.confirm}</p>
                  <button onClick={closeLeadForm} className={`mt-6 px-7 py-2.5 border border-white/15 text-white ${fontCls} text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition`}>{s.done}</button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
