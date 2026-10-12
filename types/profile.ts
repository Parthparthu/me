export interface FocusArea {
  icon: string;
  label: string;
  description: string;
  technologies?: string[];
}

export interface Profile {
  name: string;
  title: string;
  tagline: string;
  education: {
    degree: string;
    field: string;
    institution: string;
    location: string;
    period: string;
    year: string;
  };
  currentStatus: string;
  fullBio: string[];
  focusAreas: FocusArea[];
}

