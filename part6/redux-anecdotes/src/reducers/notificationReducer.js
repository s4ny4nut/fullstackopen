import { createSlice } from "@reduxjs/toolkit"

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setNotificationMessage(state, action) {
      return action.payload
    },
    removeNotificationMessage(state, action) {
      return ''
    }
  }
})

export const {setNotificationMessage, removeNotificationMessage} = notificationSlice.actions

export const setNotification = (message, time) => {
  return async dispatch => {
    dispatch(setNotificationMessage(message, time))
    setTimeout(() => {
      dispatch(setNotificationMessage(''))
    }, time)
  }
}

export default notificationSlice.reducer