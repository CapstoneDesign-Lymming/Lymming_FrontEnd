const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app: any) {
  // WebSocket 요청을 프록시하기 위한 설정
  app.use(
    "/chatting", // WebSocket 경로 (여기서는 /chatting을 사용)
    createProxyMiddleware({
      target: "wss://lymming-back.link", // 실제 WebSocket 서버 주소
      ws: true, // WebSocket 연결을 프록시하려면 ws: true로 설정
      changeOrigin: true, // Origin 헤더를 변경하여 CORS 문제 해결
      secure: true, // SSL을 사용하는 경우 true로 설정
    })
  );

  // 다른 API 요청을 프록시하는 설정도 가능
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://lymming-back.link",
      changeOrigin: true,
      secure: true, // SSL을 사용하는 경우 true로 설정
    })
  );
};
