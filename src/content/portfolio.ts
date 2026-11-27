export const navigation = [
  { label: 'Overview', href: '#overview' },
  { label: 'Work', href: '#work' },
  { label: 'Expertise', href: '#expertise' },
  { label: 'Journey', href: '#journey' },
] as const;

export const profile = {
  brand: 'portfolio',
  role: '.NET SOFTWARE DEVELOPER',
  title: 'Building digital experiences that make a difference.',
  headline: ['Building digital', 'experiences that', 'make a difference.'],
  introduction: 'A .NET developer’s portfolio focused on robust backend systems, thoughtful architecture, and software that makes complex work feel simple.',
  description: 'A .NET software developer portfolio exploring backend engineering, thoughtful architecture, and reliable software delivery.',
} as const;

export const overview = [
  { icon: 'layers', title: 'Backend engineering', description: 'Well-defined APIs and domain models for complex business workflows.' },
  { icon: 'architecture', title: 'Software architecture', description: 'Clear boundaries and practical design decisions that make change easier.' },
  { icon: 'shield', title: 'Software reliability', description: 'Testing and observability built into the way software is delivered.' },
] as const;

interface ProjectConcept {
  title: string;
  category: string;
  description: string;
  technologies: readonly string[];
  visual: 'signal' | 'relay';
}

export const projects: readonly ProjectConcept[] = [
  {
    title: 'Signal Console',
    category: 'Observability concept',
    description: 'A concept for tracing service health and spotting patterns in application telemetry from a single operational view.',
    technologies: ['ASP.NET Core', 'OpenTelemetry', 'Azure'],
    visual: 'signal',
  },
  {
    title: 'Relay Workflow',
    category: 'Integration concept',
    description: 'A concept for coordinating asynchronous business workflows with explicit retries and visibility into processing state.',
    technologies: ['C#', 'Azure Service Bus', 'SQL'],
    visual: 'relay',
  },
];

export const expertise = [
  { icon: 'terminal', title: 'Backend & APIs', skills: ['C#', '.NET', 'ASP.NET Core', 'REST APIs', 'Entity Framework Core'] },
  { icon: 'cloud', title: 'Cloud & data', skills: ['Azure', 'Docker', 'SQL Server', 'PostgreSQL', 'Messaging'] },
  { icon: 'shield', title: 'Quality & delivery', skills: ['Automated testing', 'CI/CD', 'OpenTelemetry', 'Domain modeling'] },
] as const;

export interface CareerRole {
  title: string;
  organization: string;
  period: string;
  summary: string;
}

export const career: readonly CareerRole[] = [];

interface Availability {
  resume: { href: string } | null;
  contact: { label: string; href: string } | null;
}

export const availability: Availability = { resume: null, contact: null };
