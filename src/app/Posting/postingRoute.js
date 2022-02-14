module.exports = function (app) {
    const posting = require("./postingController");
    const jwtMiddleware = require("../../../config/jwtMiddleware");
    // 6. 게시글 작성 API
    app.post("/postings/:userId", jwtMiddleware, posting.createPosting);

    // 8. 게시글 상세페이지 API
    app.get("/postings/:postId/:userId", jwtMiddleware, posting.getPosting);

    // 10. 마감하기(작성자) API
    app.post("/postings/:postId/closing", jwtMiddleware, posting.closePosting);
};
