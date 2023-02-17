import React,{useState,useEffect} from "react";

const CounterA = React.memo(({count}) => {
    useEffect(()=>{
        console.log(`counterA update - count: ${count}`)
    })
    return (
        <div>{count}</div>
    )
})

const CounterB = ({obj}) => {
    useEffect(()=>{
        console.log(`counterB update - obj: ${obj.count}`)
    })
    return (
        <div>{obj.count}</div>
    )
}

const areEqual = (prevProps,nextProps)=>{
    // return true;  // 이전 프롭스 현재 프롭스가 같다 -> 리렌더링을 일으키지 않게 된다.
    // return false; // 이전과 현재가 다르다 -> 리렌더링을 일으킨다.
    if(prevProps.obj.count === nextProps.obj.count){
        return true;
    }
    return false;
}

// CounterB는 areEqual의 판단에 따라 렌더링 할지말지 결정하는 컴포넌트가 된다.
const MemoizationCounterB = React.memo(CounterB, areEqual)

const OptimizeTest = () => {

    const [count,setCount] = useState(1);
    const [obj,setObj] = useState({
        count:1,
    });

    return (
    <div style={{padding:50}}>
        <div>
            <h2>Counter A</h2>
            <CounterA count={count} />
            <button onClick={()=>setCount(count)}>A button</button>
        </div>
        <div>
            <h2>Counter B</h2>
            <MemoizationCounterB obj={obj} />
            <button onClick={()=>setObj({
                count:obj.count
            })}>B Button</button>
        </div>
    </div>
    )
}

export default OptimizeTest;