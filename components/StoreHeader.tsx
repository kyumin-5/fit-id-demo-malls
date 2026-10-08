import Link from 'next/link';
import {BRANDS,BRAND_SLUGS,type BrandSlug} from '../lib/brands';

export default function StoreHeader({brand}:{brand:BrandSlug}){
  const config=BRANDS[brand];

  return (
    <>
      <div className="networkBar">
        <span>FIT ID DEMO NETWORK</span>
        <div className="networkStores">
          {BRAND_SLUGS.map(slug=>(
            <Link
              key={slug}
              href={`/${slug}`}
              className={slug===brand?'active':''}
            >
              {BRANDS[slug].name}
            </Link>
          ))}
        </div>
        <span>ONE FIT ID · MULTIPLE STORES</span>
      </div>

      <header className="storeHeader">
        <Link href={`/${brand}`} className="storeLogo">
          {config.name}
        </Link>

        <nav className="storeNav" aria-label="Store navigation">
          <a href="#collection">NEW</a>
          <a href="#collection">SHOP</a>
          <a href="#story">STORY</a>
        </nav>

        <div className="storeTools">
          <span>SEARCH</span>
          <span>BAG 0</span>
        </div>
      </header>
    </>
  );
}
