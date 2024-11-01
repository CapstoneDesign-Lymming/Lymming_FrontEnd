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
  team_member_name:string[],
  is_completed:boolean,
}

const fetchLocalData  =async()=>{
  const response = await fetch('/json/SharePage.json');
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
                <div className='SharePage-BodyWrapper'>
                  {data.ShareData.map((item:itemType)=>(
                    <div className={`SharePage-BodyWrapper-CardWrapper ${item.is_completed?"completed":""}`}
                      key={item.project_id}>
                        <div className='CardInsideWrapper'>
                          <div className='CardHeader'>
                            <div className='CardHeader-Title'>{item.project_name}</div>
                          </div>
                          <div className='CardBody'>
                              <img src={`${item.project_url}`} alt="" />
                          </div>
                          <div className='CardFooter'>
                            <div className='CardFooter-Description'>{item.project_description}</div>
                            <div className='CardFooter-MembersWrapper'>
                              {item.team_member_name.map((name)=>(
                                <div className='memberItem'>{name}</div>
                              ))}
                            </div>
                          </div>
                        </div>
                    
                    </div>
                  ))}
                </div>
            </div>
        </div>
    </>
  )
}

export default SharePage