import { User, WeekData } from './types';

// These constants now serve as the structure. 
// Video URLs and User Data are fetched from Google Sheets in dataService.ts

export const COURSE_CONTENT: WeekData[] = [
  {
    id: 1,
    title: "Fundamentos de IA y Productividad",
    sessions: [
      { id: '1-1', day: 'Lunes', title: 'Introducción a la IA Corporativa', description: 'Presentación del programa, objetivos y visión. ¿Qué es la IA y por qué es crucial para SIMPLEDATA?', videoUrl: '', isCompleted: false },
      { id: '1-2', day: 'Martes', title: 'Dominando ChatGPT y Claude', description: 'Aprenderás a usar las herramientas de IA más potentes del mercado para maximizar tu productividad.', videoUrl: '', isCompleted: false },
      { id: '1-3', day: 'Miércoles', title: 'Ingeniería de Prompts Profesional', description: 'Técnicas avanzadas de prompting para obtener resultados profesionales de los LLMs.', videoUrl: '', isCompleted: false },
      { id: '1-4', day: 'Jueves', title: 'IA para Desarrolladores I', description: 'Introducción al desarrollo con IA: Copilot, Cursor y herramientas de código asistido.', videoUrl: '', isCompleted: false },
      { id: '1-5', day: 'Viernes', title: 'Automatización de Tareas Diarias', description: 'Cómo automatizar tus tareas repetitivas usando IA y scripts simples.', videoUrl: '', isCompleted: false },
    ]
  },
  {
    id: 2,
    title: "IA Aplicada al Negocio",
    sessions: [
      { id: '2-1', day: 'Lunes', title: 'IA en Azure Databricks', description: 'Introducción a la plataforma Azure Databricks y casos de uso con IA.', videoUrl: '', isCompleted: false },
      { id: '2-2', day: 'Martes', title: 'Soluciones IA con Oracle y AWS', description: 'Panorama de soluciones IA en las plataformas cloud más importantes.', videoUrl: '', isCompleted: false },
      { id: '2-3', day: 'Miércoles', title: 'Automatización Real con N8N', description: 'Webinar práctico sobre cómo crear automatizaciones reales que se usan en producción.', videoUrl: '', isCompleted: false },
      { id: '2-4', day: 'Jueves', title: 'IA para el Sector Financiero', description: 'Casos de uso específicos de IA en el sector financiero y bancario.', videoUrl: '', isCompleted: false },
      { id: '2-5', day: 'Viernes', title: 'Venta de Soluciones IA', description: 'Cómo vender proyectos de IA a clientes: desde la prospección hasta el cierre.', videoUrl: '', isCompleted: false },
    ]
  },
  {
    id: 3,
    title: "Automatización Avanzada",
    sessions: [
      { id: '3-1', day: 'Lunes', title: 'Arquitectura de Sistemas IA', description: 'Diseño de arquitecturas escalables para soluciones de IA empresariales.', videoUrl: '', isCompleted: false },
      { id: '3-2', day: 'Martes', title: 'Agentes IA y LangChain', description: 'Creación de agentes inteligentes que pueden ejecutar tareas complejas de forma autónoma.', videoUrl: '', isCompleted: false },
      { id: '3-3', day: 'Miércoles', title: 'Automatización Avanzada: Workflows Enterprise', description: 'Webinar avanzado sobre workflows empresariales con N8N.', videoUrl: '', isCompleted: false },
      { id: '3-4', day: 'Jueves', title: 'Workshop: Propuestas para Cliente BCI', description: 'Workshop práctico desarrollando una propuesta real para el cliente BCI.', videoUrl: '', isCompleted: false },
      { id: '3-5', day: 'Viernes', title: 'Workshop: Automatizaciones Internas', description: 'Identificación y desarrollo de automatizaciones para procesos internos de SIMPLEDATA.', videoUrl: '', isCompleted: false },
    ]
  },
  {
    id: 4,
    title: "Proyecto Final",
    sessions: [
      { id: '4-1', day: 'Lunes', title: 'Detección de Oportunidades IA', description: 'Metodología para identificar oportunidades de IA en cualquier negocio.', videoUrl: '', isCompleted: false },
      { id: '4-2', day: 'Martes', title: 'Design Thinking para Proyectos IA', description: 'Aplicación de Design Thinking en el diseño de soluciones de IA.', videoUrl: '', isCompleted: false },
      { id: '4-3', day: 'Miércoles', title: 'Elaboración de Propuestas Comerciales', description: 'Cómo estructurar propuestas comerciales ganadoras para proyectos de IA.', videoUrl: '', isCompleted: false },
      { id: '4-4', day: 'Jueves', title: 'Presentación Final de Propuestas', description: 'Cada equipo presenta su propuesta de proyecto para recibir feedback.', videoUrl: '', isCompleted: false },
      { id: '4-5', day: 'Viernes', title: 'Selección de Proyecto Final', description: 'Votación y selección del proyecto que se desarrollará en la Fase 2.', videoUrl: '', isCompleted: false },
    ]
  }
];