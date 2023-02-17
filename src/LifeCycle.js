import react, {useEffect, useState} from 'react';

// 생명주기 종료 테스트
const UnmountTest = () => {
    useEffect(()=>{
        console.log("Mount!");

        return () => {
            // Unmount 시점에 실행되게 됨
            console.log("unMount!")
        }
    },[])
    return (
        <div>Unmount Testing Component</div>
    )
}

const LifeCycle = () => {

    // const [count, setCount] = useState(0);
    // const [text, setText] = useState("");

    // // 생명주기 시작
    // useEffect(()=>{
    //     console.log("mount!")
    // }, []);

    // // 생명주기 업데이트
    // useEffect(()=>{
    //     console.log("update!")
    // });
    // useEffect(()=>{
    //     console.log(`count is update : ${count}`)
    //     if(count > 5){
    //         alert("count가 5를 넘었습니다. 따라서 1로 초기화합니다.")
    //         setCount(1);
    //     }
    // },[count]);
    // useEffect(()=>{
    //     console.log(`text is update : ${text}`)
    // },[text]);

    // 생명주기 종료
    const [isVisible, setIsVisible] = useState(false);
    const toggle = () => setIsVisible(!isVisible);

    return (
        <div style={{padding:20}}>
            {/* <div>
                {count}
                <button onClick={()=>setCount(count+1)}>+</button>
            </div>
            <div>
                <input value={text} onChange={(e)=>setText(e.target.value)}/>
            </div> */}
            {isVisible && <UnmountTest />}
            <button onClick={toggle}>ON/OFF</button>
        </div>
    )
}

export default LifeCycle;