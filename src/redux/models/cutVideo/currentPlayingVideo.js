/**
 * Created by DELL on 2017/12/7.
 */
/*
* 当前正在播放的视频
* 用于切换视频后canvas将新的video画到画布上面
* */
export const CHANGE_PLAY_VIDEO = 'CHANGE_PLAY_VIDEO';

const defaultState = {
  trackIndex: -1,
  itemIndex: -1
};

export default function reduce (state = defaultState, action = {}) {
  switch (action.type) {
    case 'CHANGE_PLAY_VIDEO' :
      return {...state, ...action.data};
    default :
      return state
  }
}

export const change_play_video = (trackIndex, itemIndex) => {
  // console.log(truckIndex, 'truckIndex', itemIndex, 'itemIndex');
  return {
    type: CHANGE_PLAY_VIDEO,
    data: {
      trackIndex,
      itemIndex
    }
  }
};