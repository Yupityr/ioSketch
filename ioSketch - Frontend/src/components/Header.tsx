const Header = () => {
    return (
        <div className="flex justify-between shadow-2xl bg-slate-900">
            <img className="w-35 h-auto" src="/logo.png" alt="logo" />
            <ul className="flex justify-center items-center mx-2">
                <li >
                    <a href="#about" className="font-bold bg-linear-to-r from-blue-200 via-cyan-200 to-indigo-200 bg-clip-text text-transparent">About</a>
                </li>
            </ul>
        </div>
    )
}

export default Header