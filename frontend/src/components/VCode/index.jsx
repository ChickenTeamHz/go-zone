/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect, useCallback } from 'react';
import styles from './style.less';

function getState(){
  return {
    data: getRandom(109,48,4),
    rotate: getRandom(75,-75,4),
    fz: getRandom(16,22,4),
    color: [getRandom(100,255,3),getRandom(100,255,4),getRandom(100,255,3),getRandom(100,255,3)],
  }
}

function getRandom(max, min, num) {
  const asciiNum = ~~(Math.random()*(max-min+1)+min)
  if(!num){
    return asciiNum
  }
  const arr = []
  for(let i = 0; i < num; i+=1){
    arr.push(getRandom(max, min))
  }
  return arr
}

function getData(data) {
  let str = '';
  data.forEach(v => {
     str += String.fromCharCode(v > 57 && v < 84 ? v + 7 : ( v < 57 ? v : v + 13 ));
  });
  return str;
}

export function useVCodeProps() {
  const [state, setState] = useState(getState());

  const freshCode = useCallback(()=>{
    setState(getState);
  },[]);

  return {
    data: getData(state.data),
    freshCode,
    state,
  }
}

export function VCode({ state, freshCode, data }) {

  useEffect(()=> {
    function renderCanvas() {
      const canvas = document.getElementById('codecanvas');
      const ctx = canvas.getContext('2d');
      ctx.height = canvas.height;
      ctx.width = canvas.width;
      ctx.strokeStyle = `rgb(${getRandom(100,10,3).toString()})`;
      for( let i = 0; i< 7; i+=1 ) {
        ctx.moveTo(getRandom(80,0),getRandom(40,0))
        ctx.lineTo(getRandom(80,0),getRandom(40,5))
        ctx.stroke();
      }
    }
    function clearCanvas(){
      const canvas = document.getElementById('codecanvas');
      const context = canvas.getContext("2d");
      context.clearRect(0,0,canvas.width,canvas.height);
      context.beginPath();
    };
    renderCanvas();
    return ()=> clearCanvas();
  },[data]);

  return (
    <div className={styles.vcode}>
      <div className={styles.vcodewrap}>
        <canvas id="codecanvas" width="80" height="40" className={styles.bgi} />
        {state.data.map((v,i) => (
          <div
            key={i}
            className={styles.itemStr}
            style={{
              transform:`rotate(${state.rotate[i]}deg)`,
              fontSize: `${state.fz[i]}px`,
              color: `rgb(${state.color[i].toString()})`,
            }}
          >
            {String.fromCharCode(v > 57 && v < 84 ? v + 7 : ( v < 57 ? v : v + 13 ))}
          </div>
        ))}
      </div>
      <span
        onClick={()=>freshCode()}
        className={`link ${styles.refresh}`}
      >
        看不清?点击刷新
      </span>
    </div>
  )
}
