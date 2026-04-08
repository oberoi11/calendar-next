'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

type NoteItem = {
  id: string;
  text: string;
  start: string | null;
  end: string | null;
  createdAt: number;
};

type DayCell = {
  date: Date;
  iso: string;
  dayNumber: number;
  currentMonth: boolean;
};

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const HERO_EVENTS: Record<string, { label: string; icon: string }> = {
  '2024-07-04': { label: 'Independence Day', icon: '🇺🇸' },
  '2024-07-21': { label: 'Beach Trip', icon: '🏖️' },
};

const MONTH_NOTE_SEED: Record<string, NoteItem[]> = {
  '2024-07': [
    {
      id: 'seed-1',
      text: 'Project Launch on July 12th! 🚀',
      start: '2024-07-12',
      end: '2024-07-15',
      createdAt: 1,
    },
    {
      id: 'seed-2',
      text: 'Pack for the beach on July 20th 🌴',
      start: '2024-07-20',
      end: '2024-07-21',
      createdAt: 2,
    },
  ],
};

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function toIso(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function addMonths(date: Date, delta: number) {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

function buildMonthGrid(visibleMonth: Date): DayCell[] {
  const start = startOfMonth(visibleMonth);
  const end = endOfMonth(visibleMonth);
  const leading = start.getDay();
  const totalDays = end.getDate();
  const cells: DayCell[] = [];

  for (let i = leading - 1; i >= 0; i -= 1) {
    const date = new Date(start);
    date.setDate(start.getDate() - (i + 1));
    cells.push({ date, iso: toIso(date), dayNumber: date.getDate(), currentMonth: false });
  }

  for (let day = 1; day <= totalDays; day += 1) {
    const date = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day);
    cells.push({ date, iso: toIso(date), dayNumber: day, currentMonth: true });
  }

  while (cells.length < 35) {
    const last = cells[cells.length - 1].date;
    const date = new Date(last);
    date.setDate(last.getDate() + 1);
    cells.push({ date, iso: toIso(date), dayNumber: date.getDate(), currentMonth: false });
  }

  if (cells.length % 7 !== 0 || cells.length < 42) {
    while (cells.length < 42) {
      const last = cells[cells.length - 1].date;
      const date = new Date(last);
      date.setDate(last.getDate() + 1);
      cells.push({ date, iso: toIso(date), dayNumber: date.getDate(), currentMonth: false });
    }
  }

  return cells;
}

function compareIso(a: string, b: string) {
  return a.localeCompare(b);
}

function normalizeRange(start: string | null, end: string | null) {
  if (!start || !end) return { start, end };
  return compareIso(start, end) <= 0 ? { start, end } : { start: end, end: start };
}

function isWithinRange(iso: string, start: string | null, end: string | null) {
  if (!start || !end) return false;
  const normalized = normalizeRange(start, end);
  return compareIso(iso, normalized.start!) >= 0 && compareIso(iso, normalized.end!) <= 0;
}

export default function WallCalendar() {
  const [visibleMonth, setVisibleMonth] = useState(new Date(2024, 6, 1));
  const [rangeStart, setRangeStart] = useState<string | null>('2024-07-12');
  const [rangeEnd, setRangeEnd] = useState<string | null>('2024-07-17');
  const [draftNote, setDraftNote] = useState('');
  const [notesByMonth, setNotesByMonth] = useState<Record<string, NoteItem[]>>({});
  const [hydrated, setHydrated] = useState(false);

  const currentMonthKey = monthKey(visibleMonth);

  useEffect(() => {
    const saved = window.localStorage.getItem('serene-wall-calendar-notes');
    if (saved) {
      setNotesByMonth(JSON.parse(saved));
    } else {
      setNotesByMonth(MONTH_NOTE_SEED);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem('serene-wall-calendar-notes', JSON.stringify(notesByMonth));
  }, [notesByMonth, hydrated]);

  const grid = useMemo(() => buildMonthGrid(visibleMonth), [visibleMonth]);
  const monthNotes = notesByMonth[currentMonthKey] ?? [];

  const markers = useMemo(() => {
    const map = new Map<string, { count: number; preview: string }>();
    for (const note of monthNotes) {
      if (note.start && note.end) {
        const normalized = normalizeRange(note.start, note.end);
        let cursor = new Date(normalized.start!);
        const end = new Date(normalized.end!);
        while (cursor <= end) {
          const iso = toIso(cursor);
          const prev = map.get(iso);
          map.set(iso, {
            count: (prev?.count ?? 0) + 1,
            preview: prev?.preview ?? note.text,
          });
          cursor.setDate(cursor.getDate() + 1);
        }
      }
    }
    return map;
  }, [monthNotes]);

  function handleDayClick(iso: string) {
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(iso);
      setRangeEnd(null);
      return;
    }
    if (rangeStart && !rangeEnd) {
      const normalized = normalizeRange(rangeStart, iso);
      setRangeStart(normalized.start);
      setRangeEnd(normalized.end);
    }
  }

  function addNote() {
    const value = draftNote.trim();
    if (!value) return;

    const item: NoteItem = {
      id: crypto.randomUUID(),
      text: value,
      start: rangeStart,
      end: rangeEnd ?? rangeStart,
      createdAt: Date.now(),
    };

    setNotesByMonth((prev) => ({
      ...prev,
      [currentMonthKey]: [item, ...(prev[currentMonthKey] ?? [])],
    }));
    setDraftNote('');
  }

  function deleteNote(id: string) {
    setNotesByMonth((prev) => ({
      ...prev,
      [currentMonthKey]: (prev[currentMonthKey] ?? []).filter((note) => note.id !== id),
    }));
  }

  return (
    <main className="scene-shell">
      <div className="calendar-board">
        <div className="spiral-bar" aria-hidden="true">
          {Array.from({ length: 32 }).map((_, i) => (
            <span key={i} className="spiral-ring" />
          ))}
        </div>

        <div className="calendar-panels">
          <section className="hero-panel">
            <div className="hero-frame">
              <Image
                src="/calendar-hero.png"
                alt="Serene mountain lake"
                fill
                priority
                className="hero-image"
              />
              <div className="hero-glow" />
            </div>
          </section>

          <section className="details-panel">
            <header className="calendar-header">
              <button className="nav-button" onClick={() => setVisibleMonth((prev) => addMonths(prev, -1))}>
                ‹ Prev
              </button>
              <div className="title-wrap">
                <h1>
                  {MONTH_NAMES[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}
                </h1>
                <span />
              </div>
              <button className="nav-button" onClick={() => setVisibleMonth((prev) => addMonths(prev, 1))}>
                Next ›
              </button>
            </header>

            <div className="weekday-row">
              {WEEKDAYS.map((weekday, index) => (
                <div key={weekday} className={index === 0 ? 'weekday sunday' : 'weekday'}>
                  {weekday}
                </div>
              ))}
            </div>

            <div className="calendar-grid">
              {grid.map((cell) => {
                const isStart = rangeStart === cell.iso;
                const isEnd = rangeEnd === cell.iso;
                const inRange = isWithinRange(cell.iso, rangeStart, rangeEnd);
                const event = HERO_EVENTS[cell.iso];
                const noteMarker = markers.get(cell.iso);

                return (
                  <button
                    key={cell.iso}
                    className={[
                      'day-cell',
                      cell.currentMonth ? '' : 'muted',
                      inRange ? 'in-range' : '',
                      isStart ? 'range-start' : '',
                      isEnd ? 'range-end' : '',
                      isStart && isEnd ? 'single-day' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => handleDayClick(cell.iso)}
                  >
                    <span className="day-number">{cell.dayNumber}</span>
                    {event ? (
                      <span className="event-label">
                        <span>{event.icon}</span>
                        <small>{event.label}</small>
                      </span>
                    ) : null}
                    {noteMarker ? <span className="note-dot" title={noteMarker.preview} /> : null}
                  </button>
                );
              })}
            </div>

            <section className="notes-card">
              <div className="notes-topbar">
                <h2>Notes</h2>
                <button className="add-chip" onClick={addNote}>
                  Add +
                </button>
              </div>

              <div className="selection-pill">
                {rangeStart && rangeEnd
                  ? `Selected: ${rangeStart} → ${rangeEnd}`
                  : rangeStart
                    ? `Start date: ${rangeStart} (pick an end date)`
                    : 'Pick a date range to attach a note'}
              </div>

              <ul className="notes-list">
                {monthNotes.length === 0 ? (
                  <li className="empty-state">No notes for this month yet.</li>
                ) : (
                  monthNotes.map((note) => (
                    <li key={note.id} className="note-item">
                      <div>
                        <p>{note.text}</p>
                        <span>
                          {note.start && note.end ? `${note.start} → ${note.end}` : 'Month note'}
                        </span>
                      </div>
                      <button onClick={() => deleteNote(note.id)} aria-label="Delete note">
                        ×
                      </button>
                    </li>
                  ))
                )}
              </ul>

              <div className="note-composer">
                <input
                  value={draftNote}
                  onChange={(e) => setDraftNote(e.target.value)}
                  placeholder="Write a new note..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') addNote();
                  }}
                />
                <button className="plus-button" onClick={addNote}>
                  +
                </button>
              </div>
            </section>
          </section>
        </div>
      </div>
    </main>
  );
}
