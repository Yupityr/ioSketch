export default function About() {
    return (
        <section id="about" className="relative py-20 px-4 overflow-hidden bg-slate-900">
            <div className="relative z-10 max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-5xl md:text-6xl font-bold bg-linear-to-r from-blue-200 via-cyan-200 to-indigo-200 bg-clip-text text-transparent mb-4">
                        About ioSketch
                    </h2>
                    <div className="h-1 w-20 bg-linear-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
                </div>
            </div>
            <div className="mb-12">
                <div className="grid grid-cols-1 gap-6">
                    <div className="flex flex-col m-auto justify-center backdrop-blur-xl bg-slate-800/40 border border-slate-700/40 rounded-xl p-6 hover:bg-slate-800/60 transition-all duration-300">
                        <div className="text-4xl m-auto">✨</div>
                        <p className="text-slate-400 text-lg min-w-md">
                            ioSketch is a social drawing web app where users can send sketches to friends in real time.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}