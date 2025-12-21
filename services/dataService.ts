import { User } from '../types';

const SPREADSHEET_ID = '13rQdIhzb-Ve9GAClQwopVtS9u2CpGTj2aUy528a7YSw';
const API_KEY = 'AIzaSyCzPHhigfOD6oHw26JftVg3YyKLijwbyY4'; // Client-side key provided for this specific app
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwxHzlEhCYVZaPSJl4V6ptxcDkefM_SUJbwqpgVB9gZV3SGVbWYB3EGMf6tHP0PfET62w/exec';

// Interfaces for internal data fetching
interface SheetRow {
  values: string[];
}

export interface VideoMap {
  [key: string]: string; // key: "phase-week-day", value: url
}

export const fetchAllData = async () => {
  try {
    const [usersRes, skillsRes, progressRes, videosRes] = await Promise.all([
      fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Usuarios2?key=${API_KEY}`),
      fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Habilidades2?key=${API_KEY}`),
      fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Progreso2?key=${API_KEY}`),
      fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Videos2?key=${API_KEY}`)
    ]);

    const usersData = await usersRes.json();
    const skillsData = await skillsRes.json();
    const progressData = await progressRes.json();
    const videosData = await videosRes.json();

    return processData(usersData, skillsData, progressData, videosData);
  } catch (error) {
    console.error("Error fetching data from Google Sheets:", error);
    return { users: [], videos: {}, progressJsonMap: {} };
  }
};

const processData = (usersData: any, skillsData: any, progressData: any, videosData: any) => {
  const users: User[] = [];
  const videos: VideoMap = {};

  // Process Skills
  const skillsMap: Record<string, any> = {};
  if (skillsData.values) {
    skillsData.values.slice(1).forEach((row: string[]) => {
      if (row[0]) {
        skillsMap[row[0]] = {
          prompting: parseInt(row[3]) || 0,
          tools: parseInt(row[4]) || 0,
          analysis: parseInt(row[5]) || 0
        };
      }
    });
  }

  // Process Progress
  const progressMap: Record<string, any> = {};
  const progressJsonMap: Record<string, any> = {}; // Detailed JSON progress
  if (progressData.values) {
    progressData.values.slice(1).forEach((row: string[]) => {
      if (row[0]) {
        progressMap[row[0]] = {
          completed: parseInt(row[5]) || 0,
          total: 20 // Fixed total based on curriculum
        };
        // Store detailed JSON progress if available (Column H -> Index 7)
        if (row[7]) {
           try {
             progressJsonMap[row[0]] = JSON.parse(row[7]);
           } catch (e) {
             console.warn("Failed to parse progress JSON for user", row[0]);
           }
        }
      }
    });
  }

  // Process Users
  if (usersData.values) {
    usersData.values.slice(1).forEach((row: string[], index: number) => {
      if (row[0] && row[1]) {
        const email = row[0];
        const detailedProgress = progressJsonMap[email] || {};
        
        users.push({
          id: `u-${index}`,
          email: email,
          name: row[1],
          role: row[2] || 'Estudiante',
          avatar: row[1].charAt(0).toUpperCase(),
          stats: skillsMap[email] || { prompting: 0, tools: 0, analysis: 0 },
          progress: progressMap[email] || { completed: 0, total: 20 },
          // We attach the raw progress map to the user object temporarily to be used in the app state
          // In a strictly typed system we might want a separate field, but for now we can rely on local storage logic in App.tsx
          // or augment the type. We'll handle detailed progress merging in the component.
        });
      }
    });
  }

  // Process Videos
  if (videosData.values) {
    videosData.values.slice(1).forEach((row: string[]) => {
      if (row[0] && row[1] && row[2]) {
        // row[0] = phase, row[1] = week, row[2] = day (lunes, martes...)
        // Key format matching our logic: "1-1-lunes" (Phase 1 is implied for weeks 1-4 usually, but let's follow the sheet)
        // Actually, existing IDs are '1-1' (week-dayIdx). 
        // Let's create a map key: "week-dayName" (lowercase)
        const week = row[1];
        const day = row[2].toLowerCase();
        const url = row[3] || '';
        // Store as "week-day" e.g., "1-lunes"
        videos[`${week}-${day}`] = url;
      }
    });
  }

  return { users, videos, progressJsonMap };
};

export const saveUserProgress = async (user: User, progressJson: Record<string, boolean>) => {
  const completadas = Object.values(progressJson).filter(v => v).length;
  const jsonString = JSON.stringify(progressJson);

  try {
    // Send to Google Apps Script
    // mode: 'no-cors' is essential for GAS Web Apps
    await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            portal: 'simpledata',
            email: user.email,
            nombre: user.name,
            rol: user.role,
            completadas: completadas,
            progresoJSON: jsonString
        })
    });
    console.log("Progress saved to Google Sheets");
    return true;
  } catch (error) {
    console.error("Error saving progress:", error);
    return false;
  }
};