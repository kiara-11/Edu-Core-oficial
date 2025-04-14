import HeaderInicio from "@/components/HeaderInicio";
import InicioContenido from "@/components/InicioContenido";
import Footer from '@/components/Footer';
import StatsBar from '@/components/StatsBar';
export default function Home() {
  return (
    <div>
      <HeaderInicio />
      <InicioContenido />
      <StatsBar/>
      <Footer />
    </div>
  );
}
