import Navbar from "./components/navbar/Navbar";

const Categorylayout = ({ children }: { children: React.ReactNode }) => {
    return (<main>
        {/* navbar */}
        <Navbar />
        {/* content */}
        <div className="p-4 border rounded-b-md rounded-tr-md shadow-md h-full shadow-md">
            {children}
        </div>
    </main>);
}

export default Categorylayout;