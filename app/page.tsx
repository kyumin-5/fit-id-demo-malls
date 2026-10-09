import Link from 'next/link';
import {BRANDS,BRAND_SLUGS} from '../lib/brands';

export default function DemoIndex(){
  return (
    <main className="demoIndex">
      <div className="indexTop">
        <span>FIT ID · DEMO COMMERCE</span>
        <span>3 STORES / 1 FIT ID</span>
      </div>

      <section className="indexHero">
        <p>CONNECTED COMMERCE</p>
        <h1>
          내 핏 기준은 한 번만.<br/>
          쇼핑몰이 달라도 그대로.
        </h1>
        <div className="indexHeroMeta">
          <p>
            각 쇼핑몰의 상품 실측은 달라도, FIT ID에 저장된 개인 핏 기준은 그대로 이어집니다.
            상품에서 FIT ID를 열어 바로 비교해보세요.
          </p>
          <span>SELECT A STORE ↓</span>
        </div>
      </section>

      <section className="storeChooser">
        {BRAND_SLUGS.map((slug,index)=>{
          const brand=BRANDS[slug];

          return (
            <Link
              key={slug}
              href={`/${slug}`}
              className={`chooserCard chooser-${slug}`}
            >
              <span className="chooserNumber">0{index+1}</span>
              <div>
                <small>{brand.eyebrow}</small>
                <h2>{brand.name}</h2>
                <p>{brand.tagline}</p>
              </div>
              <span className="chooserArrow">ENTER ↗</span>
            </Link>
          );
        })}
      </section>

      <footer className="indexFooter">
        <span>FIT ID NETWORK PROTOTYPE</span>
        <span>Consumer · Partner · Demo Commerce</span>
      </footer>
    </main>
  );
}
