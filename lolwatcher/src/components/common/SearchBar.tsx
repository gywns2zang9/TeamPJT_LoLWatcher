import React, { useState } from "react"; // React 및 useState 훅을 가져옴
import "./SearchBar.css"; // CSS 파일 불러오기

export default function SearchBar() {
  // SearchBar 컴포넌트를 함수 선언 형식으로 정의하고, 기본 내보내기로 설정
  const [nickName, setNickName] = useState<string>(""); // 검색어 상태 변수 nickName와 상태를 업데이트할 setNickName 함수 선언, 초기값은 빈 문자열

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // input의 변경 이벤트를 처리하는 함수 선언
    setNickName(e.target.value); // input에 입력된 값을 nickName 상태로 업데이트
  };

  return (
    <div>
      <input
        type="text" // input 필드의 타입을 텍스트로 설정
        value={nickName} // input 필드의 값은 nickName 상태로 설정
        onChange={handleInputChange} // input 값이 변경될 때 handleInputChange 함수 호출
        placeholder="닉네임을 검색하세요."
      />
    </div>
  );
}
