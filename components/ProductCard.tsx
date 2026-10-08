import Link from 'next/link';
import type {BrandSlug} from '../lib/brands';
import type {DemoProduct} from '../lib/catalog';

const KRW=new Intl.NumberFormat('ko-KR');

export default function ProductCard({
  product,
  brand,
  index
}:{
  product:DemoProduct;
  brand:BrandSlug;
  index:number;
}){
  return (
    <Link
      href={`/${brand}/product/${product.code}`}
      className="productCard"
    >
      <div
        className="productVisual"
        data-category={product.majorCategory}
      >
        <span className="visualIndex">
          {String(index+1).padStart(2,'0')}
        </span>

        <div className="garmentGlyph" aria-hidden="true">
          <span/>
          <span/>
          <span/>
        </div>

        <span className="visualCategory">
          {product.subCategory.replaceAll('_',' ')}
        </span>
      </div>

      <div className="productCardInfo">
        <div>
          <span className="productBadge">{product.badge}</span>
          <h3>{product.name}</h3>
        </div>

        <strong>₩{KRW.format(product.price)}</strong>
      </div>

      <p>{product.material}</p>
    </Link>
  );
}
