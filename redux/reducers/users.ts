const initialState = {
  currentUser: null,
};
const user = (state = initialState, action: any) => {
  return {
    ...state,
    currentUser: action.currentUser,
  };
};

export default user;
