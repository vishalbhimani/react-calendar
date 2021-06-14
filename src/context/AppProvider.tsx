import React, { useState, useEffect, useContext } from 'react';
import moment from 'moment';
import AppContext, { IAppContext } from './AppContext';
import { IEvent } from '../components/Calender/EventForm';
import MongoContext from '../MongoContext';


export default function AppProvider(props: any) {

	const { client } = useContext(MongoContext);

	const momentContext = moment();
	const listOfMonths = moment?.months();

	const [dateContext, setDateContext] = useState<moment.Moment>(momentContext);
	const [month, setMonth] = useState<string>(moment().format('MMMM'));
	const [year, setYear] = useState<string>(moment().format('Y'));
	const [events, setEvents] = useState<any>({});

	useEffect(() => {
		if(client) fetchEvent();
	}, [client]);

	useEffect(() => {
		const draftContext = Object.assign({}, dateContext);
		setDateContext(moment(draftContext).set('month', listOfMonths?.indexOf(month)));
	}, [month]);

	useEffect(() => {
		const draftContext = Object.assign({}, momentContext);
		setDateContext(moment(draftContext).set('year', parseInt(year)));
	}, [year]);

	const onChangeMonth = (value: string) => setMonth(value);

	const onChangeYear = (value: string) => setYear(value);

	const addEvent = (data: IEvent) => {
		if (data?.createdOn) {
			const rests = client.db('sample_calendar').collection('event');
			rests.insertOne(data).then((res: any) => {
				fetchEvent();
			})
		}
	}

	const fetchEvent = () => {
		const rests = client.db('sample_calendar').collection('event');
		rests.find().then((event: any) => {
			let evt = {};
			event.forEach((obj: any) => {
				evt = Object.assign({}, { ...evt }, { [obj?.createdOn] : obj })
			})
			setEvents(evt);
		});
	}

	const contextValue: IAppContext = {
		state: {
			dateContext,
			listOfMonths,
			month,
			year,
			events
		},
		actions: {
			setDateContext,
			onChangeMonth,
			onChangeYear,
			addEvent
		}
	};
	return <AppContext.Provider value={contextValue}>{props.children}</AppContext.Provider>;
}
