import React, { useState, Fragment, useContext, memo, useEffect } from 'react';
import styled from 'styled-components';
import { Theme, Typography, Icon } from '@material-ui/core';
import AppContext from '../../context/AppContext';
import moment from 'moment';
import { IEvent } from './EventForm';

const DateBlock = memo(
	(props: {
		labelMonth: string;
		labelYear: string
		className: string;
		label: string;
		setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
		setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
	}) => {
		const {
			state: { events, dateContext }
		} = useContext(AppContext);

		const [todaysEvents, setTodaysEvents] = useState<Array<any>>([]);

		useEffect(() => {
			if (events) {
				const curDate = `${props.label}-${props.labelMonth}-${props.labelYear}`;
				const draft = Object.values(events).filter(event => moment(event.createdOn).format('D-MM-YYYY') === curDate);
				setTodaysEvents(draft);
			}
		}, [events, props.label]);

		const handleClick = (event: React.MouseEvent<HTMLTableDataCellElement, MouseEvent>) => {
			props.setAnchorEl(event.currentTarget);
			let day = parseInt(props.label);
			let month = parseInt(dateContext.format('MM')) - 1;
			let year = parseInt(dateContext.format('YYYY'))
			const date = moment().set({'year': year, 'month': month, 'date': day}).format();
			props.setSelectedDate(date);
		};

		const getEvent = (event: IEvent) => {
			const icon = event.type === 'event' ? 'calendar_today' : 'alarm';
			return (
				<EventChip className='event-chip' type={event.type}>
					<EventChipText title={event?.title}>{event?.title}</EventChipText>
					<EventChipIcon>{icon}</EventChipIcon>
				</EventChip>
			);
		};
		
		return (
			<Fragment>
				<TDDays className={props.className} aria-controls='event-popup' aria-haspopup='true' onClick={handleClick}>
					<Block>
						<CalenderDay>
							<DayText label={props.label} />
							<EventChipsContainer>
								{todaysEvents?.length ? todaysEvents?.map(event => getEvent(event)) : null}
							</EventChipsContainer>
						</CalenderDay>
					</Block>
				</TDDays>
			</Fragment>
		);
	},
	(prevProps, nextProps) => {
		if (prevProps.className === nextProps.className && prevProps.label === nextProps.label) {
			return true;
		} else {
			return false;
		}
	}
);

export default DateBlock;

const EventChipsContainer = styled.div`
	display: grid;
	gap: 2px;
	margin-left: -4px;
	margin-right: -4px;
	overflow-y: auto;

	&::-webkit-scrollbar {
		width: 4px;
	}
	&::-webkit-scrollbar-thumb {
		background: linear-gradient(to right, #fff 50%, #1d2236 50%);
	}
`;
const EventChip = styled.span`
	height: 16px;
	display: grid;
	grid-template-columns: 1fr auto;
	padding: 2px 4px;
	border-radius: 4px;
	background: ${(props: { theme: Theme, type: string }) => props.type === 'event' ? 
		'#039BE5' : '#3F51B5'};
`;
const EventChipIcon = styled(Icon)`
	font-size: 14px !important;
`;
const EventChipText = styled.p`
	margin: unset !important;
	font-size: 12px;
	line-height: 1.2;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;
const DayText = styled(({ label, ...rest }) => (
	<Typography variant='button' {...rest}>
		{label}
	</Typography>
))`
	line-height: 1.25 !important;
`;
const TDDays = styled.td`
	width: 100px;
	height: 75px;
	${(props: { theme: Theme }) => `
		color: ${props?.theme?.palette?.primary?.main};

		&.current-day > div > div {
			background: #d2e3fc;
			color: #1d2236;
		}
	`}
`;
const CalenderDay = styled.div`
	height: initial;
	width: 100%;
	padding: 6px;
	display: grid;
	grid-template-rows: auto 1fr;
	gap: 2px;
	border-radius: 4px;
	box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14),
		0px 1px 5px 0px rgba(0, 0, 0, 0.12);
	transition: box-shadow 240ms ease-in-out;

	&:hover {
		box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14),
			0px 1px 18px 0px rgba(0, 0, 0, 0.12);
	}
`;
const Block = styled.div`
	display: flex;
	height: inherit;
`;
