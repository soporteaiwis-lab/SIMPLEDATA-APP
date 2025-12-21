import { User } from '../types';

const SPREADSHEET_ID = '13rQdIhzb-Ve9GAClQwopVtS9u2CpGTj2aUy528a7YSw';
const API_KEY = 'AIzaSyCzPHhigfOD6oHw26JftVg3YyKLijwbyY4';
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwxHzlEhCYVZaPSJl4V6ptxcDkefM_SUJbwqpgVB9gZV3SGVbWYB3EGMf6tHP0PfET62w/exec';

export interface VideoMap {
  [key: string]: string; // key: "week-day", value: url
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

  // 1. Process Skills (Habilidades2)
  // Assuming columns: A:Email, D:Prompting, E:Tools, F:Analysis
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

  // 2. Process Progress (Progreso2)
  // Assuming columns: A:Email, F:Completed Count, H:JSON Data
  const progressMap: Record<string, any> = {};
  const progressJsonMap: Record<string, any> = {}; 
  
  if (progressData.values) {
    progressData.values.slice(1).forEach((row: string[]) => {
      if (row[0]) {
        // General stats
        progressMap[row[0]] = {
          completed: parseInt(row[5]) || 0,
          total: 20 // Fixed total
        };
        
        // Detailed JSON from column H (index 7)
        if (row[7]) {
           try {
             const rawJson = row[7];
             progressJsonMap[row[0]] = JSON.parse(rawJson);
           } catch (e) {
             console.warn(`Failed to parse progress JSON for user ${row[0]}`);
           }
        }
      }
    });
  }

  // 3. Process Users (Usuarios2)
  if (usersData.values) {
    usersData.values.slice(1).forEach((row: string[], index: number) => {
      if (row[0] && row[1]) {
        const email = row[0];
        
        users.push({
          id: `u-${index}`,
          email: email,
          name: row[1],
          role: row[2] || 'Estudiante',
          avatar: row[1].charAt(0).toUpperCase(),
          stats: skillsMap[email] || { prompting: 0, tools: 0, analysis: 0 },
          progress: progressMap[email] || { completed: 0, total: 20 },
        });
      }
    });
  }

  // 4. Process Videos (Videos2)
  if (videosData.values) {
    videosData.values.slice(1).forEach((row: string[]) => {
      // row[1] = week (number), row[2] = day (string), row[3] = url
      if (row[1] && row[2]) {
        const week = row[1];
        const day = row[2].trim().toLowerCase();
        const url = row[3] || '';
        videos[`${week}-${day}`] = url;
      }
    });
  }

  return { users, videos, progressJsonMap };
};

export const saveUserProgress = async (user: User, progressJson: Record<string, boolean>) => {
  const completadas = Object.values(progressJson).filter(v => v === true).length;
  const jsonString = JSON.stringify(progressJson);

  console.log("Saving progress to cloud...", { email: user.email, completadas, jsonString });

  try {
    // Send to Google Apps Script
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
    return true;
  } catch (error) {
    console.error("Error saving progress to Google Sheets:", error);
    return false;
  }
};