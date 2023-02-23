import React, {
   useMemo, useEffect, useRef, useCallback, useReducer 
  } from "react";
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


// useState 대신 useReducer를 사용하는 이유
// 복잡한 상태변화 로직을 컴포넌트 밖으로 분리하기 위함
// 첫 번째 파라미터 : 상태변화가 일어나기 직전의 state
// 두 번째 파라미터 : 어떤 상태변화를 일으켜야하는지에 대한 정보가 있는 action객체
// reducer가 리턴하는 값이 새로운 상태 값
const reducer = (state, action) => {
  switch (action.type) {
    case "INIT": {
      return action.data;
    }
    case "CREATE": {
      const created_date = new Date().getTime();
      const newItem = {
        ...action.data,
        created_date
      };
      return [newItem, ...state];
    }
    case "REMOVE": {
      return state.filter((it) => it.id !== action.targetId);
    }
    case "EDIT": {
      return state.map((it) =>
        it.id === action.targetId
          ? {
              ...it,
              content: action.newContent
            }
          : it
      );
    }
    default:
      return state;
  }
};

// 컴포넌트 트리에 데이터 공급 CONTEXT
// export해줘야 다른 곳에서도 쓸 수 있음.
export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext();

function App() {
  // const [data, setData] = useState([]);

  const [data, dispatch] = useReducer(reducer,[])

  const dataId = useRef(0);

  const getData = async () =>{
    const res = await fetch("https://jsonplaceholder.typicode.com/comments")
                .then((res) => res.json());
    
    const initData = res.slice(0,20).map((it)=>{
      return {
        author : it.email,
        content : it.body,
        emotion : Math.floor(Math.random() * 5) + 1,
        created_date : new Date().getTime(),
        id : dataId.current++
      }
    });
    
    dispatch({ type: "INIT", data: initData });
    // setData(initData);
  }

  useEffect(()=>{
    getData();
  },[])

  // 데이터는 위에서 아래, 이벤트는 아래에서 위로 흐르기 때문에 최상단에 이벤트를 전달하기 위해
  // 최상단에 함수를 만들어서 원하는 곳에 내려 주어야 한다.
  // 신규
  const onCreate = useCallback((author, content, emotion) => {
    dispatch({
      type:"CREATE",
      data:{author, content, emotion, id:dataId.current}
    });

    // const created_date = new Date().getTime();
    // const newITem = {
    //   author,
    //   content,
    //   emotion,
    //   created_date,
    //   id: dataId.current
    // }
    dataId.current += 1;
    // 함수형 업데이트
    // 아이템을 추가한 데이터를 setData에 리턴함
    //setData((data)=>[newITem,...data]);
  }, []);

  // 삭제
  const onRemove = useCallback((targetId) => {
    dispatch({type:"REMOVE", targetId});
    //setData(data => data.filter((it) => it.id !== targetId));
  },[]);

  // 수정
  const onEdit = useCallback((targetId, newContent) => {
    dispatch({type:"EDIT", targetId, newContent});
    // setData(data=>
    //   data.map((it)=>it.id === targetId ? {...it, content:newContent} : it)
    // )
  },[]);

  // uesMemo를 사용하여 재생성이 안되게 막음
  const MemoizedDispatches = useMemo(()=>{
    return {onCreate, onRemove, onEdit}
  },[])

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
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider value={MemoizedDispatches}>
        <div className="App">
          {/* <LifeCycle /> */}
          {/* <OptimizeTest /> */}
          <DiaryEditor/>
          <div>전체 일기 : {data.length}</div>
          <div>기분 좋은 일기 개수 : {goodCount}</div>
          <div>기분 좋은 일기 개수 : {badCount}</div>
          <div>기분 좋은 일기 비율 : {goodRatio}</div>
          {/* <DiaryList onEdit={onEdit} onRemove={onRemove} diaryList={data}/> */}
          <DiaryListA/>
        </div>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
}

export default App;
