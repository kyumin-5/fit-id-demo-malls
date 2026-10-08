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
        <p>CONNECTED COMMERCE PROTOTYPE</p>
        <h1>
          한 번 만든 FIT ID를<br/>
          다른 쇼핑몰에서도 그대로.
        </h1>
        <div className="indexHeroMeta">
          <p>
            서로 다른 세 개의 가상 쇼핑몰이 같은 FIT ID 네트워크에 연결되어 있습니다.
            상품을 고른 뒤 FIT ID 버튼을 눌러 실제 Consumer FIT CHECK로 이동합니다.
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
