import type {CSSProperties} from 'react';
import {notFound} from 'next/navigation';
import StoreHeader from '../../components/StoreHeader';
import ProductCard from '../../components/ProductCard';
import {BRANDS,isBrandSlug} from '../../lib/brands';
import {getProductsForBrand} from '../../lib/data';

export const revalidate=30;

export default async function StorePage({
  params
}:{
  params:Promise<{brand:string}>;
}){
  const {brand:rawBrand}=await params;

  if(!isBrandSlug(rawBrand)){
    notFound();
  }

  const brand=BRANDS[rawBrand];
  const products=await getProductsForBrand(rawBrand);

  const style={
    '--store-bg':brand.theme.background,
    '--store-surface':brand.theme.surface,
    '--store-text':brand.theme.text,
    '--store-muted':brand.theme.muted,
    '--store-accent':brand.theme.accent,
    '--store-border':brand.theme.border
  } as CSSProperties;

  return (
    <main
      className={`storePage store-${rawBrand}`}
      style={style}
    >
      <StoreHeader brand={rawBrand}/>

      <section className="storeHero">
        <div className="storeHeroCopy">
          <p>{brand.eyebrow}</p>
          <h1>{brand.tagline}</h1>
          <span>{brand.description}</span>
        </div>

        <div className="storeHeroArt" aria-hidden="true">
          <span className="heroArtWord">{brand.collection}</span>
          <div className="heroShape heroShapeA"/>
          <div className="heroShape heroShapeB"/>
        </div>
      </section>

      <section className="collection" id="collection">
        <div className="collectionHeader">
          <div>
            <span>01 / COLLECTION</span>
            <h2>{brand.collection}</h2>
          </div>
          <p>
            상품마다 다른 실측은 FIT ID 기준으로 연결됩니다.
            한 번 만든 내 핏 기준을 다른 쇼핑몰에서도 그대로 이어서 사용할 수 있습니다.
          </p>
        </div>

        <div className="productGrid">
          {products.map((product,index)=>(
            <ProductCard
              key={product.code}
              product={product}
              brand={rawBrand}
              index={index}
            />
          ))}
        </div>
      </section>

      <section className="fitNetworkStory" id="story">
        <div>
          <span className="storyEyebrow">POWERED BY FIT ID</span>
          <h2>쇼핑몰이 달라도,<br/>내 핏 기준은 하나.</h2>
        </div>

        <div className="storySteps">
          <article>
            <small>01</small>
            <strong>상품 선택</strong>
            <p>현재 쇼핑몰의 Product Code를 자동으로 식별합니다.</p>
          </article>
          <article>
            <small>02</small>
            <strong>FIT ID 연결</strong>
            <p>이미 만든 개인 핏 기준을 다시 입력하지 않고 불러옵니다.</p>
          </article>
          <article>
            <small>03</small>
            <strong>다른 몰에서도 재사용</strong>
            <p>MORROW에서 만든 연결 경험을 ARCHIVE 92와 PLAIN LAB에서도 이어갑니다.</p>
          </article>
        </div>
      </section>

      <footer className="storeFooter">
        <strong>{brand.name}</strong>
        <span>FICTIONAL STORE FOR FIT ID DEMONSTRATION</span>
      </footer>
    </main>
  );
}
