[![CI/CD Pipeline](https://github.com/kmb1122/Teacher-Intervention-Dashboard/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/kmb1122/Teacher-Intervention-Dashboard/actions/workflows/ci-cd.yml)

# Teacher Intervention Board

A dashboard that flags students needing intervention based on their assessment data.

## Live Demo

[View Live Demo](https://teacher-intervention-dashboard.vercel.app/)

## Screenshots

<img width="1598" height="1005" alt="image" src="https://github.com/user-attachments/assets/ec439fbf-1a68-4fff-bf6a-5eee5e2d5283" />
<img width="452" height="908" alt="image" src="https://github.com/user-attachments/assets/bb2bddf7-985e-40ce-9ee2-402649710296" />

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Vitest

## Key Features

- Marks students who need **intervention** based on **assessment** data
- Sorts students who need intervention in specific classes
- Search students by name

## What I Built

- Created tests for intervention features, loading, empty, and error states, and the search bar
- Added loading, empty, and error states throughout the app

## Technical Decisions

Focused on accessibility by implementing:

- Keyboard-operable controls
- Form labels
- Visible focus states

## Testing

Used Vitest and React Testing Library to test filtering behavior, sorting, and error states.

## Accessibility

- Keyboard-operable controls
- Form labels
- Visible focus states
- Lighthouse accessibility score: **96%**

<img width="667" height="982" alt="image" src="https://github.com/user-attachments/assets/94adeda5-1941-45fa-9e5b-1135419eb45f" />

## Getting Started

```bash
git clone https://github.com/kmb1122/Teacher-Intervention-Dashboard
cd teacher-intervention-dashboard
npm install
npm run dev
```

## Known Limitations

- Uses sample data
- No authentication

## Future Improvements

- Student-specefic view
- Authentication
- Ability to add data
