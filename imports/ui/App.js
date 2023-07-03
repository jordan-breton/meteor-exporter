import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { ExportsCollection } from "../db/ExportsCollection";

import './App.html';
import './Export.js';

const HIDE_COMPLETED_STRING = 'hideCompleted';
const IS_LOADING_STRING = 'isLoading';

const getExportsFilter = () => {
	const hideCompletedFilter = { progress: { $lt: 100 } };

	const pendingOnlyFilter = { ...hideCompletedFilter };

	return { pendingOnlyFilter };
}

Template.mainContainer.onCreated(function mainContainerOnCreated() {
	this.state = new ReactiveDict();

	const handler = Meteor.subscribe('exports');
	Tracker.autorun(() => {
		this.state.set(IS_LOADING_STRING, !handler.ready());
	});
});

Template.mainContainer.helpers({
	exports() {
		const instance = Template.instance();
		const hideCompleted = instance.state.get(HIDE_COMPLETED_STRING);

		const { pendingOnlyFilter } = getExportsFilter();

		return ExportsCollection.find(hideCompleted ? pendingOnlyFilter : {}, {
			sort: { createdAt: -1 },
		}).fetch();
	},
	hideCompleted() {
		return Template.instance().state.get(HIDE_COMPLETED_STRING);
	},
	isLoading() {
		const instance = Template.instance();
		return instance.state.get(IS_LOADING_STRING);
	}
});

Template.mainContainer.events({
	"click #hide-completed-button"(event, instance) {
		const currentHideCompleted = instance.state.get(HIDE_COMPLETED_STRING);
		instance.state.set(HIDE_COMPLETED_STRING, !currentHideCompleted);
	},
	"click #start-export"(){
		Meteor.call('exports.start');
	}
});