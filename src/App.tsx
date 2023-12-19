import moment from "moment";
import React, { useState } from "react";
import { countWeekdays } from "./util";
import styled from "styled-components";
const FullScreenContainer = styled.div`
  position: fixed;
  width: 100%;
  padding: 20px;
  z-index: 2;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 24px;
  color: rgba(0, 0, 0, 0.7);
  text-align: center;

  font-size: 15px;
  font-weight: 600;
`;
const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 어두운 배경 색상 및 투명도 조절 */
  z-index: 1; /* 모달 위로 배치 */
`;
const FullScreenBackDrop = styled(Backdrop)``;
const ModalButton = styled.button`
  margin-right: 10px;
  height: 38px;
  background-color: #627d50;
  border-radius: 7px;
  padding: 0 12px;
  color: black;
`;
const NoButton = styled(ModalButton)`
  background-color: gray;
`;
const FullScreenContent = styled.div`
  width: 480px;
  height: 600px;
  background: #fff;
  position: relative;
`;
const stringFormatter = (date: moment.Moment) => {
  return date.format("YYYY-MM-DD");
};
interface ClassInfo {
  name: string;
  price: number;
  days: number[];
}
interface Student {
  name: string;
  class: ClassInfo;
  paymentDay: number;
  changeDay: number;
  total: number;
  isCalced: boolean;
}
const classInfo: ClassInfo[] = [
  {
    name: "시드",
    price: 190000,
    days: [1, 3, 5],
  },
  {
    name: "스템",
    price: 270000,
    days: [1, 2, 3, 4, 5],
  },
  {
    name: "스템3, 리프, 푸릇",
    price: 290000,
    days: [1, 3, 5],
  },
  {
    name: "레귤러,브릿지,두잇(월수금)",
    price: 330000,
    days: [1, 3, 5],
  },
  {
    name: "링크, 레귤러-s(화목)",
    price: 330000,
    days: [2, 4],
  },
  {
    name: "링크-w(수금)",
    price: 330000,
    days: [3, 5],
  },
  {
    name: "프레스티지(월금)",
    price: 330000,
    days: [1, 5],
  },
  {
    name: "링크-t, 레귤러-t, 브릿지-t, 슈페리얼-t, 두잇-t(화목)",
    price: 330000,
    days: [2, 4],
  },
];
const ClassSelector: React.FC<{
  classInfo: ClassInfo[];
  selectedClass: ClassInfo | null; // 변경된 부분
  onSelectChange: (selectedClass: ClassInfo) => void; // 변경된 부분
}> = ({ classInfo, selectedClass, onSelectChange }) => {
  return (
    <select
      value={selectedClass ? selectedClass.name : ""}
      onChange={(e) => {
        const selectedClassName = e.target.value;
        const selectedClassInfo = classInfo.find(
          (classItem) => classItem.name === selectedClassName
        );

        onSelectChange(selectedClassInfo as ClassInfo);
      }}
    >
      <option value="">반 선택</option>
      {classInfo.map((classItem) => (
        <option key={classItem.name} value={classItem.name}>
          {classItem.name}
        </option>
      ))}
    </select>
  );
};
interface Log {
  startDay: string;
  changeDay: string;
  endDay: string;
  beforeClassMonthCnt: number;
  afterClassMonthCnt: number;
  beforeClassPricePerOne: number;
  afterClassPricePerOne: number;
  daysOfBefore: number;
  daysOfAfter: number;
  beforePayment: number;
  afterPayment: number;
  total: number;
}
interface FullScreenProp {
  isOpen: boolean;
  index: number;
}
const App = () => {
  const [isOpenFullScreen, setIsOpenFullScreen] = useState<FullScreenProp>({
    isOpen: false,
    index: 0,
  });
  const [selectedClassName, setSelectedClassName] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<ClassInfo>(classInfo[0]);
  const [selectedMonth, setSelectedMonth] = useState<number>(0);
  const [students, setStudents] = useState<Student[]>([]);
  const [studentLogs, setStudentLogs] = useState<Log[]>([]);
  const handleClassSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedClassName = event.target.value;
    setSelectedClassName(selectedClassName);

    const selectedClassInfo = classInfo.find(
      (classItem) => classItem.name === selectedClassName
    );
    setSelectedClass(selectedClassInfo as ClassInfo);
  };
  const handleAddStudent = () => {
    const newStudent: Student = {
      name: "",
      class: classInfo[0], // 기본값으로 첫 번째 반 선택
      paymentDay: 0,
      changeDay: 0,
      total: 0,
      isCalced: false,
    };

    const newStudentLog: Log = {
      startDay: "",
      changeDay: "",
      endDay: "",
      beforeClassMonthCnt: 0,
      afterClassMonthCnt: 0,
      beforeClassPricePerOne: 0,
      afterClassPricePerOne: 0,
      daysOfBefore: 0,
      daysOfAfter: 0,
      beforePayment: 0,
      afterPayment: 0,
      total: 0,
    };

    setStudents((prevStudents) => [...prevStudents, newStudent]);
    setStudentLogs((prevStudentsLog) => [...prevStudentsLog, newStudentLog]);
  };
  const handleInputChange = (
    index: number,
    fieldName: string,
    value: string | ClassInfo
  ) => {
    setStudents((prevStudents) => {
      const updatedStudents = [...prevStudents];
      updatedStudents[index] = {
        ...updatedStudents[index],
        [fieldName]: value,
      };
      return updatedStudents;
    });
  };
  // 결과 출력
  // console.log("선택한 요일들의 총 개수:", totalDayCount, totalDayCount2);
  const handleMonthInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const monthValue = parseInt(event.target.value, 10);
    setSelectedMonth(monthValue);
  };
  console.log(studentLogs);

  const openFullScreen = (index: number) => {
    setIsOpenFullScreen({ isOpen: true, index });
  };
  const closeFullScreen = () => {
    setIsOpenFullScreen({ isOpen: false, index: 0 });
  };
  const stopPropagation = (e: any) => {
    e.stopPropagation();
  };
  const Label = styled.div`
    font-size: 24px;
    font-weight: 800;
  `;
  return (
    <>
      <div>
        <Label>월(MONTH)</Label>
        <input
          type="number"
          min={1}
          max={12}
          value={selectedMonth || ""}
          onChange={handleMonthInputChange}
        />
        <p />
        <Label>반</Label>
        <select
          style={{ marginBottom: 24 }}
          value={selectedClassName}
          onChange={handleClassSelectChange}
        >
          <option value="">반 선택</option>
          {classInfo.map((classItem) => (
            <option key={classItem.name} value={classItem.name}>
              {classItem.name}
            </option>
          ))}
        </select>
        {selectedClass && (
          <div style={{ border: "1px solid #999", marginBottom: 24 }}>
            <p>-선택한 반 정보-</p>
            <p>이름: {selectedClass.name}</p>
            <p>가격: {selectedClass.price}</p>
            <p>수업 요일: {selectedClass.days.join(", ")}</p>
          </div>
        )}
        <Label>학생's</Label>
        <button onClick={handleAddStudent} style={{ marginTop: 24 }}>
          +
        </button>
        <p />
        {students.map((student, index) => (
          <div key={index}>
            <span>학생</span>
            <span>이름</span>
            <input
              value={student.name}
              onChange={(e) => handleInputChange(index, "name", e.target.value)}
            />
            <span>반</span>
            <ClassSelector
              classInfo={classInfo}
              selectedClass={student.class}
              onSelectChange={(selectedClass) =>
                handleInputChange(index, "class", selectedClass)
              }
            />
            <span>결제일</span>
            <input
              value={student.paymentDay}
              onChange={(e) =>
                handleInputChange(index, "paymentDay", e.target.value)
              }
            />
            <span>변경일</span>
            <input
              value={student.changeDay}
              onChange={(e) =>
                handleInputChange(index, "changeDay", e.target.value)
              }
            />
            <button
              onClick={() => {
                const startDateStr: string = `2023-${selectedMonth}-${student.paymentDay}`;
                const changeDay: number = student.changeDay;
                // console.log("시작일: ", startDateStr);
                const newDate = moment(startDateStr)
                  .month(
                    changeDay < student.paymentDay
                      ? selectedMonth
                      : selectedMonth - 1
                  )
                  .date(changeDay);
                const changeDateStr = newDate.format("YYYY-MM-DD");
                // console.log("변경일: ", changeDateStr);
                const endDateStr = moment(startDateStr)
                  .clone()
                  .add(1, "months")
                  .format("YYYY-MM-DD");
                // console.log("마감일: ", endDateStr);
                const beClass = selectedClass; // 이전반
                const afClass = student.class; // 바꾸려는 반

                const BeforeExpectedClassDay = countWeekdays(
                  startDateStr,
                  endDateStr,
                  beClass.days
                );
                const AfterExpectedClassDay = countWeekdays(
                  startDateStr,
                  endDateStr,
                  afClass.days
                );
                // console.log(
                //   "이전 반의 원래 한달 수업일수 :",
                //   BeforeExpectedClassDay
                // );
                // console.log(
                //   "이후 반의 원래 한 달 수업 일수: ",
                //   AfterExpectedClassDay
                // );

                const daysOfBefore: number = countWeekdays(
                  startDateStr,
                  changeDateStr,
                  beClass.days
                );
                const daysOfAfter: number = countWeekdays(
                  changeDateStr,
                  endDateStr,
                  afClass.days
                );
                // console.log("결제 이전의 수업 수: " + daysOfBefore);
                // console.log("결제 이후의 수업 개수: " + daysOfAfter);

                const beforeClassPricePerOne = Math.round(
                  beClass.price / BeforeExpectedClassDay
                ); // total Before Expected class day
                const afterClassPricePerOne = Math.round(
                  afClass.price / AfterExpectedClassDay
                ); // total after expected class day
                // console.log(
                //   "이전 수업 개당 비용 :",
                //   beforeClassPricePerOne.toLocaleString()
                // );
                // console.log(
                //   "이후 수업 개당 비용 :",
                //   afterClassPricePerOne.toLocaleString()
                // );

                const total1 = Math.round(
                  daysOfBefore * beforeClassPricePerOne
                );
                const total2 = Math.round(daysOfAfter * afterClassPricePerOne);
                // console.log("결제일 이전 총 비용: ", total1.toLocaleString());
                // console.log("결제일 이후 총 비용: ", total2.toLocaleString());
                const realTotal = total1 + total2;
                const curStudent = student;
                curStudent.total = realTotal;
                // console.log("총 비용: ", realTotal);
                setStudents((prevStudents) => {
                  const updatedStudents = [...prevStudents];
                  const updatedStudent = { ...updatedStudents[index] };
                  updatedStudent.total = realTotal;
                  updatedStudent.isCalced = true;
                  updatedStudents[index] = updatedStudent;
                  return updatedStudents;
                });
                setStudentLogs((prevStudentsLog) => {
                  const updatedStudentLogs = [...prevStudentsLog];
                  const newLog = {
                    startDay: startDateStr,
                    changeDay: changeDateStr,
                    endDay: endDateStr,
                    beforeClassMonthCnt: BeforeExpectedClassDay,
                    afterClassMonthCnt: AfterExpectedClassDay,
                    beforeClassPricePerOne,
                    afterClassPricePerOne,
                    daysOfBefore,
                    daysOfAfter,
                    beforePayment: total1,
                    afterPayment: total2,
                    total: realTotal,
                  };
                  updatedStudentLogs[index] = newLog;
                  return updatedStudentLogs;
                });
              }}
            >
              계산하기
            </button>
            <span>금액</span>
            <span>{student.total.toLocaleString()}</span>
            {student.isCalced ? (
              <button onClick={() => openFullScreen(index)}>로그보기</button>
            ) : null}
          </div>
        ))}
      </div>
      {isOpenFullScreen.isOpen == true && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <FullScreenBackDrop
            onClick={() => {
              console.log("true");
            }}
          />
          <FullScreenContainer onClick={(e) => stopPropagation(e)}>
            <FullScreenContent>
              <button
                style={{ position: "absolute", left: 0, top: 0 }}
                onClick={closeFullScreen}
              >
                닫기
              </button>
              <div style={{ fontSize: 24, marginTop: 24, marginBottom: 24 }}>
                {selectedClass.name} {"->"}{" "}
                {students[isOpenFullScreen.index].class.name}
              </div>
              <div>시작일: {studentLogs[isOpenFullScreen.index].startDay}</div>
              <div>
                마지막일: {studentLogs[isOpenFullScreen.index].endDay} <br />
                (마지막날짜 포함 안됨)
              </div>
              <div>변경일: {studentLogs[isOpenFullScreen.index].changeDay}</div>
              <p />
              <div>
                변경전 총 수업 일수:{" "}
                {studentLogs[isOpenFullScreen.index].beforeClassMonthCnt}
              </div>
              <div>
                변경될 반 총 수업 일수:{" "}
                {studentLogs[isOpenFullScreen.index].afterClassMonthCnt}
              </div>
              <p />
              <div>
                변경전 수업 일할 가격:{" "}
                {studentLogs[
                  isOpenFullScreen.index
                ].beforeClassPricePerOne.toLocaleString()}
              </div>
              <div>
                변경될 반 수업 일할 가격:{" "}
                {studentLogs[
                  isOpenFullScreen.index
                ].afterClassPricePerOne.toLocaleString()}
              </div>
              <p />
              <div>
                변경전 수업 들어야하는 일:{" "}
                {studentLogs[
                  isOpenFullScreen.index
                ].daysOfBefore.toLocaleString()}
              </div>
              <div>
                변경될 반 수업 들어야하는 일:{" "}
                {studentLogs[
                  isOpenFullScreen.index
                ].daysOfAfter.toLocaleString()}
              </div>
              <p />
              <div>
                이전 반 총금액:{" "}
                {studentLogs[
                  isOpenFullScreen.index
                ].beforePayment.toLocaleString()}
              </div>
              <div>
                바뀔 반 총금액:{" "}
                {studentLogs[
                  isOpenFullScreen.index
                ].afterPayment.toLocaleString()}
              </div>
              <p />
              <div>
                <span style={{ fontSize: 24, fontWeight: 800 }}>총액</span>:{" "}
                {studentLogs[isOpenFullScreen.index].total}
              </div>
            </FullScreenContent>
          </FullScreenContainer>
        </div>
      )}
    </>
  );
};

export default App;
