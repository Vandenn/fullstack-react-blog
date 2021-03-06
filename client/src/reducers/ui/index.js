import { combineReducers } from 'redux';
import homePageReducer from './homePage';
import viewPostPageReducer from './viewPostPage';

export default combineReducers({
  homePage: homePageReducer,
  viewPostPage: viewPostPageReducer,
});
