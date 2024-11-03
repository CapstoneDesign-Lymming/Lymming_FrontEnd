import './ShareDetailCommon.scss'
interface ShareDetailLeaderProps{
    leaderData: {
        userId: number,
        project_id: number,
        project_name: string,
        project_url: string,
        project_description: string,
        team_member: number[],
        team_member_name: string[],
        is_completed: boolean,
      }
  }


const ShareDetailCommon = ({leaderData}:ShareDetailLeaderProps) => {
    console.log(leaderData.project_url)
  return (
    <>  
        {/* <div>공통 페이지</div>
        <div>{leaderData.project_description}</div> */}
        <div className='ShareDetailCommonWrapper'>
            <div className='ShareDetailCommon'>
                <div className='ShareDetailCommon-Header'>
                    {leaderData.project_name}
                </div>
                <div className='ShareDetailCommon-Body'>
                    <img src={`${leaderData.project_url}`} alt=""/>
                    <div className='Body_description'>
                        {leaderData.project_description}
                    </div>
                </div>
                <div className='ShareDetailCommon-Footer'>

                </div>
            </div>
            
        </div>
    </>
)
}

export default ShareDetailCommon