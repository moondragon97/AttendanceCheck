-홈-
/     홈
/join 회원가입 
/login 로그인

-유저-
/user/check-data 학생들 정보
/user/github/start 깃허브로 로그인 시도
/user/github/finish 깃허브로 로그인 완료
/user/logout 로그아웃
/user/:id 프로필보기
/user/:id/edit-profile 프로필편집
/user/:id/edit-password 패스워드변경
/user/:id/leave 회원탈퇴

-출석체크-
/user/attendance 출석하기
/user/attendance/check 전체 출석현황
/user/attendance/:id 해당 유저의 출석기록
/user/attendance/:id/delete 해당 날짜의 데이터 제거(더미 방지)

-게시물-
/board 게시판
/board/enroll 게시물 작성
/board/:id 게시물
/board/:id/edit 게시물 편집
/board/:id/remove 게시물 삭제