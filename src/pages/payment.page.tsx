import {useContext, useMemo, useState} from "react";
import {Button, Card, Flex, Form, Input, Radio, Typography} from "antd";
import classes from "./page.module.scss";
import BookingContext from "../modules/booking/context/booking-context.tsx";
import BookingTrainCard from "../modules/booking/ui/booking-train-card.tsx";
import dayjs from "dayjs";
import {SafetyCertificateOutlined} from "@ant-design/icons";

const { Title, Text } = Typography;

function PaymentPage() {
    const { bookingInfo } = useContext(BookingContext);
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'bitcoin' | undefined>(undefined);

    const selectedClass = useMemo(() => (
        bookingInfo.selectedTrain?.classes.find(t => t.classCode === bookingInfo.selectedClassCode)
    ), [bookingInfo.selectedTrain, bookingInfo.selectedClassCode]);

    const { departureDate, departureTime, arrivalDate, arrivalTime } = useMemo(() => {
        const bookingDateRaw = Array.isArray(bookingInfo.date) ? bookingInfo.date[0] : bookingInfo.date;

        if (!bookingInfo.selectedTrain || !bookingDateRaw) return {};

        const bookingDate = dayjs(bookingDateRaw);
        const depTime = bookingInfo.selectedTrain.from.time;
        const arrTime = bookingInfo.selectedTrain.to.time;

        const departureDateTime = dayjs(`${bookingDate.format('YYYY-MM-DD')} ${depTime}`, 'YYYY-MM-DD HH:mm');
        const arrivalDateTime = dayjs(`${bookingDate.format('YYYY-MM-DD')} ${arrTime}`, 'YYYY-MM-DD HH:mm');

        return {
            departureDate: departureDateTime.format('MMM DD'),
            departureTime: departureDateTime.format('h:mm a'),
            arrivalDate: arrivalDateTime.format('MMM DD'),
            arrivalTime: arrivalDateTime.format('h:mm a')
        };
    }, [bookingInfo.date, bookingInfo.selectedTrain]);

    const travellerDetails = bookingInfo.passengersData ?? [];
    const addedFood = bookingInfo.foodData?.filter(f => f.isAdded) ?? [];
    const contactEmail = travellerDetails[0]?.email ?? 'Not provided';
    const totalCharge = bookingInfo.billDetails.totalAmountWithDiscount ?? 0;

    return (
        <div className={classes.reviewBookingContainer}>
            <Title className={classes.title}>
                Pay <span style={{ color: '#FF6060' }}>₹{totalCharge}</span> to confirm booking
            </Title>

            <div style={{ marginBottom: 24 }}>
                <BookingTrainCard
                    trainName={bookingInfo.selectedTrain?.trainName || ''}
                    trainNumber={bookingInfo.selectedTrain?.trainNumber || ''}
                    classCode={selectedClass?.classCode || ''}
                    fareType={selectedClass?.fareType || ''}
                    departureDate={departureDate || ''}
                    departureTime={departureTime || ''}
                    fromStation={bookingInfo.selectedTrain?.from.station || ''}
                    toStation={bookingInfo.selectedTrain?.to.station || ''}
                    arrivalDate={arrivalDate || ''}
                    arrivalTime={arrivalTime || ''}
                    duration={bookingInfo.selectedTrain?.duration || ''}
                >
                    <Flex vertical gap={8}>
                        <h2 style={{ margin: 0 }}>Traveller Details</h2>
                        {travellerDetails.length === 0 ? (
                            <Text type="secondary">No traveller details provided.</Text>
                        ) : (
                            <Flex vertical gap={8}>
                                {travellerDetails.map((t, idx) => {
                                    const age = t.dateOfBirth ? dayjs().diff(t.dateOfBirth, 'year') : null;
                                    return (
                                        <Flex key={idx} justify="space-between" style={{ width: '100%' }}>
                                            <span>{t.fullname}</span>
                                            <span>{age ?? 'N/A'} Yrs</span>
                                        </Flex>
                                    );
                                })}
                            </Flex>
                        )}

                        <div>
                            {addedFood.length === 0 && !bookingInfo.hasExtraBaggage ? (
                                <Text type="secondary">No extras added.</Text>
                            ) : (
                                <Flex vertical gap={8}>
                                    {[...addedFood.map(f => ({ name: f.name, quantity: 1 })), ...(bookingInfo.hasExtraBaggage ? [{ name: 'Extra Baggage', quantity: 1 }] : [])].map((item, idx) => (
                                        <Flex key={idx} justify="space-between" style={{ width: '100%' }}>
                                            <span>{item.name}</span>
                                            <span>{item.quantity}</span>
                                        </Flex>
                                    ))}
                                </Flex>
                            )}
                        </div>

                        <Flex justify="space-between" style={{ width: '100%' }}>
                            <span>E‑Tickets will be sent to:</span>
                            <span>{contactEmail}</span>
                        </Flex>
                    </Flex>
                </BookingTrainCard>
            </div>

            <Card className={classes.billDetailsCard} style={{ marginBottom: 24 }}>
                <h2>Bill details</h2>
                <div style={{ marginBottom: 16 }}>
                    <Flex justify="space-between" align="center"><span>Base Ticket Fare</span> <span>₹{bookingInfo.billDetails.baseTicketFare ?? 0}</span></Flex>
                    {bookingInfo.billDetails.foodCharges?.map(f => (
                        <Flex key={f.id} justify="space-between" align="center"><span>{f.name}</span> <span>₹{f.price}</span></Flex>
                    ))}
                    {bookingInfo.hasExtraBaggage && <Flex justify="space-between" align="center"><span>Extra Baggage</span> <span>₹{bookingInfo.billDetails.extraBaggage}</span></Flex>}
                    <Flex justify="space-between" align="center"><span>CGST & SGST</span> <span>₹{bookingInfo.billDetails.cgst}</span></Flex>
                    {bookingInfo.billDetails.discount && <Flex justify="space-between" align="center"><span>Discount</span> <span className={classes.discount}>- ₹{bookingInfo.billDetails.discount}</span></Flex>}
                </div>

                <Flex className={classes.totalCharge} justify="space-between" align="center">
                    <span>Total Charge</span>
                    <span>₹{bookingInfo.billDetails.totalAmountWithDiscount ?? 0}</span>
                </Flex>
            </Card>

            <Card style={{ marginBottom: 24 }}>
                <Title level={3} style={{ margin: 0, color: '#111827' }}>Payment Method</Title>
                <Text type="secondary">Please enter your payment method</Text>

                <div style={{ marginTop: 16 }}>
                    <Radio.Group
                        style={{ width: '100%' }}
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                        <Flex vertical gap={12}>
                            <Card
                                bodyStyle={{ padding: paymentMethod === 'card' ? '32px 16px' : 16}}
                                style={{ background: paymentMethod === 'card' ? '#c9d0e4' : '#e4e8f2', borderColor: paymentMethod === 'card' ? '#5E4AE3' : undefined }}
                            >
                                <Radio value="card" style = {{marginBottom: paymentMethod === 'card' ? '24px' : 0, fontWeight: 600}}>Credit Card</Radio>
                                {paymentMethod === 'card' && (
                                    <Form layout="vertical" autoComplete="off">
                                        <Flex gap={16} wrap style={{ marginBottom: 24 }}>
                                            <Form.Item style={{ flex: 1, minWidth: 240, marginBottom: 0 }}>
                                                <div style={{ fontWeight: 600, marginBottom: 16 }}>Card Number</div>
                                                <Input style={{ minHeight: 56, borderRadius: 10 }} placeholder="0000 0000 0000 0000" />
                                            </Form.Item>
                                            <Form.Item style={{ flex: 1, minWidth: 160, marginBottom: 0 }}>
                                                <div style={{ fontWeight: 600, marginBottom: 16 }}>Expiration Date</div>
                                                <Input style={{ minHeight: 56, borderRadius: 10 }} placeholder="MM / YY" />
                                            </Form.Item>
                                        </Flex>
                                        <Flex gap={16} wrap style={{ marginBottom: 0 }}>
                                            <Form.Item style={{ flex: 1, minWidth: 240, marginBottom: 0 }}>
                                                <div style={{ fontWeight: 600, marginBottom: 16 }}>Cardholder</div>
                                                <Input style={{ minHeight: 56, borderRadius: 10 }} placeholder="Cardholder name" />
                                            </Form.Item>
                                            <Form.Item style={{ flex: 1, minWidth: 160, marginBottom: 0 }}>
                                                <div style={{ fontWeight: 600, marginBottom: 16 }}>CVC</div>
                                                <Input style={{ minHeight: 56, borderRadius: 10 }} placeholder="CVC" />
                                            </Form.Item>
                                        </Flex>
                                    </Form>
                                )}
                            </Card>

                            <Card
                                bodyStyle={{ padding: paymentMethod === 'paypal' ? '32px 16px' : 16 }}
                                style={{ background: paymentMethod === 'paypal' ? '#c9d0e4' : '#e4e8f2', borderColor: paymentMethod === 'paypal' ? '#5E4AE3' : undefined }}
                            >
                                <Radio value="paypal" style={{fontWeight: 600}}>PayPal</Radio>
                                {paymentMethod === 'paypal' && (
                                    <div style={{ marginTop: 12 }}>
                                        <Input placeholder="PayPal email" style={{ minHeight: 56, borderRadius: 10 }} />
                                    </div>
                                )}
                            </Card>

                            <Card
                                bodyStyle={{ padding: paymentMethod === 'bitcoin' ? '32px 16px' : 16 }}
                                style={{ background: paymentMethod === 'bitcoin' ? '#c9d0e4' : '#e4e8f2', borderColor: paymentMethod === 'bitcoin' ? '#5E4AE3' : undefined }}
                            >
                                <Radio value="bitcoin" style={{fontWeight: 600}}>Bitcoin</Radio>
                                {paymentMethod === 'bitcoin' && (
                                    <div style={{ marginTop: 12 }}>
                                        <Input placeholder="Wallet address" style={{ minHeight: 56, borderRadius: 10 }} />
                                    </div>
                                )}
                            </Card>
                        </Flex>
                    </Radio.Group>
                </div>

                <Flex vertical align="center" justify="center" gap={16} style={{ marginTop: 16 }}>
                    <Flex gap={16} align="flex-start">
                        <SafetyCertificateOutlined style={{ fontSize: 32, lineHeight: 1, alignSelf: 'center' }} />
                        <Text style={{fontWeight: 600, fontSize: 16, lineHeight: '150%', letterSpacing: '-0.02em' }}>
                            All your data are safe
                        </Text>
                    </Flex>
                    <Text type="secondary" style={{ fontWeight: 500, fontSize: 12, color: 'rgba(1, 4, 0, 0.5)' }}>
                        Discounts, offers and price concessions will be applied later during payment
                    </Text>

                    <Button type="primary" size="large" block style={{minHeight: 54, minWidth: 400, width: 'auto'}}>Book Now</Button>
                    <Button danger ghost size="large" block style={{minHeight: 54, minWidth: 400, width: 'auto'}}>Cancel</Button>
                </Flex>
            </Card>
        </div>
    );
}

export default PaymentPage;
