# iscu-caption-export
서울사이버대학교 강의의 자막을 추출해줍니다.
# 개발시 참고 노트
## loadViewerXml
### 요청
lecture_num: 강의실홈에서 볼수있는 강의번호?  
contents_seqno: 161274 아마도 각 강의 주차별 id  
ws_seqno: 442890 아마도 각 강의 주차별 id  
### 응답
LESSON_XML 를 분석해 content 들 목록과 content 의 id 를 얻어냄  

## devstatuPageStudyDetailView
### 요청
contentId: 위에서 응답으로 얻어낸 id  
lecture_num: 강의실홈에서 볼수있는 강의번호?  
contents_seqno: 161274 아마도 각 강의 주차별 id  
### 응답
응답 json 의 content 를 한번더 json parse 한뒤
obj.data[0].data[0].data[0].caption.ko.value 값을 얻어야함

## devstatuPageMakerCaptionDetailView
### 요청
captionSn: 위의 devstatuPageStudyDetailView 의 응답에서 얻은 값을 넣어야 함
### 응답
