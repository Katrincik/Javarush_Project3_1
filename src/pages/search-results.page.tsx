import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {useNavigate, useSearchParams} from "react-router";
import {Badge, Descriptions, type DescriptionsProps, Flex, Typography} from "antd";
import {getStationNameByCode, getTripVariantName} from "../shared/utils.ts";
import dayjs from "dayjs";
import classes from './page.module.scss'
import TrainCard from "../modules/trains/ui/train-card.tsx";
import {type Train, type TrainClass} from "../shared/constants/train-mock.data.ts";
import BookingContext from "../modules/booking/context/booking-context.tsx";

const { Title } = Typography

const styles: DescriptionsProps['styles'] = {
    content: {
        color: '#1677ff',
        fontWeight: '500',
    },
    label: {
        color: '#000',
    },
    title: {
        fontSize: '2rem',
        color: '#1677ff',
    }
};

function SearchResultsPage() {
    const navigate = useNavigate();
    const { bookingInfo, setBookingInfo } = useContext(BookingContext)
    const [departureDate, setDepartureDate] = useState<string | null>(null);
    const [arrivalDate, setArrivalDate] = useState<string | null>(null);

    const [searchParams] = useSearchParams()
    const tripVariant = searchParams.get('tripVariant')
    const departure = searchParams.get('departure')
    const arrival = searchParams.get('arrival')
    const date = searchParams.get('date')?.split('_')
    const passengers = parseInt(searchParams.get('passengers') ?? '0')
    
    const formatDate = useCallback(() => {
        if (date?.length === 1) {
            // Парсим дату в формате MM-DD-YYYY
            const parsed = dayjs(date[0]);
            console.log('Parsed departure:', parsed.format('DD MMM YYYY'))
            setDepartureDate(parsed.format('DD MMM YYYY'))
        }

        if (date?.length === 2) {
            // Парсим обе даты
            const parsedDeparture = dayjs(date[0]);
            const parsedArrival = dayjs(date[1]);

            console.log('Parsed departure:', parsedDeparture.format('DD MMM YYYY'))
            console.log('Parsed arrival:', parsedArrival.format('DD MMM YYYY'))

            setDepartureDate(parsedDeparture.format('DD MMM YYYY'))
            setArrivalDate(parsedArrival.format('DD MMM YYYY'))
        }
    }, [date])

    console.log(departureDate)
    console.log(arrivalDate)

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        formatDate()
    }, [date, formatDate]);

    const fromStationName = departure ? getStationNameByCode(departure) : 'Unknown';
    const toStationName = arrival ? getStationNameByCode(arrival) : 'Unknown';

    const promoCards = [
        {
            id: 'holidays',
            text: 'Planning your holidays →',
            bg: 'src/assets/images/ocean-sky-caribbean-paradise-holiday.jpg'
        },
        {
            id: 'packages',
            text: 'Train tourism packages →',
            bg: 'src/assets/images/indian-railways.png'
        }
    ];

    const designTrains: Train[] = useMemo(() => ([
        {
            id: 1001,
            trainNumber: "22426",
            trainName: "VANDE BHARAT",
            from: { station: fromStationName, code: departure || "", time: "11:25 pm", date: "Nov 16" },
            to: { station: toStationName, code: arrival || "", time: "7:25 am", date: "Nov 17" },
            duration: "8 hours",
            classes: [
                { classCode: "3A", className: "Third AC", availability: { type: "available", count: 46 }, fareType: "Tatkal", price: 800 },
                { classCode: "2A", className: "Second AC", availability: { type: "available", count: 6 }, fareType: "Tatkal", price: 1000 },
                { classCode: "1A", className: "First AC", availability: { type: "waitlist", position: 36 }, fareType: "Tatkal", price: 1200 },
            ],
        },
        {
            id: 1002,
            trainNumber: "22412",
            trainName: "ARUNACHAL EXP",
            from: { station: fromStationName, code: departure || "", time: "11:45 pm", date: "Nov 16" },
            to: { station: toStationName, code: arrival || "", time: "7:45 am", date: "Nov 17" },
            duration: "8 hours",
            classes: [
                { classCode: "3A", className: "Third AC", availability: { type: "available", count: 446 }, fareType: "Tatkal", price: 800 },
                { classCode: "2A", className: "Second AC", availability: { type: "available", count: 166 }, fareType: "Tatkal", price: 1000 },
                { classCode: "1A", className: "First AC", availability: { type: "waitlist", position: 6 }, fareType: "Tatkal", price: 1400 },
            ],
        },
        {
            id: 1003,
            trainNumber: "12572",
            trainName: "SHATABDI EXPRESS",
            from: { station: fromStationName, code: departure || "", time: "11:50 pm", date: "Nov 16" },
            to: { station: toStationName, code: arrival || "", time: "9:50 am", date: "Nov 17" },
            duration: "10 hours",
            classes: [
                { classCode: "3A", className: "Third AC", availability: { type: "available", count: 446 }, fareType: "Tatkal", price: 800 },
                { classCode: "2A", className: "Second AC", availability: { type: "available", count: 166 }, fareType: "Tatkal", price: 1000 },
                { classCode: "1A", className: "First AC", availability: { type: "waitlist", position: 6 }, fareType: "Tatkal", price: 1400 },
            ],
        },
    ]), [fromStationName, toStationName, arrival, departure]);

    const items: DescriptionsProps['items'] = useMemo(() => (
        [
            {
                key: '1',
                span: 2,
                label: 'Trip Variant',
                children: <Badge style={{ color: '#1677ff', }} status="processing" text={tripVariant ? getTripVariantName(tripVariant) : 'No data'} /> ,
            },
            {
                key: '2',
                span: 2,
                label: 'Passengers',
                children: passengers,
            },
            {
                key: '3',
                span: 2,
                label: 'Departure',
                children: departure ? getStationNameByCode(departure) : 'No data',
            },
            {
                key: '4',
                span: 2,
                label: 'Arrival',
                children: arrival ? getStationNameByCode(arrival) : 'No data',
            },
            {
                key: '5',
                span: 2,
                label: 'Departure Date',
                children: departureDate ?? 'No data',
            },
            {
                key: '6',
                span: 2,
                label: 'Return Date',
                children: arrivalDate ?? 'No data',
                // ?? null undefined
                // || на все falsy -> null, undefined, '', 0, false, NaN
            },
        ]
    ), [tripVariant, departure, arrival, arrivalDate, departureDate, passengers]);

    function goToReviewBookingPage(trainClass: TrainClass, train: Train) {
        setBookingInfo({
            ...bookingInfo,
            date: date,
            arrival: arrival || undefined,
            departure: departure || undefined,
            passengers: passengers || undefined,
            tripVariant: tripVariant || undefined,
            selectedClassCode: trainClass.classCode,
            selectedTrain: train
        })
        navigate('/review-booking')
    }

    return (
        <div className={classes.searchResultsContainer}>
            <Descriptions className={classes.descriptions} styles={styles} title="Search results" layout="vertical" items={items} column={4} />
            <div className={classes.promoContainer}>
                {promoCards.map(card => (
                    <div
                        key={card.id}
                        className={classes.promoCard}
                        style={{ backgroundImage: `url(${card.bg})` }}
                    >
                        <a href='#' style={{color: 'white', zIndex: 1}}>{card.text}</a>
                    </div>
                ))}
                <div className={classes.promoText}>
                    Our trains don't just transport people, they transport emotions and stories! From the mountains of Darjeeling to the beaches of Goa, we connect more than just stations. As Raj Koothrappali would say, "In India, we don't just ride trains, we experience cosmic journeys with occasional cow delays." Book now and embrace the colorful chaos!
                </div>
            </div>
            <Title className={classes.title}>Available Trains</Title>
            <Flex className={classes.trainsCardsContainer} vertical gap={32}>
                {designTrains.map((t) => (
                    <TrainCard
                        key={t.id}
                        title={`${t.trainNumber} - ${t.trainName}`}
                        departure={{
                            date: t.from.date,
                            time: t.from.time,
                            station: t.from.station
                        }}
                        arrival={{
                            date: t.to.date,
                            time: t.to.time,
                            station: t.to.station
                        }}
                        duration={t.duration}
                        ticketClasses={t.classes}
                        onClickCard={(trainClass) => goToReviewBookingPage(trainClass, t)}
                    />
                ))}
            </Flex>
        </div>
    );
}

export default SearchResultsPage;
