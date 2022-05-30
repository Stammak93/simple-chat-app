import { gql } from "@apollo/client";

export const GET_USER = gql`
    query Query {
        getUser {
            googleId
            userName
            friendList
            pendingFriends
            notifications
        }
    }
`;

export const GET_ROOM = gql`
    query Query($roomId: String) {
        getChatRoom(roomId: $roomId) {
            chatRoom {
                roomId
                messages {
                    sender
                    body
                    timestamp
                }
            }
            friend {
                userName
            }
        }
    }
`