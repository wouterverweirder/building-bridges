module.exports = (function(){

	var Constants = {
		GO_TO_PREVIOUS_SLIDE : 'goToPreviousSlide',
		GO_TO_NEXT_SLIDE : 'goToNextSlide',
		SET_SLIDES : 'setSlides',
		SET_CURRENT_SLIDE_INDEX : 'setCurrentSlideIndex',

		MESSAGE : 'message',
		SOCKET_SEND : 'socketSend',
		SOCKET_RECEIVE : 'socketReceive',
		JOIN_SLIDE_ROOM : 'joinSlideRoom',
		LEAVE_SLIDE_ROOM : 'leaveSlideRoom',

		ROLE_PRESENTATION : 'presentation',
		ROLE_MOBILE : 'mobile',

		STATE_ACTIVE : 'active',
		STATE_INACTIVE : 'inactive',

		SET_SUBSTATE : 'setSubstate',

		CHILD_APP_SAVE_CODE : 'childAppSaveCode',
		CHILD_APP_RUN_CODE : 'childAppRunCode',
		OPEN_COMMAND_LINE: 'openCommandLine',
		OPEN_CAMERA: 'openCamera'
	};

	return Constants;

})();
