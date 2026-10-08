export type BrandSlug='morrow'|'archive92'|'plainlab';

export type BrandConfig={
  slug:BrandSlug;
  name:string;
  shopId:string;
  eyebrow:string;
  tagline:string;
  description:string;
  collection:string;
  theme:{
    background:string;
    surface:string;
    text:string;
    muted:string;
    accent:string;
    border:string;
  };
};

export const BRANDS:Record<BrandSlug,BrandConfig>={
  morrow:{
    slug:'morrow',
    name:'MORROW',
    shopId:'d1000000-0000-4000-8000-000000000001',
    eyebrow:'MODERN UNIFORM · SEOUL',
    tagline:'Quiet clothes for tomorrow.',
    description:'절제된 셔츠와 테일러링을 중심으로 매일 오래 입을 수 있는 옷을 제안합니다.',
    collection:'ESSENTIALS 26',
    theme:{
      background:'#f2f0ea',
      surface:'#fbfaf7',
      text:'#141412',
      muted:'#77736b',
      accent:'#1c3d32',
      border:'#d9d5cc'
    }
  },
  archive92:{
    slug:'archive92',
    name:'ARCHIVE 92',
    shopId:'d1000000-0000-4000-8000-000000000002',
    eyebrow:'UTILITY / STREET / 1992',
    tagline:'Built loud. Worn daily.',
    description:'오버사이즈 실루엣과 유틸리티 디테일을 일상복으로 재해석한 스트리트 레이블.',
    collection:'DROP 04 — CONCRETE',
    theme:{
      background:'#111111',
      surface:'#191919',
      text:'#f5f1e8',
      muted:'#aaa59b',
      accent:'#ee4b2b',
      border:'#33312e'
    }
  },
  plainlab:{
    slug:'plainlab',
    name:'PLAIN LAB',
    shopId:'d1000000-0000-4000-8000-000000000003',
    eyebrow:'EVERYDAY FIT STUDIES',
    tagline:'Nothing extra. Everything considered.',
    description:'티셔츠부터 데님, 원피스까지 매일 손이 가는 기본의 비율을 연구합니다.',
    collection:'CORE STUDY 01',
    theme:{
      background:'#eef3f5',
      surface:'#ffffff',
      text:'#18242a',
      muted:'#718087',
      accent:'#2b63d9',
      border:'#d6e0e4'
    }
  }
};

export const BRAND_SLUGS=Object.keys(BRANDS) as BrandSlug[];

export function isBrandSlug(value:string):value is BrandSlug{
  return value in BRANDS;
}
