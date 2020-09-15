import { ActionType, ResetType } from '../../types/store/StoreType';
import {
  ActivityStateType,
  SET_ACTIVITY,
  SET_CARD_INDEX,
  SET_EXIT_CONFIRMATION_MODAL,
  RESET_ACTIVITY_REDUCER,
} from '../../types/store/ActivityStoreType';

const initialState: ActivityStateType = { activity: null, cardIndex: null, exitConfirmationModal: false };

export const activities = (
  state: ActivityStateType = initialState,
  action: ActionType | ResetType
): ActivityStateType => {
  switch (action.type) {
    case SET_ACTIVITY:
      return { ...state, activity: action.payload };
    case SET_CARD_INDEX:
      return { ...state, cardIndex: action.payload };
    case SET_EXIT_CONFIRMATION_MODAL:
      return { ...state, exitConfirmationModal: action.payload };
    case RESET_ACTIVITY_REDUCER:
      return initialState;
    default:
      return state;
  }
};