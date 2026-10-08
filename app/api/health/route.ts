import {NextResponse} from 'next/server';

export const dynamic='force-dynamic';

export async function GET(){
  return NextResponse.json({
    ok:true,
    service:'fit-id-demo-malls',
    stores:['MORROW','ARCHIVE 92','PLAIN LAB'],
    fitIdConsumer:'https://fit-id-consumer-mtvz.vercel.app/'
  });
}
