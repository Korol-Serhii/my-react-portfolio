export type ServiceDuration = {
  y: number;
  m: number;
  d: number;
};

export type ServiceDurationWithError = ServiceDuration & {
  error?: string;
};

export type ServiceRow = {
  id: number;
  start: string;
  end: string;
  ratio: string;
};

export type PersonalInfo = {
  name: string;
  rank: string;
  dob: string;
};
