import {useContext, useMemo} from "react";
import {Button, Card, Flex, Typography} from "antd";
import dayjs from "dayjs";
import {useNavigate} from "react-router";
import BookingContext from "../modules/booking/context/booking-context.tsx";
import BookingTrainCard from "../modules/booking/ui/booking-train-card.tsx";
import classes from "./page.module.scss";
import qrImage from "../assets/images/qr.png";

const { Title } = Typography;

function SuccessPage() {
    const { bookingInfo } = useContext(BookingContext);
    const navigate = useNavigate();

    const selectedClass = useMemo(() => (
        bookingInfo.selectedTrain?.classes.find(t => t.classCode === bookingInfo.selectedClassCode)
    ), [bookingInfo.selectedTrain, bookingInfo.selectedClassCode]);

    const { departureDate, departureTime, arrivalDate, arrivalTime } = useMemo(() => {
        const bookingDateRaw = Array.isArray(bookingInfo.date) ? bookingInfo.date[0] : bookingInfo.date;
        if (!bookingInfo.selectedTrain || !bookingDateRaw) return {};

        const bookingDate = dayjs(bookingDateRaw);
        const depTime = bookingInfo.selectedTrain.from.time;
        const arrTime = bookingInfo.selectedTrain.to.time;

        const departureDateTime = dayjs(`${bookingDate.format("YYYY-MM-DD")} ${depTime}`, "YYYY-MM-DD HH:mm");
        const arrivalDateTime = dayjs(`${bookingDate.format("YYYY-MM-DD")} ${arrTime}`, "YYYY-MM-DD HH:mm");

        return {
            departureDate: departureDateTime.format("MMM DD"),
            departureTime: departureDateTime.format("h:mm a"),
            arrivalDate: arrivalDateTime.format("MMM DD"),
            arrivalTime: arrivalDateTime.format("h:mm a"),
        };
    }, [bookingInfo.date, bookingInfo.selectedTrain]);

    const total = bookingInfo.billDetails.totalAmountWithDiscount ?? 0;
    const travellerDetails = bookingInfo.passengersData ?? [];
    const contactEmail = travellerDetails[0]?.email ?? 'Not provided';

    return (
        <div className={classes.successContainer}>
            <Title level={2} className={classes.successTitle} style={{color: '#31A91D', fontWeight: 500, marginBottom: 32, marginTop: 32}}>
                Congratulations!<br/>You have successfully booked tickets
            </Title>

                <BookingTrainCard
                    hideTitle
                    successVariant
                    hideClassLine
                    pnr="1234567890"
                    transactionId="351511859256378"
                    trainName={bookingInfo.selectedTrain?.trainName || ""}
                    trainNumber={bookingInfo.selectedTrain?.trainNumber || ""}
                    classCode={selectedClass?.classCode || ""}
                    fareType={selectedClass?.fareType || ""}
                    departureDate={departureDate || ""}
                    departureTime={departureTime || ""}
                    fromStation={bookingInfo.selectedTrain?.from.station || ""}
                    toStation={bookingInfo.selectedTrain?.to.station || ""}
                    arrivalDate={arrivalDate || ""}
                    arrivalTime={arrivalTime || ""}
                    duration={bookingInfo.selectedTrain?.duration || ""}
                >

                <Flex vertical gap={8}>
                    <h2 style={{ margin: 0 }}>Traveller Details</h2>
                    {travellerDetails.length === 0 ? (
                        <Typography.Text type="secondary">No traveller details provided.</Typography.Text>
                    ) : (
                        <Flex vertical gap={8}>
                            {travellerDetails.map((t, idx) => {
                                return (
                                    <Flex key={idx} justify="space-between" style={{ width: '100%' }}>
                                        <span>{t.fullname}</span>
                                    </Flex>
                                );
                            })}
                        </Flex>
                    )}

                    <div className={classes.travellerBlock}>
                        <div className={classes.travellerMeta}>
                            Booking Status : Confirmed (CNF)<br/>
                            Seat/Coach no. : Class {selectedClass?.classCode} & Tatkal Quota<br/>
                            Extra Baggage: {bookingInfo.hasExtraBaggage ? "1" : "0"}<br/>
                            {bookingInfo.billDetails.foodCharges?.length
                                ? bookingInfo.billDetails.foodCharges.map(f => f.name).join(", ")
                                : "No Food Added"}
                        </div>
                    </div>

                    <Flex justify="space-between" style={{ width: '100%', fontSize: 16 }}>
                        <span>E‑Tickets will be sent to:</span>
                        <span>{contactEmail}</span>
                    </Flex>

                    <div className={classes.totalRow}>
                        <span>Total Fare</span>
                        <span>₹{total.toFixed(2)}</span>
                    </div>
                </Flex>
            </BookingTrainCard>

            <Card style={{marginTop: 30, marginBottom: 32}}>
                <Flex gap={77} align="center">
                    <img className={classes.qrImage} src={qrImage} alt="Ticket QR code"/>
                    <Flex vertical gap={20} style={{flex: 1 }}>
                        <Button style={{minHeight:60}} type="primary" size="large" block onClick={() => navigate("/")}>Book another ticket</Button>
                        <Button style={{minHeight:60}} type="primary" size="large" block onClick={() => window.print()}>Download Ticket</Button>
                    </Flex>
                </Flex>
            </Card>

            <Flex justify="center" gap={30} wrap style={{ marginBottom: 66, fontWeight: 500, fontSize: 14, color: 'rgba(1, 0, 4, 0.5)'}}>
                <span>Cancellation Policy</span>
                <span>Terms & Conditions</span>
                <span>Travel Insurance</span>
            </Flex>
        </div>
    );
}

export default SuccessPage;
