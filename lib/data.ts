import {createClient} from '@supabase/supabase-js';
import {BRANDS,type BrandSlug} from './brands';
import {
  FALLBACK_BY_CODE,
  fallbackProducts,
  type DemoProduct,
  type DemoSize
} from './catalog';

const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const supabase=
  url&&key
    ?createClient(url,key,{
        auth:{
          persistSession:false,
          autoRefreshToken:false
        }
      })
    :null;

function mapLiveProduct(row:any,brand:BrandSlug):DemoProduct{
  const fallback=FALLBACK_BY_CODE.get(String(row.code));

  const sizes:DemoSize[]=(row.product_sizes||[]).map((item:any)=>({
    label:String(item.size_label||''),
    measurements:
      item.measurements&&typeof item.measurements==='object'
        ?item.measurements
        :{},
    measurementSchemaVersion:
      String(item.measurement_schema_version||'CATEGORY_FIT_V1')
  }));

  return {
    code:String(row.code),
    brand,
    name:String(row.name||fallback?.name||'Product'),
    majorCategory:(row.major_category||fallback?.majorCategory||'TOP') as DemoProduct['majorCategory'],
    subCategory:String(row.sub_category||fallback?.subCategory||''),
    material:String(row.material||fallback?.material||''),
    stretch:String(row.stretch||fallback?.stretch||''),
    price:fallback?.price||79000,
    description:fallback?.description||'FIT ID Demo Commerce product.',
    badge:fallback?.badge||'FIT ID DEMO',
    sizes:sizes.length?sizes:(fallback?.sizes||[])
  };
}

export async function getProductsForBrand(brand:BrandSlug):Promise<DemoProduct[]>{
  if(!supabase){
    return fallbackProducts(brand);
  }

  const {data,error}=await supabase
    .from('products')
    .select(
      'code,name,material,stretch,major_category,sub_category,product_sizes(size_label,measurements,measurement_schema_version)'
    )
    .eq('shop_id',BRANDS[brand].shopId)
    .order('created_at',{ascending:true});

  if(error||!data?.length){
    return fallbackProducts(brand);
  }

  return data.map(row=>mapLiveProduct(row,brand));
}

export async function getProductByCode(
  brand:BrandSlug,
  code:string
):Promise<DemoProduct|null>{
  if(!supabase){
    const fallback=FALLBACK_BY_CODE.get(code);
    return fallback?.brand===brand?fallback:null;
  }

  const {data,error}=await supabase
    .from('products')
    .select(
      'code,name,material,stretch,major_category,sub_category,product_sizes(size_label,measurements,measurement_schema_version)'
    )
    .eq('code',code)
    .maybeSingle();

  if(error||!data){
    const fallback=FALLBACK_BY_CODE.get(code);
    return fallback?.brand===brand?fallback:null;
  }

  const fallback=FALLBACK_BY_CODE.get(code);
  if(fallback&&fallback.brand!==brand){
    return null;
  }

  return mapLiveProduct(data,brand);
}
