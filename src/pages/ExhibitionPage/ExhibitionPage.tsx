import { Canvas } from "@react-three/fiber";
import Header from "../../components/header/Header";
import './ExhibitionPage.scss';


function Box() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial  />
    </mesh>
  );
}

const ExhibitionPage = () => {
  return (
    <>
        <Header/>
        <div className="Exhibition">
          <>
            <Canvas>
              <ambientLight/>
              <pointLight position={[10,10,10]}/>
              <Box/>
            </Canvas>
          </>
        </div>
    </>
  )
}

export default ExhibitionPage