import { Col, Row, Typography } from "antd"
import { useEffect, useState } from "react";
import type { Payment } from "./types";

function App() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // TODO отдельный модуль и отдельный метод
    fetch('http://localhost:3000/dailyPayments')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error occurred!')
        }
        return response.json();
      })
      .then((data) => {
        setPayments(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  // TODO вынести в отдельный файл все методы
  const totalAmount = payments.reduce((acc, payment) => acc + payment.nominal, 0);

  const deposited = payments
    .filter((payment) => Boolean(payment.isPaid))
    .reduce((acc, payment) => acc + payment.nominal, 0);

  const rest = totalAmount - deposited;

  const percent = Math.floor(deposited / (totalAmount / 100));

  // TODO отдельный компонент загрузки
  if (loading) {
    return (
      <div>
        <Typography.Title>Piggy bank</Typography.Title>
        <div>Loading...</div>
      </div>
    );
  }

  // TODO отдельный компонент ошибки
  if (error) {
    return (
      <div>
        <Typography.Title>Piggy bank</Typography.Title>
        <div>Server error</div>
      </div>
    );
  }

  // TODO отдельный компонент layout
  return (
    <div>
      <Typography.Title>Piggy bank</Typography.Title>
    
          <Row gutter={[8, 8]}>
              {payments.map((payment) => (
              <Col span={1} key={payment.id}><Typography.Text delete={payment.isPaid}>{payment.title}</Typography.Text></Col>
            ))}
          </Row>
          <p>Общая сумма: {totalAmount}</p>
          <p>Внесённая сумма: {deposited}</p>
          <p>Накоплено: {percent} %</p>
          <p>Осталось внести: {rest}</p>
    </div>
  )
}

export default App
