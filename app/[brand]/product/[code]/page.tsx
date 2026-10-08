import type {CSSProperties} from 'react';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import StoreHeader from '../../../../components/StoreHeader';
import FitIdButton from '../../../../components/FitIdButton';
import {BRANDS,isBrandSlug} from '../../../../lib/brands';
import {getProductByCode} from '../../../../lib/data';

export const revalidate=30;

const KRW=new Intl.NumberFormat('ko-KR');

const LABELS:Record<string,string>={
  CHEST_WIDTH:'가슴 단면',
  SHOULDER_WIDTH:'어깨 너비',
  SLEEVE_LENGTH:'소매 길이',
  BODY_LENGTH:'총장',
  HEM_WIDTH:'밑단 단면',
  WAIST_WIDTH:'허리 단면',
  HIP_WIDTH:'힙 단면',
  THIGH_WIDTH:'허벅지 단면',
  RISE:'밑위',
  OUTSEAM_LENGTH:'총장'
};

export default async function ProductPage({
  params
}:{
  params:Promise<{brand:string;code:string}>;
}){
  const {brand:rawBrand,code}=await params;

  if(!isBrandSlug(rawBrand)){
    notFound();
  }

  const brand=BRANDS[rawBrand];
  const product=await getProductByCode(rawBrand,decodeURIComponent(code));

  if(!product){
    notFound();
  }

  const style={
    '--store-bg':brand.theme.background,
    '--store-surface':brand.theme.surface,
    '--store-text':brand.theme.text,
    '--store-muted':brand.theme.muted,
    '--store-accent':brand.theme.accent,
    '--store-border':brand.theme.border
  } as CSSProperties;

  const dimensions=
    Array.from(
      new Set(
        product.sizes.flatMap(size=>Object.keys(size.measurements))
      )
    );

  return (
    <main
      className={`storePage store-${rawBrand}`}
      style={style}
    >
      <StoreHeader brand={rawBrand}/>

      <div className="productBreadcrumb">
        <Link href={`/${rawBrand}`}>SHOP</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <section className="productDetail">
        <div
          className="detailVisual"
          data-category={product.majorCategory}
        >
          <span className="detailBadge">{product.badge}</span>
          <div className="detailGarment" aria-hidden="true">
            <span/>
            <span/>
            <span/>
          </div>
          <p>{product.subCategory.replaceAll('_',' ')}</p>
        </div>

        <div className="detailInfo">
          <div className="detailTitleBlock">
            <span>{brand.name} / {product.majorCategory}</span>
            <h1>{product.name}</h1>
            <strong>₩{KRW.format(product.price)}</strong>
          </div>

          <p className="detailDescription">{product.description}</p>

          <div className="detailMeta">
            <div>
              <span>MATERIAL</span>
              <strong>{product.material}</strong>
            </div>
            <div>
              <span>STRETCH</span>
              <strong>{product.stretch}</strong>
            </div>
            <div>
              <span>FIT DATA</span>
              <strong>CATEGORY_FIT_V1</strong>
            </div>
          </div>

          <div className="sizeSelector">
            <span>AVAILABLE SIZE</span>
            <div>
              {product.sizes.map(size=>(
                <button key={size.label} type="button">
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          <FitIdButton code={product.code} brand={rawBrand}/>

          <div className="fitIdHint">
            <span>↳</span>
            <p>
              상품 코드를 직접 입력할 필요가 없습니다.
              이 버튼이 <strong>{product.code}</strong>를 FIT ID에 자동 전달합니다.
            </p>
          </div>
        </div>
      </section>

      <section className="measurementSection">
        <div className="measurementIntro">
          <span>PRODUCT MEASUREMENTS</span>
          <h2>사이즈 실측</h2>
          <p>단위 cm · 의류를 평평하게 놓고 측정한 상품 실측 기준</p>
        </div>

        <div className="measurementTableWrap">
          <table className="measurementTable">
            <thead>
              <tr>
                <th>SIZE</th>
                {dimensions.map(key=>(
                  <th key={key}>{LABELS[key]||key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {product.sizes.map(size=>(
                <tr key={size.label}>
                  <th>{size.label}</th>
                  {dimensions.map(key=>(
                    <td key={key}>
                      {size.measurements[key]??'-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="crossStorePrompt">
        <span>FIT ID NETWORK</span>
        <h2>다른 쇼핑몰에서도 같은 FIT ID를 사용해보세요.</h2>
        <div>
          {(['morrow','archive92','plainlab'] as const)
            .filter(slug=>slug!==rawBrand)
            .map(slug=>(
              <Link key={slug} href={`/${slug}`}>
                {BRANDS[slug].name} ↗
              </Link>
            ))}
        </div>
      </section>

      <footer className="storeFooter">
        <strong>{brand.name}</strong>
        <span>{product.code} · FIT ID CONNECTED</span>
      </footer>
    </main>
  );
}
