

const LogoutButton = ({ navigate }) => {


    const logoutClick = async () => {
        
        try {

            const response = await fetch("/api/logout", { method: "POST" })

            if(response.status === 200) {
                navigate("/")
            }

        } catch {
            console.log("An error has occured.")
        }
    }


    return (
        <div className="header-logout">
            <button className="header-logout__btn" onClick={() => logoutClick()}>Logout</button>
        </div>
    )
};

export default LogoutButton;