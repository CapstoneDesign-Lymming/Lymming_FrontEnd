import { useQuery } from 'react-query';
import Header from '../../components/header/Header';
import './SharePage.scss';

interface itemType{
  userId:number,
  project_id:number,
  project_name:string,
  project_url:string,
  project_description:string,
  team_member:number[],
  team_member_name:string[]

}

const fetchLocalData  =async()=>{
  const response = await fetch('/json/testJson.json');
  if(!response.ok){
     throw new Error('Network error');
  }
  return response.json();
}

const SharePage = () => {
  const {data,error,isLoading} = useQuery('localData',fetchLocalData);
  if(isLoading) return <div>로딩 중!</div>
  if(error) return <div>에러</div>
  return (
    <>
        <Header/>
        <div className='SharePageWrapper'>
            <div className='SharePage'>
                <div className='SharePage-Header'>팀 공유 페이지</div>
                <div className='SharePage-BodyWrapper'>
                  {data.ShareData.map((item:itemType)=>(
                    <div key={item.project_id}>
                      <h2>{item.project_name}</h2>
                      <p>{item.project_description}</p>
                      <p>팀원: {item.team_member_name.join(", ")}</p>
                    </div>
                  ))}
                </div>
            </div>
        </div>
    </>
  )
}

export default SharePage