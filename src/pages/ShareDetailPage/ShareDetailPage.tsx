import { useLocation } from "react-router-dom"
import Header from "../../components/header/Header"
import './ShareDetailPage.scss'
const ShareDetailPage = () => {
    const location = useLocation();
    const data = location.state;
    console.log(data)
    return (
        <>
            <Header/>
            <div className="ShareDetailPageWrapper">
                ShareDetailPage
                <div>
                    {data.team_member_name}
                </div>
            </div>
        </>
    )
}

export default ShareDetailPage