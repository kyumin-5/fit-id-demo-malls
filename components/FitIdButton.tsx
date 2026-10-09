'use client';

import {useEffect,useMemo,useState} from 'react';
import type {BrandSlug} from '../lib/brands';

export default function FitIdButton({
  code,
  brand
}:{
  code:string;
  brand:BrandSlug;
}){
  const [open,setOpen]=useState(false);
  const [loaded,setLoaded]=useState(false);

  const fitIdUrl=useMemo(()=>{
    const base=
      process.env.NEXT_PUBLIC_FIT_ID_CONSUMER_URL||
      'https://fit-id-consumer-mtvz.vercel.app/';

    const url=new URL(base);

    url.searchParams.set('productCode',code);
    url.searchParams.set('source','demo-commerce');
    url.searchParams.set('demoStore',brand);
    url.searchParams.set('embed','1');

    return url.toString();
  },[brand,code]);

  useEffect(()=>{
    if(!open){
      return;
    }

    const previousOverflow=
      document.body.style.overflow;

    document.body.style.overflow='hidden';

    const onKeyDown=(event:KeyboardEvent)=>{
      if(event.key==='Escape'){
        setOpen(false);
      }
    };

    window.addEventListener('keydown',onKeyDown);

    return ()=>{
      document.body.style.overflow=previousOverflow;
      window.removeEventListener('keydown',onKeyDown);
    };
  },[open]);

  const close=()=>{
    setOpen(false);
    setLoaded(false);
  };

  return (
    <>
      <button
        className="fitIdButton"
        type="button"
        onClick={()=>{
          setLoaded(false);
          setOpen(true);
        }}
      >
        <span className="fitIdMark">FIT ID</span>
        <span>내 FIT ID로 사이즈 확인</span>
        <span className="fitIdArrow">↗</span>
      </button>

      {open&&(
        <div
          className="fitIdModalBackdrop"
          role="presentation"
          onMouseDown={event=>{
            if(event.currentTarget===event.target){
              close();
            }
          }}
        >
          <section
            className="fitIdModal"
            role="dialog"
            aria-modal="true"
            aria-label="FIT ID 사이즈 확인"
          >
            <header className="fitIdModalHeader">
              <div className="fitIdModalBrand">
                <span className="fitIdMark">FIT ID</span>

                <div>
                  <strong>FIT ID CONNECT</strong>
                  <small>
                    이 쇼핑몰 안에서 내 FIT ID로 바로 비교합니다.
                  </small>
                </div>
              </div>

              <div className="fitIdModalActions">
                <a
                  href={fitIdUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="fitIdExternalLink"
                >
                  새 창
                </a>

                <button
                  type="button"
                  className="fitIdModalClose"
                  onClick={close}
                  aria-label="FIT ID 닫기"
                >
                  ×
                </button>
              </div>
            </header>

            <div className="fitIdModalContext">
              <span>CONNECTED PRODUCT</span>
              <strong>{code}</strong>
              <p>
                같은 FIT ID를 MORROW, ARCHIVE 92, PLAIN LAB에서
                다시 입력하지 않고 사용할 수 있습니다.
              </p>
            </div>

            <div className="fitIdFrameShell">
              {!loaded&&(
                <div className="fitIdFrameLoading">
                  <span className="fitIdFramePulse"/>
                  <strong>FIT ID 연결 중</strong>
                  <p>상품 실측과 개인 핏 기준을 불러오고 있습니다.</p>
                </div>
              )}

              <iframe
                className={`fitIdFrame ${loaded?'isLoaded':''}`}
                src={fitIdUrl}
                title={`FIT ID · ${code}`}
                onLoad={()=>setLoaded(true)}
                allow="clipboard-read; clipboard-write"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
              />
            </div>

            <footer className="fitIdModalFooter">
              <span>
                POWERED BY FIT ID · ONE FIT PROFILE ACROSS STORES
              </span>

              <button
                type="button"
                onClick={close}
              >
                쇼핑 계속하기
              </button>
            </footer>
          </section>
        </div>
      )}
    </>
  );
}
