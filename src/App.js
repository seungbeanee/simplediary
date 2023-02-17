import { useMemo, useEffect, useRef, useState } from 'react';
import './App.css';
import DiaryEditor from './DiaryEditor';
import DiaryList from './DiaryList';
// import OptimizeTest from './OptimizeTest';
// import LifeCycle from "./LifeCycle";

// const dummyList = [
//   {
//     id:1,
//     author:"최승빈",
//     content: "일기 1",
//     emotion: 5,
//     created_date: new Date().getTime()
//   },
//   {
//     id:2,
//     author:"박승빈",
//     content: "일기 2",
//     emotion: 2,
//     created_date: new Date().getTime()
//   },
//   {
//     id:3,
//     author:"오승빈",
//     content: "일기 3",
//     emotion: 3,
//     created_date: new Date().getTime()
//   },
// ]

function App() {
  const [data, setData] = useState([]);

  const dataId = useRef(0);

  const getData = async()=>{
    const res = await fetch('https://jsonplaceholder.typicode.com/comments')
                .then(res => res.json());
    
    const initData = res.slice(0,20).map((it)=>{
      return {
        author : it.email,
        content : it.body,
        emotion : Math.floor(Math.random()*5),
        created_date : new Date().getTime(),
        id : dataId.current++
      }
    });

    setData(initData);
  }

  useEffect(()=>{
    getData();
  },[])

  // 데이터는 위에서 아래, 이벤트는 아래에서 위로 흐르기 때문에 최상단에 이벤트를 전달하기 위해
  // 최상단에 함수를 만들어서 원하는 곳에 내려 주어야 한다.
  // 신규
  const onCreate = (author, content, emotion) => {
    const created_date = new Date().getTime();
    const newITem = {
      author,
      content,
      emotion,
      created_date,
      id: dataId.current
    }
    dataId.current += 1;
    setData([newITem,...data]);
  }

  // 삭제
  const onRemove = (targetId) => {
    const newDiaryList = data.filter((it) => it.id !== targetId);
    setData(newDiaryList);
  }

  // 수정
  const onEdit = (targetId, newContent) => {
    setData(
      data.map((it)=>it.id === targetId ? {...it, content:newContent} : it)
    )
  }

  // useMemo
  // 두번째 인자 값인 [data.length]가 바뀌지 않으면
  // return을 계산하지 않고 반환
  // useMemo를 사용하게되면 더 이상 함수가 아니기 때문에 값으로 받아야 함.
  // ex) getDiaryAnalysis() -> getDiaryAnalysis
  const getDiaryAnalysis = useMemo(
    () => {
    // 데이터 분석(Memoization)
    const goodCount = data.filter((it)=>it.emotion >= 3).length;
    const badCount = data.length - goodCount;
    const goodRatio = (goodCount / data.length) * 100;
    return {goodCount, badCount, goodRatio}
  }, [data.length]
  );

  const {goodCount, badCount, goodRatio} = getDiaryAnalysis;

  return (
    <div className="App">
      {/* <LifeCycle /> */}
      {/* <OptimizeTest /> */}
      <DiaryEditor onCreate={onCreate}/>
      <div>전체 일기 : {data.length}</div>
      <div>기분 좋은 일기 개수 : {goodCount}</div>
      <div>기분 좋은 일기 개수 : {badCount}</div>
      <div>기분 좋은 일기 비율 : {goodRatio}</div>
      <DiaryList onEdit={onEdit} onRemove={onRemove} diaryList={data}/>
    </div>
  );
}

export default App;
