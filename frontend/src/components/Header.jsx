import React from 'react';
import logo from '../assets/logo.png';

const Header = () => {
    return (
        <header className="flex items-center justify-between bg-primary h-16 p-10">
            <h1>
                <a href="/">
                    <img src={logo} alt="logo" className="w-26 h-14" />
                </a>
            </h1>
            <nav className="">
                <ul className="flex items-center justify-center flex-row">
                    <li className="p-4">
                        <a href="/">Auditório</a>
                    </li>
                    <li className="p-4">
                        <a href="/">Sala de Reunião</a>
                    </li>
                    <li className="p-4">
                        <a href="/">Veículos</a>
                    </li>
                </ul>
            </nav>
        </header>
    )
}

export default Header;