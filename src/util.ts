import moment from "moment";

/**
 * 주어진 날짜 범위에서 특정 요일들의 총 개수를 계산합니다.
 * @param {string} startDateStr - 시작 날짜 문자열 (YYYY-MM-DD 형식)
 * @param {string} endDateStr - 종료 날짜 문자열 (YYYY-MM-DD 형식)
 * @param {number[]} targetDays - 계산하려는 요일들의 배열 (0: 일요일, 1: 월요일, ..., 6: 토요일)
 * @returns {number} - 선택한 요일들의 총 개수
 */
export function countWeekdays(
  startDateStr: string,
  endDateStr: string,
  targetDays: number[]
): number {
  const startDate = moment(startDateStr);
  const endDate = moment(endDateStr);

  // 두 날짜 간의 일 수 차이 계산
  const daysDiff: number = endDate.diff(startDate, "days");

  // 요일에 해당하는 개수 초기화
  let dayCount: number = 0;

  // 각 날짜에 대해 요일을 확인하여 개수 증가
  for (let i = 0; i < daysDiff; i++) {
    const currentDate = startDate.clone().add(i, "days");
    if (targetDays.includes(currentDate.day())) {
      dayCount++;
    }
  }

  return dayCount;
}

// const startDateStr: string = "2023-12-19";
// const changeDateStr: string = "2023-12-25";
// const endDateStr: string = "2024-01-19";
// const targetDays: number[] = [1, 3, 5]; // 월요일, 수요일, 금요일

// const smon: moment.Moment = moment(startDateStr);
// const oneMonthAddedMoment: moment.Moment = moment(startDateStr)
//   .clone()
//   .add(1, "months");
// console.log(stringFormatter(smon));
// console.log(stringFormatter(oneMonthAddedMoment));

// const totalDayCount: number = countWeekdays(
//   startDateStr,
//   changeDateStr,
//   targetDays
// );
// const totalDayCount2: number = countWeekdays(
//   changeDateStr,
//   endDateStr,
//   targetDays
// );
