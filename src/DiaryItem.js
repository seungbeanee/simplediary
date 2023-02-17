import { useRef, useState } from "react";

const DiaryItem = ({ onEdit, onRemove, author, content, created_date, emotion, id }) => {

    // 수정하기를 위한 상태 값 (true: 수정 / false: 수정아님)
    const [isEdit, setIsEdit] = useState(false);
    
    // 수정하기 버튼 클릭 시, 상태 값을 토글함.
    const toggleIsEdit = () => setIsEdit(!isEdit);

    // 컨텐츠박스 핸들링
    const [localContent, setLocalContent] = useState(content);

    // 컨텐츠 수정 시, 문자열의 길이가 5가 안될 경우 컨텐츠 박스에 focus를 주기 위한 ref
    const localContentInput = useRef();

    // 삭제 버튼
    const handleRemove = () => {
        if(window.confirm(`${id}번째 일기를 정말 삭제하시겠습니까?`))
        {
            onRemove(id);
        }
    };

    // 수정 취소 시, 상태 값 원래 값으로 돌려놓기
    const handleQuitEdit = () => {
        setIsEdit(false);
        setLocalContent(content);
    }

    // 수정 벨류데이션과 수정완료 저장
    const handleEdit = () => {
        if(localContent.length < 5)
        {
            localContentInput.current.focus();
            return;
        }
        if(window.confirm(`${id}번 째 일기를 수정하시겠습니까?`))
        {
            onEdit(id, localContent);
            toggleIsEdit();
        }
    }

    return (
        <div className="DiaryItem">
            <div className="info">
                <span>
                    작성자 : {author} | 감정점수 : {emotion}
                </span>
                <br />
                <span className="date">{new Date(created_date).toLocaleString()}</span>
            </div>
            <div className="content">{isEdit ? (
                <>
                    <textarea
                        ref={localContentInput}
                        value={localContent}
                        onChange={(e) => setLocalContent(e.target.value)}
                    />
                </>
                ) : (
                <>{content}</>
                )}</div>
            {isEdit ?
                <>
                    <button onClick={handleQuitEdit}>수정 취소</button>
                    <button onClick={handleEdit}>수정 완료</button>
                </>:<>
                    <button onClick={handleRemove}>삭제하기</button>
                    <button onClick={toggleIsEdit}>수정하기</button>
                </>}
        </div>
    )
}

export default DiaryItem;