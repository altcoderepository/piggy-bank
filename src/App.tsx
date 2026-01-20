import { Button, Col, notification, Row, Tooltip } from "antd"
import { createContext, useEffect, useMemo, useState } from "react";
import type { Payment } from "./types";
import { getPayments, patchPayment } from "./api/dailyPayments";
import { getDeposited, getPercent, getTotalAmount } from "./helpers";
import { Error, Layout, Loading } from "./components";

const Context = createContext({ name: 'Default' });

function App() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    getPayments((data: Payment[]) => {
        setPayments(data);
        setLoading(false);
      }, () => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const makePayment = (payment: Partial<Payment>) => {
    if(!payment.isPaid) {
      payment.isPaid = true;
      payment.paymentDate = new Date().toLocaleDateString();
    } else {
      payment.isPaid = false;
      payment.paymentDate = null;
    }
    patchPayment(payment, (data: Payment) => {
        api.success({
        title: `Платёж ${data.title} руб. успешно внесён.`
      });
      getPayments((data: Payment[]) => {
        setPayments(data);
        setLoading(false);
      }, () => {
        setError(true);
        setLoading(false);
      });
    }, () => {
      api.error({
      title: 'Ошибка при внесении платёжа.'
    });
  });
  }

  const totalAmount = getTotalAmount(payments);

  const deposited = getDeposited(payments);

  const percent = getPercent(deposited, totalAmount);
  
  const rest = totalAmount - deposited;

  const contextValue = useMemo(() => ({ name: 'Piggy Bank' }), []);

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error />;
  }

  return (
    <Context.Provider value={contextValue}>
      {contextHolder}
      <Layout>
        {/* TODO сверстать grid */}
        <Row gutter={[8, 8]}>
            {payments.map((payment) => (
            <Col span={1} key={payment.id}>
              <Tooltip title={payment.isPaid && `Дата платежа: ${payment.paymentDate}`}>
                <Button type={payment.isPaid ? "primary" : "default"} onClick={() => makePayment(payment)}>{payment.title}</Button>
              </Tooltip>
            </Col>
          ))}
        </Row>
        <p>Общая сумма: {totalAmount}</p>
        <p>Внесённая сумма: {deposited}</p>
        <p>Накоплено: {percent} %</p>
        <p>Осталось внести: {rest}</p>
      </Layout>
    </Context.Provider>
  )
}

export default App
