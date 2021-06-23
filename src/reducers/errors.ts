export const ERROR = 'errror';
export const CORRECT = 'correct';

export const errorReducer = (state, action) => {
  switch (action.type) {
    case ERROR:
      return { error: true, message: action.payload, valid: 'oui' };
    case CORRECT:
      return { error: false, message: '', valid: 'non' };
    default:
      return null;
  }
};
