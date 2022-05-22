import React from "react";

const Login = () => {


    const loginClick = () => {
        window.location.href = "/auth/google"
    }


    return (
        <div className="login-area rise">
          <div className="login container rise">
            <div className="welcome-btn">
              <button className="btn" onClick={() => loginClick()}>Login with Google</button>
            </div>
          </div>
        </div>
    )
}

export default Login;