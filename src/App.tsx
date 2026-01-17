import { Col, Row, Typography } from "antd"
import { useEffect, useState } from "react";
import type { Payment } from "./types";
import { getPayments } from "./api/dailyPayments";
import { getDeposited, getPercent, getTotalAmount } from "./helpers";
import { Error, Layout, Loading } from "./components";

function App() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getPayments((data: Payment[]) => {
        setPayments(data);
        setLoading(false);
      }, () => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const totalAmount = getTotalAmount(payments);

  const deposited = getDeposited(payments);

  const percent = getPercent(deposited, totalAmount);
  
  const rest = totalAmount - deposited;

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error />;
  }

  return (
    <Layout>
      {/* TODO сверстать grid */}
      <Row gutter={[8, 8]}>
          {payments.map((payment) => (
          <Col span={1} key={payment.id}><Typography.Text delete={payment.isPaid}>{payment.title}</Typography.Text></Col>
        ))}
      </Row>
      <p>Общая сумма: {totalAmount}</p>
      <p>Внесённая сумма: {deposited}</p>
      <p>Накоплено: {percent} %</p>
      <p>Осталось внести: {rest}</p>
    </Layout>
  )
}

export default App
