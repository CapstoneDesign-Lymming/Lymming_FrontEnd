import { Route, Routes } from "react-router-dom";
import "./App.css";
import { lazy } from "react";

const Main = lazy(() => import("./pages/MainPage/Main"));
const LogIn = lazy(() => import("./pages/LogInPage/LogIn"));
const KakaoAuth = lazy(() => import("./auth/KakaoAuth"));
const Participate = lazy(() => import("./pages/ParticipatePage/Participate"));
const ParticipateDetail = lazy(
  () => import("./pages/ParticipateDetail/ParticipateDetail")
);
const TeamBuilding = lazy(() => import("./pages/TeamBuilding/TeamBuilding"));
const VideoChattingPage = lazy(
  () => import("./pages/VideoChattingPage/VideoChattingPage")
);
const ChatPage = lazy(() => import("./pages/ChatPage/ChatPage"));
const MemberPage = lazy(() => import("./pages/MemberPage/MemberPage"));
const SharePage = lazy(() => import("./pages/SharePage/SharePage"));
const ShareDetailPage = lazy(
  () => import("./pages/ShareDetailPage/ShareDetailPage")
);
const ShareDetailLeader = lazy(
  () => import("./components/ShareDetailComponent/ShareDetailLeader")
);
const CollectPage = lazy(() => import("./pages/CollectPage/CollectPage"));
const GithubAuth = lazy(() => import("./auth/GithubAuth"));
const Mypage = lazy(() => import("./pages/Mypage/Mypage"));
const Loading = lazy(() => import("./components/Loading/Loading"));
const SeoMetaTag = lazy(() => import("./components/Helmet/SeoMetaTag"));

function App() {
  return (
    <div className="App">
      <SeoMetaTag
        title="lymming"
        description="리밍 | 프로젝트를 시작하기 위한 첫 걸음"
      />
      <Routes>
        <Route path="/" element={<Main />}></Route>
        <Route path="/login" element={<LogIn />}></Route>
        <Route path="/auth" element={<KakaoAuth />}></Route>
        <Route path="/api/callback" element={<GithubAuth />}></Route>
        <Route
          path="/videochat/:roomId"
          element={<VideoChattingPage />}
        ></Route>
        <Route path="/participate" element={<Participate />}></Route>
        <Route
          path="/participate/detail/:projectId"
          element={<ParticipateDetail />}
        ></Route>
        <Route path="/teambuild" element={<TeamBuilding />}></Route>
        <Route path="/chat" element={<ChatPage />}></Route>
        <Route path="/member" element={<MemberPage />}></Route>
        <Route path="/share" element={<SharePage />}></Route>
        <Route path="/share/detail/:id" element={<ShareDetailPage />}></Route>
        <Route
          path="/share/detail/leader"
          element={<ShareDetailLeader />}
        ></Route>
        <Route path="/collect" element={<CollectPage />}></Route>
        <Route path="/mypage" element={<Mypage />}></Route>
        <Route path="/loading" element={<Loading />}></Route>
      </Routes>
    </div>
  );
}

export default App;
