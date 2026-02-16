export type Position = {
  title: string;
  employer: string;
  startDate: string;
  endDate: string;
  bullets: string[];
};
export interface Experience {
  sectionTitle: string;
  positions: Position[];
}

export type Degree = {
  title: string;
  honors?: string;
  dateObtained: string;
  school: string;
};
export interface Education {
  degrees: Degree[];
}

export type StrengthItem = {
  item: string;
  subItem?: string[] | StrengthItem;
};

export interface Strengths {
  sectionTitle: string;
  strengths: StrengthItem[] | StrengthItem[][];
}
