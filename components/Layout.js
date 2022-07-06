import Header from "./Header"
import Sidebar from "./Sidebar"

export default function Layout({ children }) {
    return (
        <div className="flex-1">
            <Header />
            <div className="flex flex-col-2">
                <Sidebar />
                <div>{children}</div>
            </div>
        </div>
    )
}
