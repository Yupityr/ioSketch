import { useNavigate } from "react-router-dom";
import About from "../components/About";

const Home = () => { 
  const navigate = useNavigate();
    return (
      <>
        <main className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center overflow-hidden">
            <div className="relative z-10 max-w-xl w-full px-6">
              <div className="backdrop-blur-xl bg-linear-to-b from-slate-800/60 to-slate-900/40 rounded-2xl border border-slate-700/50 shadow-2xl p-8 md:p-12 transition-all duration-500 hover:border-slate-600/80">
                <img className="sm:w-lg h-auto w-full" src="/logo.png" alt="logo" />
                <button onClick={() => {navigate("/sketch")}} className="w-full group relative mt-2 py-4 px-6 rounded-xl overflow-hidden transition-all duration-300 bg-cyan-500  hover:shadow-2xl hover:shadow-blue-500/30">
                  <span className="relative flex items-center justify-center gap-3 font-bold text-lg text-white tracking-wide">Draw</span>
                </button>
              </div>
            </div>
        </main>
        <About />
      </>
    )
};

export default Home