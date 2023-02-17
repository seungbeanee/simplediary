import DiaryItem from "./DiaryItem";

const DiaryList = ({ onEdit, onRemove, diaryList }) => {
    return (
        <div className="DiaryList">
            <h2>일기 리스트</h2>
            <h4>{diaryList.length}개의 일기가 있습니다.</h4>
            <div>
                {diaryList.map((it)=> (
                    <DiaryItem key={it.id} {...it} onEdit={onEdit} onRemove={onRemove}/>
                ))}
            </div>
        </div>
    )
}

// props가 넘어오지 못할 경우 데이터 세팅
DiaryList.defaultProps = {
    diaryList: [],
}

export default DiaryList;