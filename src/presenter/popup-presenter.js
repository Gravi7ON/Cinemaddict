import PopupView from '../view/popup-view.js';
import {render} from '../render.js';

export default class PopupPresenter {
  init = (boardContainer) => {
    this.boardContainer = boardContainer;

    render(new PopupView(), this.boardContainer);
  };
}
