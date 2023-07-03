import { Template } from 'meteor/templating';

import './Export.html';

Template.export.helpers({
	completed(){
		return this.progress >= 100;
	}
})