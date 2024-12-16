"use client";

import { logout } from "../login/actions";

export default function Dashboard() {
    return (
    <div>
        <div className="py-4 px-8 bg-black rounded-xl text-slate-600 
    border border-white max-w-[300px]">
        <h1>
        Dashboard
        </h1>
        <button className="bg-black border border-white text-white hover:text-slate-900"
        onClick={() => logout()}>Logout</button>
        </div>
    </div>
    );
}