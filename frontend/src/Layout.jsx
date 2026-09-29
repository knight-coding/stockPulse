import React from "react";
import Header from './components/common/Header'
import Footer from "./components/common/Footer"
import { Outlet } from "react-router-dom"


function Layout(){
    return(
        <div className="flex flex-col bg-background text-foreground bg-mesh">
            <Header />

            <main className="flex-1">
                <Outlet />
            </main>

            <Footer />
        </div>
    )
}

export default Layout;