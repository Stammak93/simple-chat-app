import { gql } from "@apollo/client";


export const GET_USER = gql`
    query GetUser {
        getUser {
            googleId
            userName
            friendList
            pendingFriends
            notifications
        }
    }
  
`

export const GET_ROOM = gql`
    query GetChatRoom($roomId: String) {
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

export const NEW_MESSAGE = gql`
    mutation NewMessage($roomId: String!, $sender: String!, $body: String!, $timestamp: Int!) {
        newMessage(roomId: $roomId, sender: $sender, body: $body, timestamp: $timestamp)
    }
`

export const NOTIFY_USER = gql`
    mutation NotifyUser($friendUsername: String!) {
        notifyUser(friendUsername: $friendUsername)
    }
`

export const CREATE_ROOM = gql`
    mutation CreateRoom($friendUsername: String!, $updateNotifications: Boolean!) {
        createRoom(friendUsername: $friendUsername, updateNotifications: $updateNotifications)
    }
`

export const ACCEPT_FRIEND = gql`
    mutation AcceptFriend($willAccept: Boolean!, $friendUsername: String!) {
        acceptFriend(willAccept: $willAccept, friendUsername: $friendUsername) {
            friendList
            pendingFriends
        }
    }
`

export const ADD_USER = gql`
    mutation AddUser($friendUsername: String!) {
        addUser(friendUsername: $friendUsername)
    }
`