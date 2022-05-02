import PopupView from '../view/popup-view.js';
import {render} from '../render.js';

export default class PopupPresenter {
  init = (boardContainer, popupModel) => {
    render(new PopupView(...popupModel.getPopup()), boardContainer);
  };
}
