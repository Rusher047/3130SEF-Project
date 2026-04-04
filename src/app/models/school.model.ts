export interface School {
  schoolNo: string;

  englishCategory: string;
  chineseCategory: string;
  englishName: string;
  chineseName: string;
  englishAddress: string;
  chineseAddress: string;
  longitudeEn: number | null;
  latitudeEn: number | null;
  eastingEn: number | null;
  northingEn: number | null;
  studentsGenderEn: string;
  sessionEn: string;
  districtEn: string;
  financeTypeEn: string;
  schoolLevelEn: string;
  telephoneEn: string;
  faxNumberEn: string;
  websiteEn: string;
  religionEn: string;

  longitudeZh: number | null;
  latitudeZh: number | null;
  eastingZh: number | null;
  northingZh: number | null;
  studentsGenderZh: string;
  sessionZh: string;
  districtZh: string;
  financeTypeZh: string;
  schoolTypeZh: string;
  telephoneZh: string;
  faxNumberZh: string;
  websiteZh: string;
  religionZh: string;

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
