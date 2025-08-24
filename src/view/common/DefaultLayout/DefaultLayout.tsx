import {MainContent} from "../MainContent/MainContent.tsx";
import Footer from "../Footer/Footer.tsx";
import Navbar from "../Navbar/Navbar.tsx";

export function DefaultLayout() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar/>
            <main className="flex-grow">
                <MainContent/>
            </main>
            <Footer/>
        </div>
    );
}