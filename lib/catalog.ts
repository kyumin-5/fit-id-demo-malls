import type {BrandSlug} from './brands';

export type DemoSize={
  label:string;
  measurements:Record<string,number>;
  measurementSchemaVersion?:string;
};

export type DemoProduct={
  code:string;
  imageUrl?:string;
  brand:BrandSlug;
  name:string;
  majorCategory:'TOP'|'BOTTOM'|'OUTER'|'DRESS';
  subCategory:string;
  material:string;
  stretch:string;
  price:number;
  description:string;
  badge:string;
  sizes:DemoSize[];
};

const size=(label:string,measurements:Record<string,number>):DemoSize=>({
  label,
  measurements,
  measurementSchemaVersion:'CATEGORY_FIT_V1'
});

export const DEMO_PRODUCTS:DemoProduct[]=[
  {
    code:'FIT-910101',
    imageUrl:'/demo-products/FIT-910101.svg?v=2',
    brand:'morrow',
    name:'Essential Oxford Shirt',
    majorCategory:'TOP',
    subCategory:'SHIRT',
    material:'Cotton 100%',
    stretch:'없음',
    price:89000,
    badge:'MORROW ESSENTIAL',
    description:'단정한 어깨선과 여유 있는 가슴 폭을 가진 데일리 옥스퍼드 셔츠.',
    sizes:[
      size('S',{CHEST_WIDTH:54,SHOULDER_WIDTH:45,SLEEVE_LENGTH:60,BODY_LENGTH:72,HEM_WIDTH:53}),
      size('M',{CHEST_WIDTH:56,SHOULDER_WIDTH:47,SLEEVE_LENGTH:61,BODY_LENGTH:74,HEM_WIDTH:55}),
      size('L',{CHEST_WIDTH:58,SHOULDER_WIDTH:49,SLEEVE_LENGTH:62,BODY_LENGTH:76,HEM_WIDTH:57})
    ]
  },
  {
    code:'FIT-910102',
    imageUrl:'/demo-products/FIT-910102.svg?v=2',
    brand:'morrow',
    name:'Daily Wool Slacks',
    majorCategory:'BOTTOM',
    subCategory:'SLACKS',
    material:'Wool 48%, Polyester 48%, Spandex 4%',
    stretch:'조금',
    price:119000,
    badge:'TAILORED',
    description:'허리부터 밑단까지 매끄럽게 떨어지는 세미 와이드 울 블렌드 슬랙스.',
    sizes:[
      size('S',{WAIST_WIDTH:36,HIP_WIDTH:48,THIGH_WIDTH:29,RISE:29,OUTSEAM_LENGTH:101,HEM_WIDTH:20}),
      size('M',{WAIST_WIDTH:38,HIP_WIDTH:50,THIGH_WIDTH:30,RISE:30,OUTSEAM_LENGTH:103,HEM_WIDTH:21}),
      size('L',{WAIST_WIDTH:40,HIP_WIDTH:52,THIGH_WIDTH:31,RISE:31,OUTSEAM_LENGTH:105,HEM_WIDTH:22})
    ]
  },
  {
    code:'FIT-910103',
    imageUrl:'/demo-products/FIT-910103.svg?v=2',
    brand:'morrow',
    name:'Balmacaan Wool Coat',
    majorCategory:'OUTER',
    subCategory:'COAT',
    material:'Wool 70%, Polyester 30%',
    stretch:'없음',
    price:289000,
    badge:'OUTER 01',
    description:'레이어링을 고려한 넉넉한 품과 긴 기장의 발마칸 코트.',
    sizes:[
      size('S',{CHEST_WIDTH:58,SHOULDER_WIDTH:48,SLEEVE_LENGTH:61,BODY_LENGTH:107,HEM_WIDTH:61}),
      size('M',{CHEST_WIDTH:60,SHOULDER_WIDTH:50,SLEEVE_LENGTH:62,BODY_LENGTH:109,HEM_WIDTH:63}),
      size('L',{CHEST_WIDTH:62,SHOULDER_WIDTH:52,SLEEVE_LENGTH:63,BODY_LENGTH:111,HEM_WIDTH:65})
    ]
  },
  {
    code:'FIT-920101',
    imageUrl:'/demo-products/FIT-920101.svg?v=2',
    brand:'archive92',
    name:'Heavyweight Logo Hoodie',
    majorCategory:'TOP',
    subCategory:'HOODIE',
    material:'Cotton 80%, Polyester 20%',
    stretch:'조금',
    price:98000,
    badge:'DROP 04',
    description:'두꺼운 원단과 드롭 숄더를 사용한 박시 실루엣 후디.',
    sizes:[
      size('S',{CHEST_WIDTH:57,SHOULDER_WIDTH:53,SLEEVE_LENGTH:59,BODY_LENGTH:68,HEM_WIDTH:48}),
      size('M',{CHEST_WIDTH:60,SHOULDER_WIDTH:56,SLEEVE_LENGTH:60,BODY_LENGTH:70,HEM_WIDTH:51}),
      size('L',{CHEST_WIDTH:63,SHOULDER_WIDTH:59,SLEEVE_LENGTH:61,BODY_LENGTH:72,HEM_WIDTH:54})
    ]
  },
  {
    code:'FIT-920102',
    imageUrl:'/demo-products/FIT-920102.svg?v=2',
    brand:'archive92',
    name:'Utility Wide Cargo',
    majorCategory:'BOTTOM',
    subCategory:'WIDE_PANTS',
    material:'Cotton 97%, Spandex 3%',
    stretch:'조금',
    price:128000,
    badge:'UTILITY',
    description:'낮게 떨어지는 와이드 실루엣과 입체 포켓이 특징인 카고 팬츠.',
    sizes:[
      size('S',{WAIST_WIDTH:37,HIP_WIDTH:52,THIGH_WIDTH:33,RISE:32,OUTSEAM_LENGTH:104,HEM_WIDTH:25}),
      size('M',{WAIST_WIDTH:39,HIP_WIDTH:54,THIGH_WIDTH:34,RISE:33,OUTSEAM_LENGTH:106,HEM_WIDTH:26}),
      size('L',{WAIST_WIDTH:41,HIP_WIDTH:56,THIGH_WIDTH:35,RISE:34,OUTSEAM_LENGTH:108,HEM_WIDTH:27})
    ]
  },
  {
    code:'FIT-920103',
    imageUrl:'/demo-products/FIT-920103.svg?v=2',
    brand:'archive92',
    name:'Volume Puffer Jacket',
    majorCategory:'OUTER',
    subCategory:'PADDING',
    material:'Nylon 100%',
    stretch:'없음',
    price:248000,
    badge:'WINTER SYSTEM',
    description:'넓은 상체 볼륨과 짧은 기장으로 만든 스트리트 퍼퍼 재킷.',
    sizes:[
      size('S',{CHEST_WIDTH:61,SHOULDER_WIDTH:51,SLEEVE_LENGTH:62,BODY_LENGTH:67,HEM_WIDTH:58}),
      size('M',{CHEST_WIDTH:64,SHOULDER_WIDTH:54,SLEEVE_LENGTH:63,BODY_LENGTH:69,HEM_WIDTH:61}),
      size('L',{CHEST_WIDTH:67,SHOULDER_WIDTH:57,SLEEVE_LENGTH:64,BODY_LENGTH:71,HEM_WIDTH:64})
    ]
  },
  {
    code:'FIT-930101',
    imageUrl:'/demo-products/FIT-930101.svg?v=2',
    brand:'plainlab',
    name:'Everyday Cotton Tee',
    majorCategory:'TOP',
    subCategory:'TSHIRT',
    material:'Cotton 100%',
    stretch:'조금',
    price:39000,
    badge:'CORE 001',
    description:'넥라인과 소매 비율을 여러 번 조정한 데일리 코튼 티셔츠.',
    sizes:[
      size('S',{CHEST_WIDTH:50,SHOULDER_WIDTH:43,SLEEVE_LENGTH:21,BODY_LENGTH:68,HEM_WIDTH:50}),
      size('M',{CHEST_WIDTH:53,SHOULDER_WIDTH:46,SLEEVE_LENGTH:22,BODY_LENGTH:70,HEM_WIDTH:53}),
      size('L',{CHEST_WIDTH:56,SHOULDER_WIDTH:49,SLEEVE_LENGTH:23,BODY_LENGTH:72,HEM_WIDTH:56})
    ]
  },
  {
    code:'FIT-930102',
    imageUrl:'/demo-products/FIT-930102.svg?v=2',
    brand:'plainlab',
    name:'Straight Blue Denim',
    majorCategory:'BOTTOM',
    subCategory:'DENIM',
    material:'Cotton 99%, Spandex 1%',
    stretch:'조금',
    price:79000,
    badge:'CORE 014',
    description:'과하게 좁지도 넓지도 않은 직선적인 실루엣의 블루 데님.',
    sizes:[
      size('S',{WAIST_WIDTH:36,HIP_WIDTH:49,THIGH_WIDTH:30,RISE:30,OUTSEAM_LENGTH:102,HEM_WIDTH:20}),
      size('M',{WAIST_WIDTH:38,HIP_WIDTH:51,THIGH_WIDTH:31,RISE:31,OUTSEAM_LENGTH:104,HEM_WIDTH:21}),
      size('L',{WAIST_WIDTH:40,HIP_WIDTH:53,THIGH_WIDTH:32,RISE:32,OUTSEAM_LENGTH:106,HEM_WIDTH:22})
    ]
  },
  {
    code:'FIT-930103',
    imageUrl:'/demo-products/FIT-930103.svg?v=2',
    brand:'plainlab',
    name:'Minimal Long Dress',
    majorCategory:'DRESS',
    subCategory:'LONG_DRESS',
    material:'Rayon 65%, Nylon 30%, Spandex 5%',
    stretch:'조금',
    price:109000,
    badge:'FORM 003',
    description:'상체는 정돈되고 밑단으로 자연스럽게 흐르는 미니멀 롱 드레스.',
    sizes:[
      size('S',{CHEST_WIDTH:45,WAIST_WIDTH:36,HIP_WIDTH:48,SHOULDER_WIDTH:38,SLEEVE_LENGTH:58,BODY_LENGTH:118}),
      size('M',{CHEST_WIDTH:47,WAIST_WIDTH:38,HIP_WIDTH:50,SHOULDER_WIDTH:40,SLEEVE_LENGTH:59,BODY_LENGTH:120}),
      size('L',{CHEST_WIDTH:49,WAIST_WIDTH:40,HIP_WIDTH:52,SHOULDER_WIDTH:42,SLEEVE_LENGTH:60,BODY_LENGTH:122})
    ]
  }
];

export const FALLBACK_BY_CODE=new Map(
  DEMO_PRODUCTS.map(product=>[product.code,product])
);

export function fallbackProducts(brand:BrandSlug){
  return DEMO_PRODUCTS.filter(product=>product.brand===brand);
}
