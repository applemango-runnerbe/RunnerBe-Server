// 게시글 생성
async function createRunningLog(connection, insertPostingParams) {
  const insertRunningLogQuery = `
    INSERT INTO RunningLog(userId, runnedDate, gatheringId, stampCode, contents, imageUrl, weatherDegree, weatherIcon, isOpened)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;
  const insertRunningLogRow = await connection.query(
    insertRunningLogQuery,
    insertPostingParams
  );

  return insertRunningLogRow;
}

// 게시글 수정
async function updateRunningLog(connection, patchPostingParams) {
  const patchPostingQuery = `
    UPDATE RunningLog 
    SET runnedDate = ?, gatheringId = ?, stampCode = ?, contents = ?,
        imageUrl = ?, weatherDegree = ?, weatherIcon = ?, isOpened = ?
    WHERE logId = ?;
  `;

  const patchPostingRow = await connection.query(
    patchPostingQuery,
    patchPostingParams
  );
  return patchPostingRow;
}

// 게시글 삭제
async function deleteRunningLog(connection, logId) {
  const deleteLogQuery = `
    UPDATE RunningLog SET status = 'D' WHERE logId = ?;
  `;

  const deleteLogRow = await connection.query(deleteLogQuery, logId);
  return deleteLogRow;
}

// 상대방에게 러닝로그 스탬프 찍기
async function createRunningLogStamp(connection, insertPostingLogStampParams) {
  const insertRunningLogStampQuery = `
    INSERT INTO RunningLogStamp(gatheringId, userId, targetId, stampCode)
    VALUES (?, ?, ?, ?);
  `;
  const insertRunningLogRow = await connection.query(
    insertRunningLogStampQuery,
    insertPostingLogStampParams
  );

  return insertRunningLogRow;
}

// 상대방에게 찍은 러닝로그 스탬프 수정
async function changeRunningLogStamp(connection, changeLogStampParams) {
  const changeStampQuery = `
    UPDATE RunningLogStamp
    SET stampCode = ?
    WHERE gatheringId = ? AND userId = ? AND targetId = ?;
  `;

  const changeStampRow = await connection.query(
    changeStampQuery,
    changeLogStampParams
  );
  return changeStampRow;
}

// 작성자인지 확인
async function checkWriter(connection, checkWriterParams) {
  const checkWriterQuery = `
    SELECT logId, userId FROM RunningLog
    WHERE logId = ? AND userId = ?;
  `;
  const checkWriterRow = await connection.query(
    checkWriterQuery,
    checkWriterParams
  );

  return checkWriterRow;
}

// 게시글 있는지 확인
async function checkPosting(connection, logId) {
  const checkPostingQuery = `
    SELECT logId FROM RunningLog WHERE logId = ?
  `;
  const checkPostingRow = await connection.query(checkPostingQuery, logId);
  return checkPostingRow;
}

// 러닝로그 작성하려는 유저가 원하는 날짜에 기존 로그 게시물이 있는 지 확인
async function findDuplicateRunningDate(connection, runnedDate, userId) {
  const selectDetailRunningLogQuery = `
    SELECT logId
    FROM RunningLog
    WHERE runnedDate = ? AND userId = ? AND status != 'D';
  `;
  const [row] = await connection.query(selectDetailRunningLogQuery, [
    runnedDate,
    userId,
  ]);
  return row;
}

// 날짜(월)에 해당되는 단체 러닝로그 작성 가능 날짜 수집
async function getGatheringByPeriod(connection, year, month, userId, userId) {
  const selectGatheringByPeriodQuery = `
    SELECT DISTINCT RP.gatheringId, P.gatheringTime
    FROM RunningPeople RP
    INNER JOIN Running R ON RP.gatheringId = R.gatheringId
    INNER JOIN Posting P ON R.postId = P.postId
    WHERE YEAR(P.gatheringTime) = ? AND MONTH(P.gatheringTime) = ?
          AND (RP.userId = ? OR P.postUserId = ?)
          AND P.gatheringTime <= DATE_ADD(NOW(), INTERVAL -3 HOUR);
  `;
  const [row] = await connection.query(selectGatheringByPeriodQuery, [
    year,
    month,
    userId,
    userId,
  ]);
  return row;
}

// 날짜(월)에 해당하는 크루 러닝 카운트 수집
async function getMyGroupRunningCount(connection, year, month, userId) {
  const selectGroupRunningCountQuery = `
    SELECT COUNT(*) AS count
    FROM RunningLog
    WHERE YEAR(runnedDate) = ? AND MONTH(runnedDate) = ? AND userId = ? AND gatheringId IS NOT NULL AND status != 'D';
  `;
  const [row] = await connection.query(selectGroupRunningCountQuery, [
    year,
    month,
    userId,
  ]);
  return row[0].count;
}

// 날짜(월)에 해당하는 개인 러닝 카운트 수집
async function getMyPersonalRunningCount(connection, year, month, userId) {
  const selectPersonalRunningCountQuery = `
    SELECT COUNT(*) AS count
    FROM RunningLog
    WHERE YEAR(runnedDate) = ? AND MONTH(runnedDate) = ? AND userId = ? AND gatheringId IS NULL AND status != 'D';
  `;
  const [row] = await connection.query(selectPersonalRunningCountQuery, [
    year,
    month,
    userId,
  ]);
  return row[0].count;
}

// 날짜(월)에 해당하는 개인 러닝 데이터 수집
async function getMyRunning(connection, year, month, userId) {
  const selectRunningLogQuery = `
    SELECT logId, gatheringId, runnedDate, stampCode, isOpened
    FROM RunningLog
    WHERE YEAR(runnedDate) = ? AND MONTH(runnedDate) = ? AND userId = ? AND status != 'D';
  `;
  const [row] = await connection.query(selectRunningLogQuery, [
    year,
    month,
    userId,
  ]);
  return row;
}

// 마이페이지에서 보여주는 최근 3주간 러닝로그 데이터 수집
async function getUserRecentLog(connection, userId) {
  const selectRecentLogQuery = `
    SELECT logId, gatheringId, runnedDate, stampCode, isOpened
    FROM RunningLog
    WHERE userId = ? 
      AND status != 'D' 
      AND runnedDate BETWEEN DATE_SUB(CURDATE(), INTERVAL 3 WEEK) AND CURDATE()
    ORDER BY runnedDate DESC;
  `;
  const [row] = await connection.query(selectRecentLogQuery, userId);
  return row;
}

// 마이페이지에서 보여주는 최근 3주간 단체 러닝로그 작성 가능 날짜 수집
async function getUserPossibleWriting(connection, userId, userId) {
  const selecttUserPossibleWritingQuery = `
    SELECT DISTINCT RP.gatheringId, P.gatheringTime
    FROM RunningPeople RP
    INNER JOIN Running R ON RP.gatheringId = R.gatheringId
    INNER JOIN Posting P ON R.postId = P.postId
    WHERE (RP.userId = ? OR P.postUserId = ?)
          AND P.gatheringTime <= DATE_ADD(NOW(), INTERVAL -3 HOUR)
          AND P.gatheringTime >= DATE_ADD(NOW(), INTERVAL -3 WEEK);
  `;
  const [row] = await connection.query(selecttUserPossibleWritingQuery, [
    userId,
    userId,
  ]);
  return row;
}

// 러닝로그의 gatheringId 수집
async function getGatheringId(connection, logId) {
  const selectGatheringIdQuery = `
    SELECT gatheringId
    FROM RunningLog
    WHERE logId = ?;
  `;
  const [row] = await connection.query(selectGatheringIdQuery, logId);
  return row[0].gatheringId;
}

// 함께 달린 러너 카운트 수집
async function getPartnerRunnerCount(connection, gatheringId) {
  const selectPartnerRunnerCountQuery = `
    SELECT COUNT(*) AS count
    FROM RunningPeople
    WHERE gatheringId = ?;
  `;
  const [row] = await connection.query(
    selectPartnerRunnerCountQuery,
    gatheringId
  );
  return row[0].count - 1;
}

// 러닝로그 상세 조회 데이터 수집
async function getDetailRunningLog(connection, logId) {
  const selectDetailRunningLogQuery = `
    SELECT R.status, R.runnedDate, R.userId, U.nickname, R.gatheringId, R.stampCode,
           R.contents, R.imageUrl, R.weatherDegree, R.weatherIcon, R.isOpened
    FROM RunningLog R
    INNER JOIN User U on U.userId = R.userId
    WHERE R.logId = ?;
  `;
  const [row] = await connection.query(selectDetailRunningLogQuery, logId);
  return row;
}

// 특정인이 누군가에게 스탬프를 준 기록이 있는 지 조회
async function getCheckGivenStamp(connection, gatheringId, userId, targetId) {
  const checkGivenStampQuery = `
    SELECT stampCode
    FROM RunningLogStamp
    WHERE gatheringId = ? AND userId = ? AND targetId = ?;
  `;
  const [row] = await connection.query(checkGivenStampQuery, [
    gatheringId,
    userId,
    targetId,
  ]);
  return row;
}

// 특정인이 받은 스탬프 목록 조회
async function getDetailStampInfo(connection, gatheringId, targetId) {
  const selectDetailStampInfoQuery = `
    SELECT U.userId, U.nickname, U.profileImageUrl, CASE WHEN R.status = 'D' THEN NULL ELSE R.logId END AS logId, RS.stampCode
    FROM RunningLogStamp RS
    INNER JOIN User U on U.userId = RS.userId
    LEFT OUTER JOIN RunningLog R on R.userId = RS.userId AND R.gatheringId = RS.gatheringId
    WHERE RS.gatheringId = ? AND RS.targetId = ?;
  `;
  const [row] = await connection.query(selectDetailStampInfoQuery, [
    gatheringId,
    targetId,
  ]);
  return row;
}

// 함께한 러너 리스트 조회
async function getPartnerRunners(
  connection,
  userId,
  gatheringId,
  userId,
  gatheringId
) {
  const selectPartnerRunnersQuery = `
      SELECT RP.userId, U.nickname, U.profileImageUrl, 
            CASE WHEN RL.status = 'D' THEN NULL ELSE RL.logId END AS logId,
            RL.isOpened, 
            CASE WHEN RS.userId = ? THEN RS.stampCode ELSE NULL END AS stampCode,
            CASE WHEN RP.userId = R.repUserId THEN 1 ELSE 0 END AS isCaptain
      FROM RunningPeople RP
      LEFT OUTER JOIN User U ON U.userId = RP.userId
      LEFT OUTER JOIN Running R ON R.gatheringId = RP.gatheringId
      LEFT OUTER JOIN RunningLog RL ON RL.userId = RP.userId AND RL.gatheringId = RP.gatheringId AND RL.status != 'D'
      LEFT OUTER JOIN (
          SELECT userId, targetId, stampCode
          FROM (
              SELECT userId, targetId, stampCode, ROW_NUMBER() OVER (PARTITION BY targetId ORDER BY createdAt DESC) AS RowNum
              FROM RunningLogStamp
              WHERE gatheringId = ?
          ) FilteredRS
          WHERE RowNum = 1
      ) RS ON RS.targetId = RP.userId
      WHERE RP.userId != ? AND RP.gatheringId = ?;
  `;
  const [row] = await connection.query(selectPartnerRunnersQuery, [
    userId,
    gatheringId,
    userId,
    gatheringId,
  ]);
  return row;
}

// 스탬프 리스트 조회
async function selectStampList(connection) {
  const query = `SELECT * FROM Stamp`;
  const row = await connection.query(query);
  return row[0];
}

module.exports = {
  createRunningLog,
  updateRunningLog,
  deleteRunningLog,
  createRunningLogStamp,
  changeRunningLogStamp,
  checkWriter,
  checkPosting,
  findDuplicateRunningDate,
  getGatheringByPeriod,
  getMyGroupRunningCount,
  getMyPersonalRunningCount,
  getMyRunning,
  getUserRecentLog,
  getUserPossibleWriting,
  getGatheringId,
  getPartnerRunnerCount,
  getDetailRunningLog,
  getCheckGivenStamp,
  getDetailStampInfo,
  getPartnerRunners,
  selectStampList,
};
