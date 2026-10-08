import type {BrandSlug} from '../lib/brands';

export default function FitIdButton({
  code,
  brand
}:{
  code:string;
  brand:BrandSlug;
}){
  const base=
    process.env.NEXT_PUBLIC_FIT_ID_CONSUMER_URL||
    'https://fit-id-consumer-mtvz.vercel.app/';

  const url=
    new URL(base);

  url.searchParams.set('productCode',code);
  url.searchParams.set('source','demo-commerce');
  url.searchParams.set('demoStore',brand);

  return (
    <a
      className="fitIdButton"
      href={url.toString()}
    >
      <span className="fitIdMark">FIT ID</span>
      <span>내 FIT ID로 사이즈 확인</span>
      <span className="fitIdArrow">↗</span>
    </a>
  );
}
