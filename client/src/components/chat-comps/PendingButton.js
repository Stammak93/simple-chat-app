import React, { useEffect, useState, useRef } from "react";
import AcceptRequest from "./AcceptRequest";


const PendingButton = ({ pendingFriends, updatePendingFriends, updateFriendList, you }) => {

    const [pendingList, setPendingList] = useState(false);
    const ref = useRef();


    useEffect(() => {

        const onBodyClick = (e) => {

            if(ref.current.contains(e.target)) {
                return;
            }

            setPendingList(false)
        }
        console.log("pending button rendering")
        document.body.addEventListener("click", onBodyClick, { capture: true })

        return () => {
            document.body.removeEventListener("click", onBodyClick, { capture: true })
        }

    },[])


    return (
        <div ref={ref} className="pending-list-toggle">
          <button className="pending-list-toggle__btn" 
            onClick={(e) => setPendingList(!pendingList)}
          >Pending Requests
          </button>
          { pendingList ? 
            <AcceptRequest
              setPendingList={setPendingList}
              pendingFriends={pendingFriends} 
              updatePendingFriends={updatePendingFriends}
              updateFriendList={updateFriendList}
              you={you}
            /> : null }
        </div>
    )
}

export default PendingButton;