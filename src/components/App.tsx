import React, { useState, useEffect }from 'react';
import axios from 'axios'
import './App.css';
import Game from './game';
import Counter from './Counter';
import KakaoShareButton from './kakaoShareButton';
import { RootState } from '../redux/reducers';

import { useSelector, useDispatch } from 'react-redux';
import { increase, decrease } from '../redux/actions/counter';


function App() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
      const data =  axios.get('http://localhost:4000/rank/load', {
        headers: {
          "secretCode": "shelter"
        }
      }).then(data => console.log(data))
  }, []);
  

  // 상태를 조회합니다. 상태를 조회 할 때에는 state 의 타입을 RootState 로 지정해야합니다.
  const secCount = useSelector((state: RootState) => state.counter.count); // useSelector : 리덕스 스토어의 상태에 접근
  // const result : any = useSelector(selector : Function, deps : any[])
  const dispatch = useDispatch();

  const onIncrease = () => {
    dispatch(increase());
  }

  const onDecrease = () => {
    dispatch(decrease());
  }
  
  return (
    count ? <div><Game></Game></div> :
    <div className="App">
      <header className="App-header">
        <img src='images/character/logo.png' className="App-logo" alt="logo" />
        <button onClick={()=> setCount(1)}>
          Game Start!!!
        </button>
        <KakaoShareButton></KakaoShareButton>
        
        {/* <Counter 
          count={secCount} 
          onIncrease={onIncrease} 
          onDecrease={onDecrease}
         /> */}
      </header>
    </div>
  );
}

export default App;