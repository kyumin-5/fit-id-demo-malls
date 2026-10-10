import {createClient} from '@supabase/supabase-js';
import {NextRequest,NextResponse} from 'next/server';

const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const headers={
  'Access-Control-Allow-Origin':'*',
  'Access-Control-Allow-Methods':'GET, OPTIONS',
  'Access-Control-Allow-Headers':'Content-Type',
  'Cache-Control':'no-store',
  'X-Content-Type-Options':'nosniff'
};
function answer(body:Record<string,unknown>,status:number){
  return NextResponse.json(body,{status,headers});
}
export function OPTIONS(){
  return new Response(null,{status:204,headers});
}
export async function GET(req:NextRequest){
  const shopId=req.nextUrl.searchParams.get('shopId')||'';
  const merchantProductId=req.nextUrl.searchParams.get('merchantProductId')||'';
  if(!uuid.test(shopId)||merchantProductId.length<1||merchantProductId.length>120||
      /[\u0000-\u001f\u007f]/.test(merchantProductId)){
    return answer({error:'INVALID_PRODUCT_IDENTIFIER'},400);
  }

  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if(!url||!key)return answer({error:'LOOKUP_NOT_CONFIGURED'},503);

  try{
    // Public product catalog only; never use service-role credentials or expose personal FIT data.
    const supabase=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
    const {data,error}=await supabase.from('products')
      .select('code,catalog_status,major_category,sub_category,product_sizes(size_label,measurements,measurement_schema_version)')
      .eq('shop_id',shopId)
      .eq('merchant_product_id',merchantProductId)
      .limit(1).maybeSingle();
    if(error){
      console.error('fitid merchant lookup failed',error.code);
      return answer({error:'LOOKUP_UNAVAILABLE'},503);
    }
    if(!data||data.catalog_status!=='READY'||
        !['TOP','BOTTOM','OUTER','DRESS'].includes(data.major_category||'')||
        !data.sub_category||!Array.isArray(data.product_sizes)||
        !data.product_sizes.some(size=>
          typeof size.size_label==='string'&&size.size_label.trim().length>0&&
          size.measurement_schema_version==='CATEGORY_FIT_V1'&&
          size.measurements&&typeof size.measurements==='object'&&!Array.isArray(size.measurements)&&
          Object.values(size.measurements).filter(value=>typeof value==='number'&&value>0&&Number.isFinite(value)).length>=2
        )
      ){
      return answer({error:'PRODUCT_NOT_READY'},404);
    }
    if(typeof data.code!=='string'||!/^FIT-[A-Za-z0-9_-]{4,60}$/.test(data.code)){
      return answer({error:'PRODUCT_NOT_READY'},404);
    }
    return answer({productCode:data.code},200);
  }catch{
    return answer({error:'LOOKUP_UNAVAILABLE'},503);
  }
}
