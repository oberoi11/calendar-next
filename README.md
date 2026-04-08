# 🗓️ Interactive Wall Calendar Component

A polished, responsive calendar component built with **Next.js (App Router)** and **React**, inspired by a physical wall calendar design.  
The goal of this project was to translate a static visual reference into a fully interactive, user-friendly frontend component.

---

## 🌟 Live Demo

👉 https://your-vercel-link.vercel.app

---

## 🎥 Video Demonstration

👉 https://your-video-link

---

## 📌 Overview

This project replicates a **wall calendar aesthetic** with a strong emphasis on:

- Visual hierarchy (hero image + calendar grid)
- Interactive date range selection
- Integrated notes system
- Responsive layout across devices

The component is designed to feel like a **digital version of a physical planner**, balancing design and usability.

---

## ✨ Features

### 📅 Dynamic Calendar Grid
- Generates calendar based on selected month and year
- Correct weekday alignment
- Handles varying month lengths automatically

### 🔄 Month Navigation
- Navigate between months using Previous / Next controls
- Seamlessly handles year transitions using JavaScript Date API

### 🎯 Date Range Selection
- Select start and end date with intuitive clicks
- Supports reversed selection (auto-corrects range)
- Visual states:
  - Start date
  - End date
  - Intermediate range

### 📝 Integrated Notes Section
- Allows users to add notes directly within the calendar
- Keeps the experience similar to a real planner

### 💾 Local Storage Persistence
- Notes are saved in `localStorage`
- Data persists even after page refresh
- No backend required (frontend-only as per requirement)

### 📱 Fully Responsive Design
- **Desktop**: Side-by-side layout (image + calendar)
- **Mobile**: Vertical stacked layout
- Maintains usability across screen sizes

---

## 🎨 Design Approach

The UI is inspired by a **physical wall calendar**, focusing on:

- Large scenic hero image as a visual anchor
- Paper-like background tones
- Clean grid layout for dates
- Integrated notes section to mimic planner usage

The goal was to **balance aesthetics with functionality**, ensuring the component is both visually appealing and easy to use.

---

## 🧠 Technical Approach

### State Management

The component manages:

- `currentDate` → controls visible month
- `startDate` → start of selected range
- `endDate` → end of selected range
- `notes` → stored user input

---

### Calendar Generation Logic

- Calculate first day of the month
- Calculate total number of days
- Fill leading empty cells for correct alignment
- Render dynamic grid

---

### Range Selection Logic

- First click → sets `startDate`
- Second click → sets `endDate`
- If second date < start date → swap automatically
- Conditional rendering used to style:
  - Start
  - End
  - Range

---

### Persistence Strategy

- Used `localStorage` for storing notes
- On component mount → retrieve stored notes
- On update → sync back to storage

This approach satisfies the **frontend-only constraint** of the assignment.

---

## 🧱 Component Architecture

For this challenge, the logic is kept **self-contained** within a single component to:

- Simplify state management
- Speed up development
- Keep interactions easy to reason about

> In a production environment, this would be split into:
- CalendarHeader
- CalendarGrid
- DayCell
- NotesPanel

---

## 📦 Tech Stack

- **Next.js (App Router)**
- **React**
- **TypeScript / JavaScript**
- **CSS (custom styling)**

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/oberoi11/calendar-next.git
cd calendar-next