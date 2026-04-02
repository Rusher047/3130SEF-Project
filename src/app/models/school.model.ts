export interface School {
  id: string;
  nameEn: string;
  nameZh: string;
  district: string;
  addressEn: string;
  addressZh: string;
  telephone: string;
  fax: string;
  email: string;
  website: string;
  schoolLevel: string;
  schoolType: string;
  financeType: string;
  gender: string;
  session: string;
  religion: string;
  latitude: number | null;
  longitude: number | null;
}
